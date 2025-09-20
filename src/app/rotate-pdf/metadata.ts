import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotate PDF Pages Online - Fix PDF Orientation Free Tool',
  description: 'Rotate PDF pages online to fix orientation issues. Free PDF rotation tool with 90°, 180°, 270° angles. Rotate all pages, specific pages, or even/odd pages with lossless quality.',
  keywords: [
    'rotate pdf',
    'pdf rotation',
    'rotate pdf pages',
    'fix pdf orientation',
    'pdf page rotation',
    'rotate pdf online',
    'free pdf rotation',
    'pdf orientation tool',
    'turn pdf pages',
    'rotate pdf 90 degrees',
    'rotate pdf 180 degrees',
    'pdf page turner',
    'correct pdf orientation',
    'pdf rotation tool',
    'online pdf rotator',
    'flip pdf pages',
    'pdf page orientation',
    'rotate specific pdf pages',
    'batch pdf rotation'
  ].join(', '),
  openGraph: {
    title: 'Rotate PDF Pages Online - Fix PDF Orientation Free Tool',
    description: 'Rotate PDF pages online to fix orientation issues. Free PDF rotation tool with 90°, 180°, 270° angles. Rotate all pages, specific pages, or even/odd pages with lossless quality.',
    type: 'website',
    url: 'https://pdfprodigy.com/rotate-pdf',
    images: [
      {
        url: '/rotate-pdf-tool.png',
        width: 1200,
        height: 630,
        alt: 'Rotate PDF Pages Online - Fix PDF Orientation Free Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotate PDF Pages Online - Fix PDF Orientation Free Tool',
    description: 'Rotate PDF pages online to fix orientation issues. Free PDF rotation tool with multiple angle options and page selection.',
    images: ['/rotate-pdf-tool.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/rotate-pdf',
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
