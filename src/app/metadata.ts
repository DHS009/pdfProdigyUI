import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Prodigy - Free Online PDF Editor, Merge, Split & Convert PDFs',
  description: 'Free online PDF tools to edit, merge, split, compress, and convert PDFs. No signup required. Secure, fast, and easy-to-use PDF editor with 25+ professional tools for all your document needs.',
  keywords: [
    'pdf editor online',
    'free pdf tools',
    'merge pdf online',
    'split pdf free',
    'compress pdf',
    'pdf to word converter',
    'edit pdf online',
    'pdf merger',
    'pdf splitter',
    'pdf compressor',
    'word to pdf converter',
    'pdf editor free',
    'online pdf editor',
    'pdf tools online',
    'pdf manipulation',
    'pdf converter',
    'pdf utility',
    'document editor',
    'pdf processor',
    'pdf organizer',
    'pdf management',
    'digital document tools',
    'pdf editing software',
    'pdf creator',
    'pdf modifier'
  ],
  authors: [{ name: 'PDF Prodigy Team' }],
  creator: 'PDF Prodigy',
  publisher: 'PDF Prodigy',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pdfprodigy.com',
    title: 'PDF Prodigy - Free Online PDF Editor & Tools',
    description: 'Professional PDF tools online. Edit, merge, split, compress PDFs for free. No signup required. Trusted by millions of users worldwide.',
    siteName: 'PDF Prodigy',
    images: [
      {
        url: '/images/pdf-prodigy-og.jpg',
        width: 1200,
        height: 630,
        alt: 'PDF Prodigy - Free Online PDF Editor and Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Prodigy - Free Online PDF Editor & Tools',
    description: 'Professional PDF tools online. Edit, merge, split, compress PDFs for free. No signup required. Trusted by millions worldwide.',
    images: ['/images/pdf-prodigy-twitter.jpg'],
    creator: '@pdfprodigy',
  },
  alternates: {
    canonical: 'https://pdfprodigy.com',
  },
  category: 'Productivity',
  other: {
    'google-site-verification': 'your-google-verification-code',
  }
};
