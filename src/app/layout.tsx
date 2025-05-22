import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CameraProvider } from "@/contexts/CamContext";
import { LockProvider } from "@/contexts/LockContext";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Globo Câmeras',
  icons: {
    icon: '/globo-icon.png',
  },
}


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

          {/* <Header /> */}
          <CameraProvider>
            <LockProvider>
              {children}
            </LockProvider>
          </CameraProvider>
        
      </body>
    </html>
  );
}
