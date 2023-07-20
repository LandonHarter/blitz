import { Metadata } from 'next';
import './globals.css';
import RootLayoutContent from './rootlayoutcontent';

export const metadata: Metadata = {
  title: 'Blitz',
  description: 'Use new tools and games to make studying fun.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <RootLayoutContent>
          {children}
        </RootLayoutContent>
      </body>
    </html>
  );
}