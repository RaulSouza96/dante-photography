import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'DANTE Photography | GTA RP',
  description: 'Fotografia profissional para GTA RP — Casamentos, Eventos, Ensaios, Facções',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full`}>
      <body className="font-[var(--font-poppins)] antialiased min-h-full bg-[#0A0A0A] text-white">
        {children}
      </body>
    </html>
  )
}
