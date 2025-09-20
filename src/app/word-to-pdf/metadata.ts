import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word to PDF Converter - Convert DOC, DOCX Files to PDF Online Free',
  description: 'Convert Word documents to PDF instantly. Free online Word to PDF converter supporting DOC, DOCX, RTF, ODT files. Professional quality conversion with perfect formatting preservation.',
  keywords: [
    'word to pdf',
    'doc to pdf',
    'docx to pdf',
    'convert word to pdf',
    'word document to pdf',
    'doc converter',
    'docx converter',
    'rtf to pdf',
    'odt to pdf',
    'free word to pdf converter',
    'online word to pdf',
    'microsoft word to pdf',
    'document converter',
    'pdf converter',
    'word file to pdf',
    'convert documents online',
    'office to pdf',
    'text to pdf',
    'document transformation'
  ].join(', '),
  openGraph: {
    title: 'Word to PDF Converter - Convert DOC, DOCX Files to PDF Online Free',
    description: 'Convert Word documents to PDF instantly. Free online Word to PDF converter supporting DOC, DOCX, RTF, ODT files. Professional quality conversion with perfect formatting preservation.',
    type: 'website',
    url: 'https://pdfprodigy.com/word-to-pdf',
    images: [
      {
        url: '/word-to-pdf-converter.png',
        width: 1200,
        height: 630,
        alt: 'Word to PDF Converter - Convert DOC, DOCX Files to PDF Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word to PDF Converter - Convert DOC, DOCX Files to PDF Online Free',
    description: 'Convert Word documents to PDF instantly. Free online Word to PDF converter supporting DOC, DOCX, RTF, ODT files. Professional quality conversion.',
    images: ['/word-to-pdf-converter.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/word-to-pdf',
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
