import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "簡易版ICD11検索",
  description: "ICD10とICD11のコード・分類名を双方向で検索",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}