'use client';

import { Heart, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PP</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">PDF Prodigy</h3>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              A powerful and intuitive PDF editor that helps you create, edit, and manage your PDF documents with ease. 
              Professional tools for all your PDF needs.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-4 md:mb-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by the PDF Prodigy Team</span>
            </div>
            <div className="text-sm text-gray-600">
              © {currentYear} PDF Prodigy. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
