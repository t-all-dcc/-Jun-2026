import { getAccessToken } from '../firebase';

export const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_XXXXXXXXXXXX/exec";

export const formatSpreadsheet = async (spreadsheetId?: string) => {
  const token = await getAccessToken();
  if (!token) throw new Error("No Google access token found. Please connect your Google account.");

  let activeSpreadsheetId = spreadsheetId;
  let sheetId = null;
  let sheetTitle = 'System Data Sync';

  if (!activeSpreadsheetId) {
    // 1. Create a new spreadsheet if no ID is provided
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: { title: 'Smart App Database (Synced)' },
        sheets: [{ properties: { title: sheetTitle } }]
      })
    });
    if (!createRes.ok) throw new Error("Could not create a new spreadsheet.");
    const createData = await createRes.json();
    activeSpreadsheetId = createData.spreadsheetId;
    sheetId = createData.sheets[0].properties.sheetId;
  } else {
    // Get spreadsheet info to find the first sheet's ID
    const getRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${activeSpreadsheetId}`, {
       headers: { Authorization: `Bearer ${token}` }
    });
    if (!getRes.ok) throw new Error("Could not fetch spreadsheet metadata.");
    const sheetMeta = await getRes.json();
    sheetId = sheetMeta.sheets[0].properties.sheetId;
    sheetTitle = sheetMeta.sheets[0].properties.title;
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${activeSpreadsheetId}:batchUpdate`;
  const payload = {
    requests: [
      {
        updateSheetProperties: {
          properties: {
            sheetId: sheetId,
            gridProperties: {
              frozenRowCount: 1
            }
          },
          fields: "gridProperties.frozenRowCount"
        }
      },
      {
        repeatCell: {
          range: {
            sheetId: sheetId,
            startRowIndex: 0,
            endRowIndex: 1
          },
          cell: {
            userEnteredFormat: {
              backgroundColorStyle: {
                rgbColor: {
                  red: 208 / 255,   // #d0
                  green: 224 / 255, // #e0
                  blue: 227 / 255   // #e3
                }
              },
              textFormat: {
                bold: true
              }
            }
          },
          fields: "userEnteredFormat(backgroundColorStyle,textFormat)"
        }
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to format sheet: ${err}`);
  }

  // Write default headers to the first sheet
  const headerRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${activeSpreadsheetId}/values/${sheetTitle}!A1:H1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [['ID', 'Module/Type', 'Record Name', 'Code/Ref', 'Status', 'Creator/Owner', 'Date Created', 'Last Updated']]
    })
  });

  if (!headerRes.ok) {
    console.warn("Could not write headers, they might already exist or permission denied.");
  }

  return activeSpreadsheetId;
};
