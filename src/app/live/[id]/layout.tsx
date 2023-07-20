import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Game - Blitz",
};

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}