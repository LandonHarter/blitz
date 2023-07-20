import { Metadata } from 'next';
import './globals.css';
import RootLayoutContent from './rootlayoutcontent';

export const metadata: Metadata = {
  title: 'Blitz',
  description: 'Host and create fun and educational live games for students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (<RootLayoutContent>{children}</RootLayoutContent>);
}