import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { logout } from '@/services/auth';
import { getAccessToken } from '@/services/api';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' },
  { href: '/orders', label: 'Orders' },
];

export function Navbar() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(Boolean(getAccessToken()));
  }, [router.pathname]);

  const handleLogout = () => {
    logout();
    setAuthed(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white shadow-card transition-transform group-hover:-rotate-6">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 6H21L19 14H7L4 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M7 18C7.55228 18 8 18.4477 8 19C8 19.5523 7.55228 20 7 20C6.44772 20 6 19.5523 6 19C6 18.4477 6.44772 18 7 18Z" fill="currentColor" />
              <path d="M17 18C17.5523 18 18 18.4477 18 19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19C16 18.4477 16.4477 18 17 18Z" fill="currentColor" />
            </svg>
          </span>
          <span>
            <p className="font-display text-lg leading-none text-ink">Northstar Commerce</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Multi-Tenant Platform</p>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {navItems.map((item) => {
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {authed ? (
            <button
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-coral hover:text-coral"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
