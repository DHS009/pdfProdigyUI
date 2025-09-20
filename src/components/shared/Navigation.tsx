'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Menu, X, ChevronDown } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTools = () => setIsToolsOpen(!isToolsOpen);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PDF Prodigy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={toggleTools}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>Tools</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isToolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <Link href="/editor" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    PDF Editor
                  </Link>
                  <Link href="/merge-pdf" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Merge PDF
                  </Link>
                  <Link href="/split-pdf" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Split PDF
                  </Link>
                  <Link href="/compress-pdf" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Compress PDF
                  </Link>
                  <Link href="/pdf-to-word" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    PDF to Word
                  </Link>
                  <Link href="/word-to-pdf" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                    Word to PDF
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              Help
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link href="/editor" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link href="/editor" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Tools
              </Link>
              <Link href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">
                Help
              </Link>
              <Link href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">
                About
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <Link href="#" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/editor" className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
