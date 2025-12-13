
import type { Metadata } from 'next';

import { Poppins } from "next/font/google";
import './globals.css';
import ClientLayout from './ClientLayout';

 

export const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['200', '300', '400'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})


export const metadata: Metadata = {
  title: 'Unperline',
  description: 'Kitap keşfetme uygulaması',
  icons: '/favicon.png',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <ClientLayout>
            {children} 
        </ClientLayout>
      </body>
    </html>
  );
}