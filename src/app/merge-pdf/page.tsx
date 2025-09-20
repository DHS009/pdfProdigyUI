import Navigation from '@/components/shared/Navigation';
import MergePdf from '@/components/merge-pdf/MergePdf';
import Footer from '@/components/shared/Footer';

export default function MergePdfPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-8">
        <MergePdf />
      </main>
      <Footer />
    </div>
  );
}
