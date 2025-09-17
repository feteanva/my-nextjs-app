import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "عرض ودفع الفواتير",
  description: "يمكن للمستخدم الاطلاع على الفاتورة ودفع المبلغ المستحق.",
};

const arabic = localFont({
  src: [
    {
      path: "../public/ABCFavorit-Arabic-Bold.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "../public/ABCFavorit-Arabic-Regular.woff2",
      weight: "400",
      style: "regular",
    },
  ],
  variable: "--font-arabic",
});

const riyal = localFont({
  src: [
    {
      path: "../public/icomoon.29c8899fe74300712def.woff",
      weight: "400",
      style: "regular",
    },
  ],
  variable: "--font-riyal",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${arabic.variable} ${riyal.variable} font-arabic`}
        style={{
          direction: "rtl",
        }}
      >
        {children}
      </body>
    </html>
  );
}
