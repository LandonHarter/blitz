import { Metadata } from "next";
import HostLayoutContent from "./layoutcontent";

export const metadata: Metadata = {
  title: 'Host • Blitz',
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