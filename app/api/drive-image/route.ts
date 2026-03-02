import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

function getAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? "";
  const privateKey = rawKey
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .trim() || undefined;

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google credentials");
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

export async function GET(request: NextRequest) {
  const fileId = request.nextUrl.searchParams.get("id");
  if (!fileId || !/^[\w-]+$/.test(fileId)) {
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }

  try {
    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });

    const res = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" }
    );

    const contentType = res.headers["content-type"] || "image/jpeg";
    const data = res.data as ArrayBuffer;

    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}
