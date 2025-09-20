import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Excel to PDF Converter - Convert XLS, XLSX to PDF Online Free',
  description: 'Convert Excel spreadsheets to PDF online. Free Excel to PDF converter with formatting preservation, chart support, and multiple conversion options for worksheets and workbooks.',
  keywords: [
    'excel to pdf',
    'xls to pdf',
    'xlsx to pdf',
    'convert excel to pdf',
    'spreadsheet to pdf',
    'excel converter',
    'free excel to pdf converter',
    'online excel to pdf',
    'convert xls online',
    'convert xlsx online',
    'excel workbook to pdf',
    'excel worksheet to pdf',
    'csv to pdf',
    'ods to pdf',
    'xlsm to pdf',
    'xlsb to pdf',
    'spreadsheet converter',
    'excel charts to pdf',
    'office to pdf'
  ].join(', '),
  openGraph: {
    title: 'Excel to PDF Converter - Convert XLS, XLSX to PDF Online Free',
    description: 'Convert Excel spreadsheets to PDF online. Free Excel to PDF converter with formatting preservation, chart support, and multiple conversion options for worksheets and workbooks.',
    type: 'website',
    url: 'https://pdfprodigy.com/excel-to-pdf',
    images: [
      {
        url: '/excel-to-pdf-converter.png',
        width: 1200,
        height: 630,
        alt: 'Excel to PDF Converter - Convert XLS, XLSX to PDF Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excel to PDF Converter - Convert XLS, XLSX to PDF Online Free',
    description: 'Convert Excel spreadsheets to PDF online. Free Excel to PDF converter with formatting preservation and chart support.',
    images: ['/excel-to-pdf-converter.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/excel-to-pdf',
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
