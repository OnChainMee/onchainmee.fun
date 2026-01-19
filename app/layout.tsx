import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OnChainMee.fun - Provably Fair Gaming on Solana',
  description: 'A fully decentralized, provably fair gaming platform built on Solana blockchain. Experience cup selection games with transparent, verifiable outcomes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
          <Toaster position="top-right" />
        </WalletProvider>
      </body>
    </html>
  )
}

