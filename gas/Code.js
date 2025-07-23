
// This function is the entry point for the Web App.
function doPost(e) {
  try {
    // 1. Parse the incoming data from the Node.js app
    const data = JSON.parse(e.postData.contents);

    const teacherName = data.teacher_name || 'N/A';
    const reportType = getReportTypeDisplayName(data.report_type) || 'N/A';
    const requestTime = data.request_time || 'N/A';

    // 2. Define email recipients and subject
    // IMPORTANT: Replace with the actual supervisor's email address
    const supervisorEmail = "chc@test.com"; // TODO: Replace with a real email address
    const subject = `[ESID Teacher Report] ${teacherName} - ${reportType}`;

    // 3. Construct the email body
    const body = `
      <p>Dear ESID Supervisor,</p>
      <p>This is an automated notification from the KCISLK ESID Teacher Reporting Bot.</p>
      <hr>
      <h3>Report Details:</h3>
      <ul>
        <li><strong>Teacher:</strong> ${teacherName}</li>
        <li><strong>Report Type:</strong> ${reportType}</li>
        <li><strong>Time of Report:</strong> ${requestTime}</li>
      </ul>
      <hr>
      <p><strong>Reminder:</strong> This is an initial, non-official report. The teacher has been instructed to complete the formal leave application process through the official school system.</p>
      <p>Thank you.</p>
    `;

    // 4. Send the email using GmailApp
    GmailApp.sendEmail(supervisorEmail, subject, "", { 
      htmlBody: body 
    });

    // 5. Return a success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Email sent successfully.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error for debugging
    console.error("Error in doPost: " + error.toString());

    // 6. Return an error response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Failed to process request.', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper function to get the display name for the report type
function getReportTypeDisplayName(key) {
  const reportTypes = {
    today_absent: "Today's Absence",
    sick_leave: "Sick Leave",
    personal_leave: "Personal Leave",
    late_arrival: "Late Arrival",
    coming_later: "Coming Later",
    other_leave: "Other Leave/Report",
  };
  return reportTypes[key] || key;
}
