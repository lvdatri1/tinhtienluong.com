import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Vietnam Salary Calculator | Tinh Tien Luong',
  description: 'Free, highly accurate Vietnam Salary Calculator for 2024. Calculate gross to net income, PIT, Social Insurance, Health Insurance for Expats and Locals in VND, USD dynamically.',
  keywords: ['Vietnam Salary Calculator', 'Vietnam Net Income', 'Vietnam Income Tax Calculator', 'Tinh Tien Luong', 'Vietnam Expat Tax', 'Vietnam PIT 2024'],
  authors: [{ name: 'Tinh Tien Luong' }],
  openGraph: {
    title: 'Vietnam Salary Calculator - Gross to Net',
    description: 'Instantly calculate your Vietnam net income from your gross salary. Supports Monthly, Annually, Fortnightly across VND and USD. Works offline and is insanely fast.',
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
    <html lang="en">
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
