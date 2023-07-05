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