import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare PDF - Document Comparison Tool Online Free | PDF Prodigy',
  description: 'Compare two PDF documents to identify differences, track changes, and analyze document versions. Advanced comparison algorithms with visual, text, and structure analysis. Free online PDF comparison tool.',
  keywords: 'compare PDF, PDF comparison, document comparison, PDF diff, track changes PDF, version comparison, PDF document differences, compare documents online, PDF change tracking, document analysis',
  authors: [{ name: 'PDF Prodigy' }],
  creator: 'PDF Prodigy',
  publisher: 'PDF Prodigy',
  robots: 'index, follow',
  openGraph: {
    title: 'Compare PDF Documents - Track Changes & Differences | PDF Prodigy',
    description: 'Advanced PDF comparison tool to identify differences between document versions. Visual, text, and structure analysis with detailed change reports.',
    type: 'website',
    url: 'https://pdfprodigy.com/compare-pdf',
    siteName: 'PDF Prodigy',
    images: [
      {
        url: '/og-images/compare-pdf.jpg',
        width: 1200,
        height: 630,
        alt: 'Compare PDF Documents - Track Changes and Differences'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pdfprodigy',
    creator: '@pdfprodigy',
    title: 'Compare PDF Documents - Free Online Tool',
    description: 'Identify differences between PDF versions with our advanced comparison tool. Track changes, analyze documents, and generate detailed reports.',
    images: ['/twitter-images/compare-pdf.jpg']
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/compare-pdf'
  },
  other: {
    'application-name': 'PDF Prodigy Compare',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb'
  }
};
