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
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5070036872443533"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
