/**
 * Google Apps Script web app that stores Reach Out form submissions.
 *
 * Setup: open the sheet, Extensions > Apps Script, paste this file, save, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Use the /exec URL as the "endpoint" of the Reach Out Form block.
 */
const SPREADSHEET_ID = '1-ub4HcZfjFBr_wbrqb3ZBV0SFPqLcNfY1EUfGDpWjQc';
const SHEET_GID = 0;
const HEADERS = ['Timestamp', 'First name', 'Last name', 'Mobile', 'Email', 'Page'];

const MOBILE_PATTERN = /^\+?[0-9]{8,15}$/;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

// stop values like "=HYPERLINK(...)" being run as formulas; also keeps "+31..." as text
function asText(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function getSheet() {
  const sheets = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets();
  return sheets.find((sheet) => sheet.getSheetId() === SHEET_GID) || sheets[0];
}

// open the /exec URL in a browser to check the deployment works
function doGet() {
  return json({ result: 'ok' });
}

function doPost(e) {
  const params = (e && e.parameter) || {};
  const entry = {
    firstName: clean(params.firstName, 50),
    lastName: clean(params.lastName, 50),
    mobile: clean(params.mobile, 16),
    email: clean(params.email, 254),
    page: clean(params.page, 200),
  };

  const errors = [];
  if (!entry.firstName) errors.push('First name is required.');
  if (!entry.lastName) errors.push('Last name is required.');
  if (!MOBILE_PATTERN.test(entry.mobile)) errors.push('Mobile number is not valid.');
  if (!EMAIL_PATTERN.test(entry.email)) errors.push('Email is not valid.');
  if (errors.length) return json({ result: 'error', error: errors.join(' ') });

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet();
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([
      new Date(),
      asText(entry.firstName),
      asText(entry.lastName),
      asText(entry.mobile),
      asText(entry.email),
      asText(entry.page),
    ]);
    return json({ result: 'success' });
  } catch (err) {
    return json({ result: 'error', error: 'Could not save the submission.' });
  } finally {
    lock.releaseLock();
  }
}
