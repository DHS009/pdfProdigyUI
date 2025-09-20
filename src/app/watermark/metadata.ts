import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Watermark Tool - Add Text & Image Watermarks to PDF Online Free',
  description: 'Add watermarks to PDF documents online. Free PDF watermark tool with text, image, logo, and stamp options. Customize position, opacity, and appearance for branding and security.',
  keywords: [
    'pdf watermark',
    'add watermark to pdf',
    'pdf watermark tool',
    'watermark pdf online',
    'free pdf watermark',
    'text watermark pdf',
    'image watermark pdf',
    'logo watermark pdf',
    'stamp watermark pdf',
    'pdf branding',
    'pdf security watermark',
    'custom pdf watermark',
    'transparent watermark',
    'confidential watermark',
    'draft watermark',
    'pdf protection',
    'document watermarking',
    'online watermark tool',
    'watermark generator'
  ].join(', '),
  openGraph: {
    title: 'PDF Watermark Tool - Add Text & Image Watermarks to PDF Online Free',
    description: 'Add watermarks to PDF documents online. Free PDF watermark tool with text, image, logo, and stamp options. Customize position, opacity, and appearance for branding and security.',
    type: 'website',
    url: 'https://pdfprodigy.com/watermark',
    images: [
      {
        url: '/pdf-watermark-tool.png',
        width: 1200,
        height: 630,
        alt: 'PDF Watermark Tool - Add Text & Image Watermarks to PDF Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Watermark Tool - Add Text & Image Watermarks to PDF Online Free',
    description: 'Add watermarks to PDF documents online. Free PDF watermark tool with multiple watermark types and customization options.',
    images: ['/pdf-watermark-tool.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/watermark',
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
