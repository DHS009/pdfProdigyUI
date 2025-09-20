'use client';

import { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Merge, 
  Split, 
  Minimize2, 
  Edit3, 
  Shield, 
  Zap, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Play,
  Globe,
  Smartphone,
  Cloud,
  Lock,
  Image,
  RotateCw,
  Unlock,
  Eye,
  Hash,
  Scan,
  GitCompare,
  Crop,
  Presentation,
  Table,
  Code,
  FileSignature,
  Droplets,
  LayoutGrid,
  Archive,
  FileCheck,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import Navigation from './shared/Navigation';
import Footer from './shared/Footer';

interface Tool {
  icon: any;
  title: string;
  description: string;
  href: string;
}

interface Feature {
  icon: any;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('all');

  const popularTools: Tool[] = [
    {
      icon: Merge,
      title: 'Merge PDF',
      description: 'Combine multiple PDFs into one unified document',
      href: '/merge-pdf'
    },
    {
      icon: Split,
      title: 'Split PDF', 
      description: 'Separate pages or extract specific sections',
      href: '/split-pdf'
    },
    {
      icon: Minimize2,
      title: 'Compress PDF',
      description: 'Reduce file size without losing quality',
      href: '/compress-pdf'
    },
    {
      icon: Edit3,
      title: 'Edit PDF',
      description: 'Add text, images, shapes and annotations',
      href: '/editor'
    },
    {
      icon: FileText,
      title: 'PDF to Word',
      description: 'Convert PDFs to editable Word documents',
      href: '/pdf-to-word'
    },
    {
      icon: Download,
      title: 'Word to PDF',
      description: 'Transform Word documents to PDF format',
      href: '/word-to-pdf'
    },
    {
      icon: Presentation,
      title: 'PDF to PowerPoint',
      description: 'Convert PDF pages to PowerPoint slides',
      href: '/pdf-to-powerpoint'
    },
    {
      icon: Table,
      title: 'PDF to Excel',
      description: 'Extract tables and data to Excel spreadsheets',
      href: '/pdf-to-excel'
    },
    {
      icon: Presentation,
      title: 'PowerPoint to PDF',
      description: 'Convert presentations to PDF format',
      href: '/powerpoint-to-pdf'
    },
    {
      icon: Table,
      title: 'Excel to PDF',
      description: 'Transform spreadsheets to PDF documents',
      href: '/excel-to-pdf'
    },
    {
      icon: Image,
      title: 'PDF to JPG',
      description: 'Convert PDF pages to high-quality images',
      href: '/pdf-to-jpg'
    },
    {
      icon: Image,
      title: 'JPG to PDF',
      description: 'Create PDFs from your image files',
      href: '/jpg-to-pdf'
    },
    {
      icon: FileSignature,
      title: 'Sign PDF',
      description: 'Add digital signatures to your documents',
      href: '/sign-pdf'
    },
    {
      icon: Droplets,
      title: 'Watermark',
      description: 'Add text or image watermarks to PDFs',
      href: '/watermark'
    },
    {
      icon: RotateCw,
      title: 'Rotate PDF',
      description: 'Rotate pages to correct orientation',
      href: '/rotate-pdf'
    },
    {
      icon: Code,
      title: 'HTML to PDF',
      description: 'Convert web pages and HTML to PDF',
      href: '/html-to-pdf'
    },
    {
      icon: Unlock,
      title: 'Unlock PDF',
      description: 'Remove password protection from PDFs',
      href: '/unlock-pdf'
    },
    {
      icon: Lock,
      title: 'Protect PDF',
      description: 'Add password protection and permissions',
      href: '/protect-pdf'
    },
    {
      icon: LayoutGrid,
      title: 'Organize PDF',
      description: 'Reorder, delete, and reorganize pages',
      href: '/organize-pdf'
    },
    {
      icon: Archive,
      title: 'PDF to PDF/A',
      description: 'Convert to archival PDF/A format',
      href: '/pdf-to-pdfa'
    },
    {
      icon: Wrench,
      title: 'Repair PDF',
      description: 'Fix corrupted or damaged PDF files',
      href: '/repair-pdf'
    },
    {
      icon: Hash,
      title: 'Page numbers',
      description: 'Add page numbers and headers/footers',
      href: '/page-numbers'
    },
    {
      icon: Scan,
      title: 'Scan to PDF',
      description: 'Create PDFs from scanned documents',
      href: '/scan-to-pdf'
    },
    {
      icon: Eye,
      title: 'OCR PDF',
      description: 'Extract text from scanned documents',
      href: '/ocr-pdf'
    },
    {
      icon: GitCompare,
      title: 'Compare PDF',
      description: 'Compare two PDF documents for differences',
      href: '/compare-pdf'
    },
    {
      icon: FileCheck,
      title: 'Redact PDF',
      description: 'Remove sensitive information permanently',
      href: '/redact-pdf'
    },
    {
      icon: Crop,
      title: 'Crop PDF',
      description: 'Trim pages and remove unwanted areas',
      href: '/crop-pdf'
    }
  ];

  const features: Feature[] = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process your PDFs in seconds with our optimized engine'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your files are encrypted and automatically deleted after processing'
    },
    {
      icon: Globe,
      title: 'Works Anywhere',
      description: 'Access from any device, any browser, no installation required'
    },
    {
      icon: Cloud,
      title: 'Cloud Integration',
      description: 'Connect with Google Drive, Dropbox, and OneDrive'
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      content: 'PDF Prodigy has revolutionized how we handle documents. The editing tools are intuitive and powerful.',
      rating: 5
    },
    {
      name: 'David Chen',
      role: 'Small Business Owner',
      content: 'Finally, a PDF tool that just works. No complicated features, just what I need to get things done.',
      rating: 5
    },
    {
      name: 'Maria Rodriguez',
      role: 'Teacher',
      content: 'I use PDF Prodigy daily for creating and editing lesson materials. It saves me hours every week.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Every PDF tool you need in 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> one place</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Work with PDFs like never before. Edit, convert, merge, split, and more with our powerful, 
              easy-to-use tools. All 100% free and secure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/editor" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Choose PDF Files
              </Link>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200 font-semibold text-lg flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No registration required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% secure & private
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Works on all devices
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1B+</div>
              <div className="text-gray-600">Files Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50M+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">27</div>
              <div className="text-gray-600">PDF Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Most Popular PDF Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to work with PDFs efficiently. Try our most-used tools below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {popularTools.map((tool, index) => (
              <Link 
                key={index} 
                href={tool.href}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                    <tool.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {tool.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 font-semibold">
              View All 27 Tools
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PDF Prodigy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the most powerful and user-friendly PDF platform on the web.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your PDF work done in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Upload Your PDF
              </h3>
              <p className="text-gray-600">
                Drag and drop your PDF file or choose from your device, cloud storage, or enter a URL.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Choose Your Tool
              </h3>
              <p className="text-gray-600">
                Select from our comprehensive suite of PDF tools to edit, convert, or organize your document.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Download Result
              </h3>
              <p className="text-gray-600">
                Process completed! Download your file instantly or save it to your preferred cloud storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Millions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our users are saying about their experience with PDF Prodigy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your PDF Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of users who trust PDF Prodigy for all their document needs. 
            Start for free, no registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/editor" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold text-lg shadow-lg flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Get Started Now
            </Link>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Security Badge Section */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="flex items-center space-x-2 text-white">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">256-bit SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">GDPR Compliant</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Your files are automatically deleted after 1 hour
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
