import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
})

export const metadata: Metadata = {
  title: "Gabriel Lucas - Desenvolvedor Full Stack",
  description:
    "Portfolio de Gabriel Lucas, desenvolvedor full stack especialista em Java, Spring Boot, NestJS, React e Next.js",
  keywords: [
    "desenvolvedor",
    "full stack",
    "java",
    "spring boot",
    "nestjs",
    "react",
    "nextjs",
    "typescript",
    "php",
    "laravel",
  ],
  authors: [{ name: "Gabriel Lucas", url: "https://github.com/gabriellglrs" }],
  creator: "Gabriel Lucas",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Gabriel Lucas - Desenvolvedor Full Stack",
    description:
      "Portfolio de Gabriel Lucas, desenvolvedor full stack especialista em Java, Spring Boot, NestJS, React e Next.js",
    siteName: "Gabriel Lucas Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabriel Lucas - Desenvolvedor Full Stack",
    description:
      "Portfolio de Gabriel Lucas, desenvolvedor full stack especialista em Java, Spring Boot, NestJS, React e Next.js",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.dev',
  icons: {
    icon: "/profile.png", // ou "/favicon.png" ou "/favicon.ico"
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
