import type { Metadata } from 'next'
import './globals.css'
import RootLayoutClient from './layout.client'

export const metadata: Metadata = {
  title: 'QueryPilot',
  description: 'AI-powered SQL Assistant',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
