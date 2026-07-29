import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Proteger rutas de dashboard
    if (pathname.startsWith('/testamento') || pathname.startsWith('/herederos') || pathname.startsWith('/bienes') || pathname.startsWith('/firma')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Proteger rutas de notario
    if (pathname.startsWith('/notario')) {
      if (token?.role !== 'NOTARIO' && token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Permitir acceso público a la home y auth
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/registro')) {
          return true;
        }
        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};