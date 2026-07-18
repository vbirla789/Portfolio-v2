import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { colors } from "./theme";
import { Retune } from "retune";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vishal Birla — Product Designer & Framer Expert",
  description:
    "Engineer-turned-designer building edtech and AI products. I design in Figma, prototype in Framer, and ship experiences that drive measurable results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body
        className="min-h-screen"
        style={{ backgroundColor: colors.background, color: colors.primary }}
      >
        {children}
        {/* Visual tuning overlay — dev only. Press Option+D (Alt+D) to toggle. */}
        <Retune />
      </body>
    </html>
  );
}
