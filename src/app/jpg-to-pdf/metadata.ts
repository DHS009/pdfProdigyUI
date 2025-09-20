import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JPG to PDF Converter - Convert Images to PDF Online Free',
  description: 'Convert JPG, PNG, and other images to PDF online. Free image to PDF converter with multiple layout options, batch processing, and high-quality output.',
  keywords: [
    'jpg to pdf',
    'jpeg to pdf',
    'png to pdf',
    'image to pdf',
    'convert jpg to pdf',
    'convert images to pdf',
    'free jpg to pdf converter',
    'online jpg to pdf',
    'combine images to pdf',
    'merge images to pdf',
    'photo to pdf',
    'picture to pdf',
    'webp to pdf',
    'bmp to pdf',
    'tiff to pdf',
    'image converter',
    'pdf creator',
    'images to document',
    'batch image to pdf'
  ].join(', '),
  openGraph: {
    title: 'JPG to PDF Converter - Convert Images to PDF Online Free',
    description: 'Convert JPG, PNG, and other images to PDF online. Free image to PDF converter with multiple layout options, batch processing, and high-quality output.',
    type: 'website',
    url: 'https://pdfprodigy.com/jpg-to-pdf',
    images: [
      {
        url: '/jpg-to-pdf-converter.png',
        width: 1200,
        height: 630,
        alt: 'JPG to PDF Converter - Convert Images to PDF Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG to PDF Converter - Convert Images to PDF Online Free',
    description: 'Convert JPG, PNG, and other images to PDF online. Free image to PDF converter with multiple layout options and batch processing.',
    images: ['/jpg-to-pdf-converter.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/jpg-to-pdf',
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
