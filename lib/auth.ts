const COOKIE_NAME = "session";
const PAYLOAD = "dashboard-authenticated";

function getSecret(): string {
  const secret = process.env.DASHBOARD_PASSWORD;
  if (!secret) throw new Error("DASHBOARD_PASSWORD is not set");
  return secret;
}

async function hmacSign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const signature = await hmacSign(PAYLOAD, getSecret());
  return `${PAYLOAD}.${signature}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return false;

    const expected = await hmacSign(payload, getSecret());
    return signature === expected;
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
