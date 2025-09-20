import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to JPG Converter - Convert PDF Pages to Images Online Free',
  description: 'Convert PDF documents to JPG images online. Free PDF to JPG converter with high-quality image extraction, batch processing, and custom resolution options.',
  keywords: [
    'pdf to jpg',
    'pdf to jpeg',
    'convert pdf to jpg',
    'pdf to image',
    'pdf to png',
    'pdf pages to images',
    'free pdf to jpg converter',
    'online pdf to jpg',
    'pdf image extractor',
    'convert pdf pages',
    'pdf to picture',
    'extract images from pdf',
    'pdf thumbnail generator',
    'pdf to photo',
    'image converter',
    'pdf conversion',
    'document to image',
    'pdf rasterizer',
    'high quality pdf to jpg'
  ].join(', '),
  openGraph: {
    title: 'PDF to JPG Converter - Convert PDF Pages to Images Online Free',
    description: 'Convert PDF documents to JPG images online. Free PDF to JPG converter with high-quality image extraction, batch processing, and custom resolution options.',
    type: 'website',
    url: 'https://pdfprodigy.com/pdf-to-jpg',
    images: [
      {
        url: '/pdf-to-jpg-converter.png',
        width: 1200,
        height: 630,
        alt: 'PDF to JPG Converter - Convert PDF Pages to Images Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to JPG Converter - Convert PDF Pages to Images Online Free',
    description: 'Convert PDF documents to JPG images online. Free PDF to JPG converter with high-quality image extraction and batch processing.',
    images: ['/pdf-to-jpg-converter.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/pdf-to-jpg',
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
