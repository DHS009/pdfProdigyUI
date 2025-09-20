import Navigation from '@/components/shared/Navigation';
import SplitPdf from '@/components/split-pdf/SplitPdf';
import Footer from '@/components/shared/Footer';

export default function SplitPdfPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <SplitPdf />
      </main>
      <Footer />
    </div>
  );
}
