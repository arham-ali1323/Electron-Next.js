import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jani',
  description: 'Jani desktop companion AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
