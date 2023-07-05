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