import { db, getAccessToken } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Helper to handle Firestore Error securely as defined by Firebase skill
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  WRITE = 'write',
}
interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const auth = getAuth();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let spreadsheetId: string | null = null;
const SYNC_SHEET_NAME = 'Supplier_MS_Records';

async function initSpreadsheet(token: string) {
  if (spreadsheetId) return spreadsheetId;
  const storedId = localStorage.getItem('vendor_ms_spreadsheet_id');
  if (storedId) {
    spreadsheetId = storedId;
    return spreadsheetId;
  }
  
  // Create a new spreadsheet
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: { title: 'Supplier Management System Database (Synced)' },
      sheets: [{ properties: { title: SYNC_SHEET_NAME } }]
    })
  });
  
  const data = await response.json();
  if (data.spreadsheetId) {
    spreadsheetId = data.spreadsheetId;
    localStorage.setItem('vendor_ms_spreadsheet_id', spreadsheetId!);
    // Setup headers
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SYNC_SHEET_NAME}!A1:H1?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [['ID', 'Material', 'Supplier', 'Standard Type', 'Cert No', 'Auditor Body', 'Issue Date', 'Expiry Date']]
      })
    });
  } else {
    console.error('Failed to create new spreadsheet', data);
    throw new Error('Could not create spreadsheet');
  }
  return spreadsheetId;
}

export async function syncDossierRecord(dossier: any) {
  // 1. Sync to Firestore First
  try {
    await setDoc(doc(db, 'ms_dossiers', dossier.id), dossier);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `ms_dossiers/${dossier.id}`);
  }

  // 2. Sync to Google Sheets
  const token = await getAccessToken();
  if (!token) {
    console.warn('Google Auth token missing. Cannot sync to Sheets. Data is stored in Firestore only.');
    return;
  }
  
  const sId = await initSpreadsheet(token);
  // Find if row exists
  const getResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sId}/values/${SYNC_SHEET_NAME}!A:A`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const getData = await getResp.json();
  let rowIndex = -1;
  if (getData.values) {
    rowIndex = getData.values.findIndex((row: string[]) => row[0] === dossier.id);
  }
  
  const rowData = [
    dossier.id, 
    dossier.material, 
    dossier.supplier, 
    dossier.msType, 
    dossier.certNo, 
    dossier.body, 
    dossier.issueDate, 
    dossier.expiryDate
  ];

  if (rowIndex > -1) {
    // Update existing row
    const rowNum = rowIndex + 1;
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sId}/values/${SYNC_SHEET_NAME}!A${rowNum}:H${rowNum}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [rowData] })
    });
  } else {
    // Append new row
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sId}/values/${SYNC_SHEET_NAME}!A:H:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [rowData] })
    });
  }
}
