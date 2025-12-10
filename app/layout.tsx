import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Red Hare Fortune",
  description: "Red Hare Fortune - 운세 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 한글 레트로 픽셀 폰트 - DungGeunMo (둥근모꼴) CDN */}
        <link
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'DungGeunMo';
                src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff') format('woff');
                font-weight: normal;
                font-style: normal;
              }
            `,
          }}
        />
        {/* 영문 레트로 픽셀 폰트 - Press Start 2P (Google Fonts) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistMono.variable} antialiased`}
        style={{
          fontFamily: "'DungGeunMo', 'Press Start 2P', monospace",
        }}
      >
        {children}
      </body>
    </html>
  );
}
