import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { DemoProvider } from '@/lib/demo-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Expense Management System',
  description: 'Digital Purchase & Expense Management Demo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} text-slate-900 bg-slate-50 antialiased`}>
        <DemoProvider>
          <Sidebar />
          <TopBar />
          <main className="ml-64 pt-16 min-h-screen p-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </DemoProvider>
      </body>
    </html>
  );
}
