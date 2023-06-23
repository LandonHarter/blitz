import { Metadata } from 'next';
import './globals.css';
import Header from '@components/header/header';
import Footer from '@components/footer/footer';

export const metadata:Metadata = {
  title: 'Blitz',
  description: 'Host and create fun and educational live games for students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}