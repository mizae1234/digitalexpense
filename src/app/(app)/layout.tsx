import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { DemoProvider } from '@/lib/demo-context';
import { getCurrentUser } from '@/lib/auth';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <DemoProvider initialUser={user}>
      <Sidebar />
      <TopBar />
      <main className="ml-64 pt-16 min-h-screen p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </DemoProvider>
  );
}
