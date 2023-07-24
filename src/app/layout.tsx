import { Metadata } from 'next';
import './globals.css';
import RootLayoutContent from './rootlayoutcontent';

export const metadata: Metadata = {
  title: 'Blitz',
  description: 'Use new tools and games to make studying fun.',
  other: {
    'og:image': 'https://blitzedu.vercel.app/icon.png',
    'og:title': 'Blitz',
    'og:description': 'Use new tools and games to make studying fun.',
    'twitter:image': 'https://blitzedu.vercel.app/icon.png',
    'twitter:title': 'Blitz',
    'twitter:description': 'Use new tools and games to make studying fun.',
    'twitter:card': 'summary_large_image',
    'google-site-verification': 'QWmCx3KVsj5yp_UxNtZMPbktqsLYSAuRIyYHX0xVCNs'
  }
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