import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crop PDF - Resize & Trim PDF Pages Online Free | PDF Prodigy',
  description: 'Crop, resize, and trim PDF pages with precision. Remove margins, adjust dimensions, and optimize documents for any format. Multiple crop modes with auto-detection.',
  keywords: 'crop PDF, resize PDF, trim PDF pages, PDF cropping tool, remove PDF margins, adjust PDF size, PDF page trimmer, resize PDF pages, PDF dimension editor, crop PDF online',
  authors: [{ name: 'PDF Prodigy' }],
  creator: 'PDF Prodigy',
  publisher: 'PDF Prodigy',
  robots: 'index, follow',
  openGraph: {
    title: 'Crop PDF - Resize & Trim PDF Pages Online | PDF Prodigy',
    description: 'Professional PDF cropping tool with precision controls. Remove margins, adjust dimensions, and optimize your documents for any format.',
    type: 'website',
    url: 'https://pdfprodigy.com/crop-pdf',
    siteName: 'PDF Prodigy',
    images: [
      {
        url: '/og-images/crop-pdf.jpg',
        width: 1200,
        height: 630,
        alt: 'Crop PDF - Resize and Trim PDF Pages'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pdfprodigy',
    creator: '@pdfprodigy',
    title: 'Crop PDF - Professional PDF Resizing Tool',
    description: 'Crop and resize PDF pages with precision. Remove margins, optimize dimensions, and prepare documents for printing or digital use.',
    images: ['/twitter-images/crop-pdf.jpg']
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/crop-pdf'
  },
  other: {
    'application-name': 'PDF Prodigy Crop',
    'msapplication-TileColor': '#16a34a',
    'theme-color': '#16a34a'
  }
};
