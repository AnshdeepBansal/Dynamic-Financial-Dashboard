'use client';

import Header from '@/components/layout/header/Header';
import WidgetGrid from '@/components/widgets/WidgetGrid';
import useWidgetStore from '@/store/widgetStore';

export default function Home() {
  const { theme } = useWidgetStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-teal-50 text-gray-900'}`}>
      <Header />
      <main className="container mx-auto p-3 sm:p-4 md:p-6">
        <WidgetGrid />
      </main>
    </div>
  );
}
