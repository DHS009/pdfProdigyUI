import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign PDF Online - Digital Signature Tool for PDF Documents Free',
  description: 'Add digital signatures to PDF documents online. Free PDF signing tool with drawing, typing, upload, and digital certificate options. Secure and legally compliant.',
  keywords: [
    'sign pdf',
    'pdf signature',
    'digital signature',
    'esignature',
    'sign pdf online',
    'pdf signing tool',
    'electronic signature',
    'free pdf signer',
    'online pdf signature',
    'digitally sign pdf',
    'pdf document signing',
    'secure pdf signing',
    'legal pdf signature',
    'draw signature pdf',
    'type signature pdf',
    'upload signature pdf',
    'digital certificate signing',
    'cryptographic signature',
    'document authentication'
  ].join(', '),
  openGraph: {
    title: 'Sign PDF Online - Digital Signature Tool for PDF Documents Free',
    description: 'Add digital signatures to PDF documents online. Free PDF signing tool with drawing, typing, upload, and digital certificate options. Secure and legally compliant.',
    type: 'website',
    url: 'https://pdfprodigy.com/sign-pdf',
    images: [
      {
        url: '/sign-pdf-tool.png',
        width: 1200,
        height: 630,
        alt: 'Sign PDF Online - Digital Signature Tool for PDF Documents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign PDF Online - Digital Signature Tool for PDF Documents Free',
    description: 'Add digital signatures to PDF documents online. Free PDF signing tool with multiple signature options and secure processing.',
    images: ['/sign-pdf-tool.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/sign-pdf',
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
};
