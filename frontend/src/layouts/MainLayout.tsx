import { PropsWithChildren } from 'react';

import { Navbar } from '@/components/layout/Navbar';

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
