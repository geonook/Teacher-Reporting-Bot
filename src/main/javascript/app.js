require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');

// --- 1. CONFIGURATION ---
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const OFFICIAL_LEAVE_SYSTEM_LINK = process.env.OFFICIAL_LEAVE_SYSTEM_LINK || null;

const client = new line.Client(config);
const app = express();

// --- 2. CONSTANTS AND MAPPINGS ---
const TRIGGER_KEYWORDS = ["report", "i want to report", "leave", "late report", "esid report"];
const REPORT_TYPES_MAP = {
    today_absent: "Today's Absence",
    sick_leave: "Sick Leave",
    personal_leave: "Personal Leave",
    late_arrival: "Late Arrival",
    coming_later: "Coming Later",
    other_leave: "Other Leave/Report",
};

// --- 3. WEBHOOK HANDLER ---
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error("Error processing events: ", err);
      res.status(500).end();
    });
});

// --- 4. MAIN EVENT HANDLER ---
async function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    return handleTextMessage(event);
  } else if (event.type === 'postback') {
    return handlePostbackEvent(event);
  }
  return Promise.resolve(null);
}

// --- 5. TEXT MESSAGE HANDLER ---
async function handleTextMessage(event) {
  const userText = event.message.text.trim().toLowerCase();
  const userId = event.source.userId;

  if (TRIGGER_KEYWORDS.includes(userText)) {
    try {
      const profile = await client.getProfile(userId);
      const teacherName = profile.displayName || "KCISLK ESID Teacher";
      return sendReportingFlexMessage(event.replyToken, teacherName);
    } catch (error) {
      console.error("Failed to get user profile:", error);
      // Proceed with a default name if profile fetch fails
      return sendReportingFlexMessage(event.replyToken, "KCISLK ESID Teacher");
    }
  } else if (userText === 'cancel report') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "The reporting process has been canceled. If you need to report again, please type 'report'."
    });
  } else {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "Hello, I am the KCISLK ESID Reporting Bot. Please type 'report' or click the menu to start the process."
    });
  }
}

// --- 6. POSTBACK EVENT HANDLER ---
async function handlePostbackEvent(event) {
    const data = new URLSearchParams(event.postback.data);
    const reportType = data.get('report_type');
    const teacherName = data.get('name');
    const userId = event.source.userId;

    if (!reportType || !teacherName) {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: "Sorry, your reporting request could not be identified. Please start over."
        });
    }

    try {
        await triggerN8nWorkflow({
            teacher_id: userId,
            teacher_name: teacherName,
            report_type: reportType,
        });
        return sendConfirmationMessage(event.replyToken, teacherName, reportType);
    } catch (error) {
        console.error("Failed to trigger n8n workflow:", error);
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: "Sorry, the reporting application failed. Please try again later or contact the ESID administration."
        });
    }
}


// --- 7. N8N WORKFLOW TRIGGER ---
function triggerN8nWorkflow(payload) {
  const now = new Date();
  const taipeiTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Taipei" }));
  
  const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
  };

  const formatDateTime = (date) => {
      const hh = String(date.getHours()).padStart(2, '0');
      const mi = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      return `${formatDate(date)} ${hh}:${mi}:${ss}`;
  };

  const dataToSend = {
    ...payload,
    request_time: formatDateTime(taipeiTime),
    report_date: formatDate(taipeiTime),
  };

  if (!N8N_WEBHOOK_URL) {
      console.error("N8N_WEBHOOK_URL is not defined!");
      return Promise.reject(new Error("N8N_WEBHOOK_URL is not configured."));
  }

  return axios.post(N8N_WEBHOOK_URL, dataToSend);
}

// --- 8. FLEX MESSAGE AND CONFIRMATION SENDER FUNCTIONS ---

function sendReportingFlexMessage(replyToken, teacherName) {
  const buttons = Object.keys(REPORT_TYPES_MAP).map(key => ({
    type: 'button',
    action: {
      type: 'postback',
      label: REPORT_TYPES_MAP[key],
      data: `report_type=${key}&name=${encodeURIComponent(teacherName)}`,
      displayText: `I want to report: ${REPORT_TYPES_MAP[key]}`
    },
    style: 'primary',
    color: '#0056B3',
    height: 'lg',
    margin: 'sm'
  }));

  const flexMessage = {
    type: 'flex',
    altText: 'KCISLK ESID Reporting System',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'KCISLK ESID Absence/Late Reporting System',
            weight: 'bold',
            color: '#0056B3',
            align: 'center',
            size: 'lg',
            wrap: true
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: '⚠️ Important Notice!',
            weight: 'bold',
            color: '#FF0000',
            size: 'xl',
            align: 'center'
          },
          {
            type: 'separator'
          },
          {
            type: 'text',
            text: 'This system provides a convenient reporting service for teachers of 【KCISLK Elementary School International Division】.',
            wrap: true,
            size: 'md'
          },
          {
            type: 'text',
            text: 'Your selection will directly generate and send an official email to the ESID supervisor.',
            wrap: true,
            size: 'md',
            contents: [
                { type: 'span', text: 'Your selection will directly generate and ' },
                { type: 'span', text: 'send an official email', weight: 'bold' },
                { type: 'span', text: ' to the ESID supervisor.' }
            ]
          },
          {
            type: 'text',
            text: 'Please verify the information carefully. This operation cannot be canceled once confirmed.',
            wrap: true,
            size: 'md',
             contents: [
                { type: 'span', text: 'Please ' },
                { type: 'span', text: 'verify the information carefully', weight: 'bold' },
                { type: 'span', text: '. This operation cannot be canceled once confirmed.' }
            ]
          },
          {
            type: 'separator',
            margin: 'lg'
          },
          {
            type: 'text',
            text: `Hello, ${teacherName} Teacher! What type of report would you like to submit?`,
            wrap: true,
            size: 'md',
            margin: 'md'
          },
          ...buttons
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'Cancel Reporting Process',
              text: 'cancel report'
            },
            style: 'secondary',
            color: '#CCCCCC',
            height: 'md'
          }
        ]
      }
    }
  };

  return client.replyMessage(replyToken, flexMessage);
}

function sendConfirmationMessage(replyToken, teacherName, reportType) {
    const reportDisplayName = REPORT_TYPES_MAP[reportType] || 'Unknown Report';
    const confirmationText = `Hello, Teacher ${teacherName}! Your 【${reportDisplayName}】 report has been received.

This notification has been successfully forwarded to the 【ESID Supervisor】.

⚠️ **Important Reminder: This is only an initial report via Line Bot. Please proceed to the 【Official School Leave System】 to complete your leave application!**

Thank you for your cooperation!`;

    const messages = [{
        type: 'text',
        text: confirmationText
    }];

    if (OFFICIAL_LEAVE_SYSTEM_LINK && OFFICIAL_LEAVE_SYSTEM_LINK.startsWith('http')) {
        messages.push({
            type: 'flex',
            altText: 'Go to Official Leave System',
            contents: {
                type: 'bubble',
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [{
                        type: 'button',
                        action: {
                            type: 'uri',
                            label: 'Go to Official Leave System',
                            uri: OFFICIAL_LEAVE_SYSTEM_LINK
                        },
                        style: 'primary',
                        color: '#0056B3',
                        height: 'md'
                    }]
                }
            }
        });
    }

    return client.replyMessage(replyToken, messages);
}


// --- 9. SERVER START ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
  if (!config.channelAccessToken || !config.channelSecret) {
      console.warn("LINE Channel Access Token or Channel Secret is not set. The bot may not work correctly.");
  }
   if (!N8N_WEBHOOK_URL) {
      console.warn("N8N_WEBHOOK_URL is not set. Reporting to n8n will fail.");
  }
});