import { google } from "googleapis";

function getAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? "";
  const privateKey = rawKey
    .replace(/^["']|["']$/g, "")  // strip surrounding quotes if present
    .replace(/\\n/g, "\n")        // convert literal \n to real newlines
    .trim() || undefined;
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();

  if (!clientEmail || !privateKey || !sheetId) {
    throw new Error("Missing Google Sheets environment variables");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
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
