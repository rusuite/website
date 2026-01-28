'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-amber-500 mb-4">RuSuite</h3>
            <p className="text-slate-400 text-sm">
              The premier RuneScape private server listing and discovery platform.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/servers" className="text-slate-400 hover:text-white text-sm transition">
                  Browse Servers
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white text-sm transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">For Server Owners</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-400 hover:text-white text-sm transition">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 RuSuite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
