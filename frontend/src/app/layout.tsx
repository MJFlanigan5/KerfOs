import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KerfOS - Precision Cabinet Design',
  description: 'AI-powered cabinet design tool for woodworkers and DIYers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-50 to-gray-100`}>
        <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
        <div className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20"></div>
        <Navbar />
        {children}
      </body>
    </html>
  )
}