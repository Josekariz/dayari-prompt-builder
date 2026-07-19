import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dayari Prompt Builder",
  description:
    "Fill in the four source fields and generate the Dayari product-page prompt, ready to paste into Claude.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
