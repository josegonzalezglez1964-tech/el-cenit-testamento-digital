'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, FileText, Shield, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/testamento/nuevo', label: 'Crear Testamento' },
    { href: '/herederos', label: 'Herederos' },
    { href: '/bienes', label: 'Bienes' },
    { href: '/firma', label: 'Firma' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cenit-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 font-serif">El Cénit</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Abrir menú</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-cenit-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {status === 'loading' ? null : session ? (
            <>
              <span className="text-sm text-gray-600">{session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1 text-sm font-semibold leading-6 text-gray-900 hover:text-cenit-600 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-cenit-600 transition-colors"
            >
              Iniciar sesión <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-6 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-cenit-600 hover:bg-gray-50"
              >
                Cerrar sesión ({session.user?.email})
              </button>
            ) : (
              <Link
                href="/login"
                className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-cenit-600 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}