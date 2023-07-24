import { Metadata } from "next";
import HostLayoutContent from "./layoutcontent";

export const metadata: Metadata = {
  title: 'Host • Blitz',
  description: 'Host a Blitz game!',
  other: {
    'og:image': 'https://blitzedu.vercel.app/icon.png',
    'og:title': 'Host • Blitz',
    'og:description': 'Host a Blitz game!',
    'twitter:image': 'https://blitzedu.vercel.app/icon.png',
    'twitter:title': 'Host • Blitz',
    'twitter:description': 'Host a Blitz game!',
    'twitter:card': 'summary_large_image',
  }
};

export default function HostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <HostLayoutContent>
          {children}
        </HostLayoutContent>
      </body>
    </html>
  );
}