import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'PDF Prodigy - Free Online PDF Editor, Merge, Split & Convert PDFs',
  description: 'Free online PDF tools to edit, merge, split, compress, and convert PDFs. No signup required. Secure, fast, and easy-to-use PDF editor with 25+ professional tools.',
  keywords: [
    'pdf editor online',
    'free pdf tools',
    'merge pdf online',
    'split pdf free',
    'compress pdf',
    'pdf to word converter',
    'edit pdf online'
  ],
  authors: [{ name: 'PDF Prodigy Team' }],
  creator: 'PDF Prodigy',
  publisher: 'PDF Prodigy',
  metadataBase: new URL('https://pdfprodigy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdfprodigy.com',
    title: 'PDF Prodigy - Free Online PDF Editor & Tools',
    description: 'Professional PDF tools online. Edit, merge, split, compress PDFs for free. No signup required. Trusted by millions worldwide.',
    siteName: 'PDF Prodigy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Prodigy - Free Online PDF Editor & Tools',
    description: 'Professional PDF tools online. Edit, merge, split, compress PDFs for free. No signup required.',
    creator: '@pdfprodigy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
