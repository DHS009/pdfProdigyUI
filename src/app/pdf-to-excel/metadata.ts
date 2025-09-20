import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF to Excel Converter - Extract Tables & Data to Spreadsheet Online Free',
  description: 'Convert PDF tables and data to Excel spreadsheets online. Free PDF to Excel converter with smart table detection, form extraction, and high accuracy data conversion.',
  keywords: [
    'pdf to excel',
    'pdf to xlsx',
    'pdf to xls',
    'convert pdf to excel',
    'pdf to spreadsheet',
    'extract tables from pdf',
    'pdf table extractor',
    'free pdf to excel converter',
    'online pdf to excel',
    'pdf data extraction',
    'convert pdf tables to excel',
    'pdf to csv',
    'excel converter',
    'spreadsheet converter',
    'table extraction',
    'pdf form to excel',
    'data conversion',
    'pdf to google sheets',
    'extract data from pdf'
  ].join(', '),
  openGraph: {
    title: 'PDF to Excel Converter - Extract Tables & Data to Spreadsheet Online Free',
    description: 'Convert PDF tables and data to Excel spreadsheets online. Free PDF to Excel converter with smart table detection, form extraction, and high accuracy data conversion.',
    type: 'website',
    url: 'https://pdfprodigy.com/pdf-to-excel',
    images: [
      {
        url: '/pdf-to-excel-converter.png',
        width: 1200,
        height: 630,
        alt: 'PDF to Excel Converter - Extract Tables & Data Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF to Excel Converter - Extract Tables & Data to Spreadsheet Online Free',
    description: 'Convert PDF tables and data to Excel spreadsheets online. Free PDF to Excel converter with smart table detection and high accuracy extraction.',
    images: ['/pdf-to-excel-converter.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/pdf-to-excel',
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
