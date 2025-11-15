// ============================================
// GOOGLE APPS SCRIPT - Salon Wheel Spin Logger
// ============================================
// 
// SETUP INSTRUCTIONS:
// 1. Open your Google Sheet: https://sheets.google.com
// 2. Click Extensions > Apps Script
// 3. Delete any existing code
// 4. Paste this entire code
// 5. Click Deploy > New deployment
// 6. Select type: Web app
// 7. Execute as: Me
// 8. Who has access: Anyone
// 9. Click Deploy
// 10. Copy the Web App URL
// 11. Paste the URL into admin-script.js (GOOGLE_SHEET_URL variable)
//
// ============================================

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Date',
        'Time',
        'Offer Text',
        'Offer Description',
        'Offer Code',
        'Device Type',
        'Browser',
        'Screen Size',
        'User Agent'
      ]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4a90e2');
      headerRange.setFontColor('#ffffff');
    }
    
    // Get current timestamp
    const now = new Date();
    const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm:ss');
    
    // Append the new row
    sheet.appendRow([
      now,                        // Timestamp
      dateStr,                    // Date
      timeStr,                    // Time
      data.offerText || '',       // Offer Text (e.g., "10% OFF")
      data.offerDescription || '', // Offer Description
      data.offerCode || '',       // Generated Code
      data.deviceType || '',      // Mobile/Desktop/Tablet
      data.browser || '',         // Browser name
      data.screenSize || '',      // Screen dimensions
      data.userAgent || ''        // Full user agent string
    ]);
    
    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 10);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Spin logged successfully',
        row: sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify setup
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  Logger.log('Sheet name: ' + sheet.getName());
  Logger.log('Last row: ' + sheet.getLastRow());
  Logger.log('Setup test completed successfully!');
}
