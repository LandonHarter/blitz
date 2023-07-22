import { Metadata } from "next";
import LiveLayoutContent from "./layoutcontent";

export const metadata: Metadata = {
  title: "Live Game • Blitz",
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