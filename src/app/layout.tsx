'use client'


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { CameraProvider } from "@/contexts/CamContext";
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8F9FA]`}
        suppressHydrationWarning
      >

          <Header />
          <CameraProvider>
            {children}
          </CameraProvider>
          <SpeedInsights />
        
      </body>
    </html>
  );
}
