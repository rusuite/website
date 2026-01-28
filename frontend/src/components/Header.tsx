'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-amber-500">
              RuSuite
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/servers"
                className={`text-slate-300 hover:text-white transition ${
                  pathname === '/servers' ? 'text-white' : ''
                }`}
              >
                Servers
              </Link>
              <Link
                href="/about"
                className={`text-slate-300 hover:text-white transition ${
                  pathname === '/about' ? 'text-white' : ''
                }`}
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:text-white transition"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-amber-500 hover:text-amber-400 transition"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
