import { Metadata } from "next";

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
        {children}
      </body>
    </html>
  );
}