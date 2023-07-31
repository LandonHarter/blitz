import { Metadata } from 'next';
import './globals.css';
import RootLayoutContent from './rootlayoutcontent';
import { basicMetadata } from './backend/util';

export const metadata: Metadata = basicMetadata({});
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