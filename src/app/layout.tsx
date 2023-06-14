import './globals.css'

export const metadata = {
  title: 'Blitz',
  description: 'Host and create fun and educational live games for students',
}

export default function RootLayout({
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
  )
}
