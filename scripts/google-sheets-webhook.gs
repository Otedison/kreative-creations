const CONTACT_SHEET = "Contact submissions";
const ENROLLMENT_SHEET = "Course enrollments";

function doPost(event) {
  const data = event.parameter;
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = data.formType === "enrollment" ? ENROLLMENT_SHEET : CONTACT_SHEET;
  const sheet = getOrCreateSheet(spreadsheet, sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(data.formType === "enrollment"
      ? ["Timestamp", "Name", "Email", "Phone", "Message", "Course"]
      : ["Timestamp", "Name", "Email", "Phone", "Company", "Message", "Consent"]);
  }

  if (data.formType === "enrollment") {
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.message || "",
      data.course || "",
    ]);
  } else {
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.phoneNumber || "",
      data.company || "",
      data.message || "",
      data.consent || "",
    ]);
  }

  return HtmlService.createHtmlOutput(
    "<script>window.top.location.href='" + (data._next || "https://kreativecreations.co.ke/contact?success=true") + "';</script>"
  );
}

function getOrCreateSheet(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}