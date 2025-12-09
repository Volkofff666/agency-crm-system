import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOCTO CRM",
  description: "CRM система для рекламного агентства NOCTO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
