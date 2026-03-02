import type { Metadata, Viewport } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RICTMD Information Board",
  description: "Executive digital signage dashboard for RICTMD, PRO 10",
};

export const viewport: Viewport = {
  width: 1920,
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${oswald.variable} ${sourceSans.variable} antialiased h-screen w-screen`}
        style={{ fontFamily: "var(--font-source-sans), var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
