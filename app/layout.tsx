import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '🚨적토마의 2026년 팩트폭행 운세🚨',
  description: '내년 네 운세가 불타고 있다... 늦기 전에 확인해라. (무료 사주/신년운세)',
  openGraph: {
    title: '🚨적토마의 2026년 팩트폭행 운세🚨',
    description: '뼈 때리는 적토마가 알려주는 너의 2026년 운명. 멘탈 부여잡고 들어와라.',
    url: 'https://your-domain.vercel.app', // 배포 후 실제 도메인으로 변경 필요
    siteName: '적토마 운세',
    images: [
      {
        url: '/og-image.png', // public 폴더에 넣은 이미지 경로
        width: 1200,
        height: 630,
        alt: '2026년 운세 미리보기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '🚨적토마의 2026년 팩트폭행 운세🚨',
    description: '내년 네 운세가 불타고 있다... 늦기 전에 확인해라.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
