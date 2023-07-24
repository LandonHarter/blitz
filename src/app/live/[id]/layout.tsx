import { Metadata } from "next";
import LiveLayoutContent from "./layoutcontent";

export const metadata: Metadata = {
  title: "Live Game • Blitz",
  description: "Play a live game of Blitz!",
  other: {
    "og:image": "https://blitzedu.vercel.app/icon.png",
    "og:title": "Live Game • Blitz",
    "og:description": "Play a live game of Blitz!",
    "twitter:image": "https://blitzedu.vercel.app/icon.png",
    "twitter:title": "Live Game • Blitz",
    "twitter:description": "Play a live game of Blitz!",
    "twitter:card": "summary_large_image",
  }
};

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LiveLayoutContent>
          {children}
        </LiveLayoutContent>
      </body>
    </html>
  );
}