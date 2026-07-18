import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie & Popcorn Day | Store #244",
  description: "Vote for Store #244's Movie & Popcorn Day feature.",
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
