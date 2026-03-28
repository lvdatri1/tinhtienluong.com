import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Tính Lương Gross Sang Net & Công Cụ Tài Chính Việt Nam 2025',
  description: 'Công cụ tính lương Gross sang Net chuẩn xác nhất Việt Nam 2025. Tính Thuế TNCN, BHXH, Chi phí sinh hoạt và Lãi suất vay ngân hàng.',
  keywords: ['Tính Lương Gross Sang Net', 'Lương Net', 'Tính Thuế TNCN', 'Tinh Tien Luong', 'BHXH 2025', 'Lãi suất ngân hàng'],
  authors: [{ name: 'Tinh Tien Luong' }],
  openGraph: {
    title: 'Tính Lương Gross Sang Net & Công Cụ Tài Chính',
    description: 'Tính toán chính xác lương thực nhận, bảo hiểm và kế hoạch tài chính tại Việt Nam. Cập nhật quy định mới nhất 2024-2025.',
    url: 'https://tinhtienluong.com',
    siteName: 'Tinh Tien Luong',
    type: 'website'
  },
  alternates: {
    canonical: 'https://tinhtienluong.com'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-KR282NR');`}
        </Script>
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5070036872443533"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-KR282NR"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {children}
      </body>
    </html>
  );
}
