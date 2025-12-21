import type React from "react"
import type { Metadata } from "next"
import "./globals.css"


export const metadata: Metadata = {
  title: "ClimaVault - Historical Weather Data API & Analytics Platform",
  description:
    "Access 90TB+ of historical weather data from 1940-present. Professional weather API with global coverage, 100+ variables, and powerful analytics. Trusted by 10,000+ developers and researchers worldwide.",
  keywords: [
    "historical weather data",
    "weather API",
    "climate data",
    "meteorological data",
    "weather analytics",
    "OpenMeteo",
    "weather research",
    "climate analysis",
    "weather dashboard",
    "atmospheric data",
  ],
  authors: [{ name: "ClimaVault" }],
  creator: "ClimaVault",
  publisher: "ClimaVault",
  robots: "index, follow",
  openGraph: {
    title: "ClimaVault - Historical Weather Data API & Analytics",
    description:
      "Professional weather data platform with 90TB+ historical records since 1940. Global coverage, 100+ variables, powerful analytics.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClimaVault - Historical Weather Data API",
    description:
      "Access 90TB+ historical weather data from 1940-present. Professional API with global coverage and analytics.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-segoe antialiased">
        {children}
      </body>
    </html>
  )
}
