import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kunal Pawar | IT-OT Engineer & Automation Specialist",
  description: "Portfolio of Kunal Pawar - AI Vision, IIoT and Industry 4.0 specialist.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}