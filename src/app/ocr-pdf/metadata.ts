import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCR PDF - Extract Text from Scanned PDFs Online Free | PDF Prodigy',
  description: 'Extract text from scanned PDFs using advanced OCR (Optical Character Recognition). Convert image-based PDFs to searchable, editable documents. 16+ languages supported, high accuracy, free online tool.',
  keywords: 'OCR PDF, PDF text recognition, extract text from PDF, scanned PDF to text, PDF OCR online, optical character recognition, searchable PDF, PDF to text converter, multilingual OCR, image to text PDF',
  authors: [{ name: 'PDF Prodigy' }],
  creator: 'PDF Prodigy',
  publisher: 'PDF Prodigy',
  robots: 'index, follow',
  openGraph: {
    title: 'OCR PDF - Extract Text from Scanned PDFs | PDF Prodigy',
    description: 'Advanced OCR technology to extract text from scanned PDFs. Convert image-based documents to searchable, editable format with 98% accuracy.',
    type: 'website',
    url: 'https://pdfprodigy.com/ocr-pdf',
    siteName: 'PDF Prodigy',
    images: [
      {
        url: '/og-images/ocr-pdf.jpg',
        width: 1200,
        height: 630,
        alt: 'OCR PDF - Extract Text from Scanned Documents'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pdfprodigy',
    creator: '@pdfprodigy',
    title: 'OCR PDF - Extract Text from Scanned PDFs Free',
    description: 'Convert scanned PDFs to searchable text with our advanced OCR technology. 16+ languages, high accuracy, secure processing.',
    images: ['/twitter-images/ocr-pdf.jpg']
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/ocr-pdf'
  },
  other: {
    'application-name': 'PDF Prodigy OCR',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb'
  }
};
