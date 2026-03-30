import type { Metadata } from "next";
import "./globals.css";
import { PHProvider } from "./providers";

export const metadata: Metadata = {
  title: "TeamAutomation",
  description: "Slack Approval Automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PHProvider>{children}</PHProvider>
      </body>
    </html>
  );
}