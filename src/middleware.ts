import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dante-secret-key-2026-gta-rp')

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Allow public paths and static files
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p)) || pathname.startsWith('/_next') || pathname.startsWith('/uploads') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('token')?.value
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    const role = payload.role as string

    // Admin routes
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/painel-cliente', req.url))
    }

    // Client routes - only their own panel
    if (pathname.startsWith('/painel-cliente') && role === 'admin') {
      // Admin can access client panel for testing
      return NextResponse.next()
    }

    // API admin routes
    if (pathname.startsWith('/api/admin') && role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.next()
  } catch {
    // Invalid token
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
