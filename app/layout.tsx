import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: 'CRM - Управление агентством',
  description: 'Профессиональная CRM система для рекламного агентства',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
