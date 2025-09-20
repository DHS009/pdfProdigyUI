import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redact PDF - Secure Document Redaction Tool Online Free | PDF Prodigy',
  description: 'Permanently remove sensitive information from PDF documents using military-grade redaction technology. Auto-detect PII, SSN, credit cards, and custom content. Secure, compliant, and free.',
  keywords: 'redact PDF, PDF redaction, remove sensitive information, PDF privacy, document redaction, PII removal, secure PDF, black out PDF, censor PDF, confidential document redaction',
  authors: [{ name: 'PDF Prodigy' }],
  creator: 'PDF Prodigy',
  publisher: 'PDF Prodigy',
  robots: 'index, follow',
  openGraph: {
    title: 'Redact PDF - Secure Document Redaction Tool | PDF Prodigy',
    description: 'Military-grade PDF redaction tool to permanently remove sensitive information. Auto-detect PII, customize redaction styles, and ensure compliance.',
    type: 'website',
    url: 'https://pdfprodigy.com/redact-pdf',
    siteName: 'PDF Prodigy',
    images: [
      {
        url: '/og-images/redact-pdf.jpg',
        width: 1200,
        height: 630,
        alt: 'Redact PDF - Secure Document Redaction Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pdfprodigy',
    creator: '@pdfprodigy',
    title: 'Redact PDF - Military-Grade Document Security',
    description: 'Permanently remove sensitive information from PDFs. Auto-detect PII, SSN, credit cards. Military-grade security with audit trails.',
    images: ['/twitter-images/redact-pdf.jpg']
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/redact-pdf'
  },
  other: {
    'application-name': 'PDF Prodigy Redact',
    'msapplication-TileColor': '#dc2626',
    'theme-color': '#dc2626'
  }
};
