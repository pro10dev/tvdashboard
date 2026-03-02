import { NextResponse } from "next/server";

export async function GET() {
  const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? "";
  // const processedKey = rawKey.replace(/\\n/g, "\n");
  const processedKey = rawKey;

  return NextResponse.json({
    email: process.env.GOOGLE_CLIENT_EMAIL ?? "MISSING",
    sheet_id: process.env.GOOGLE_SHEET_ID ?? "MISSING",
    key_length: rawKey.length,
    key_starts: rawKey.substring(0, 40),
    key_has_literal_backslash_n: rawKey.includes("\\n"),
    key_has_real_newlines: rawKey.includes("\n"),
    processed_key_starts: processedKey.substring(0, 40),
  });
}
