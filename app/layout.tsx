import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlipTronics — Fresh Drops for Gamers & Power Users",
  description: "Clean-condition laptops, consoles, RAM and SSDs. First come, first served. DM on WhatsApp to close the deal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
