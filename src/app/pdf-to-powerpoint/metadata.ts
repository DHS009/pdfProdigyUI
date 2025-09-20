import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to PowerPoint Converter - Convert PDF to PPT Online Free',
  description: 'Convert PDF documents to editable PowerPoint presentations online. Free PDF to PPT converter with multiple conversion modes, perfect formatting preservation, and professional templates.',
  keywords: [
    'pdf to powerpoint',
    'pdf to ppt',
    'pdf to pptx',
    'convert pdf to powerpoint',
    'pdf to presentation',
    'pdf to slides',
    'free pdf to ppt converter',
    'online pdf to powerpoint',
    'pdf presentation converter',
    'editable powerpoint from pdf',
    'pdf to slide converter',
    'document to presentation',
    'pdf transformation',
    'powerpoint conversion',
    'ppt converter',
    'presentation maker',
    'slides from pdf',
    'pdf to office',
    'document converter'
  ].join(', '),
  openGraph: {
    title: 'PDF to PowerPoint Converter - Convert PDF to PPT Online Free',
    description: 'Convert PDF documents to editable PowerPoint presentations online. Free PDF to PPT converter with multiple conversion modes, perfect formatting preservation, and professional templates.',
    type: 'website',
    url: 'https://pdfprodigy.com/pdf-to-powerpoint',
    images: [
      {
        url: '/pdf-to-powerpoint-converter.png',
        width: 1200,
        height: 630,
        alt: 'PDF to PowerPoint Converter - Convert PDF to PPT Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to PowerPoint Converter - Convert PDF to PPT Online Free',
    description: 'Convert PDF documents to editable PowerPoint presentations online. Free PDF to PPT converter with multiple conversion modes and professional templates.',
    images: ['/pdf-to-powerpoint-converter.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/pdf-to-powerpoint',
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
