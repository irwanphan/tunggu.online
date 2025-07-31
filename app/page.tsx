import { WebsiteStatus } from '@/components/WebsiteStatus';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main>
        <Hero />
        <Features />
        <WebsiteStatus />
      </main>
    </div>
  );
}
