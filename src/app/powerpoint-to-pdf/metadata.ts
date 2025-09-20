import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PowerPoint to PDF Converter - Convert PPT to PDF Online Free',
  description: 'Convert PowerPoint presentations to PDF online. Free PPT to PDF converter with multiple layout options including handouts, speaker notes, and high-quality slides.',
  keywords: [
    'powerpoint to pdf',
    'ppt to pdf',
    'pptx to pdf',
    'convert powerpoint to pdf',
    'presentation to pdf',
    'slides to pdf',
    'free ppt to pdf converter',
    'online powerpoint to pdf',
    'convert ppt online',
    'presentation converter',
    'powerpoint handouts pdf',
    'slides with notes pdf',
    'pps to pdf',
    'ppsx to pdf',
    'odp to pdf',
    'office to pdf',
    'presentation to document',
    'slide converter',
    'powerpoint export pdf'
  ].join(', '),
  openGraph: {
    title: 'PowerPoint to PDF Converter - Convert PPT to PDF Online Free',
    description: 'Convert PowerPoint presentations to PDF online. Free PPT to PDF converter with multiple layout options including handouts, speaker notes, and high-quality slides.',
    type: 'website',
    url: 'https://pdfprodigy.com/powerpoint-to-pdf',
    images: [
      {
        url: '/powerpoint-to-pdf-converter.png',
        width: 1200,
        height: 630,
        alt: 'PowerPoint to PDF Converter - Convert PPT to PDF Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PowerPoint to PDF Converter - Convert PPT to PDF Online Free',
    description: 'Convert PowerPoint presentations to PDF online. Free PPT to PDF converter with multiple layout options and high-quality output.',
    images: ['/powerpoint-to-pdf-converter.png'],
  },
  alternates: {
    canonical: 'https://pdfprodigy.com/powerpoint-to-pdf',
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
