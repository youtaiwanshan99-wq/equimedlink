import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EquiMed Spot MVP',
  description: '医師スポット募集のMVP',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
