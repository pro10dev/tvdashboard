import { google } from "googleapis";

function getAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !sheetId) {
    throw new Error("Missing Google Sheets environment variables");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return { auth, sheetId };
}

export async function fetchSheetTab(tabName: string): Promise<string[][]> {
  const { auth, sheetId } = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: tabName,
  });

  return (response.data.values as string[][]) ?? [];
}
