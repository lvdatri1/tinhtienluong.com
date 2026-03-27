import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vietnam Salary Calculator | Tinh Tien Luong',
  description: 'Calculate your net income easily with latest 2024 tax rules for Expats and Locals in Vietnam (USD and VND supported).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
