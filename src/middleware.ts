import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // ── Admin route protection ────────────────────────────────────────────────
    if (pathname.startsWith('/admin')) {
        const session = request.cookies.get('__session')?.value

        // Allow direct access in development mode so local admin works seamlessly
        if (!session && process.env.NODE_ENV === 'development') {
            return NextResponse.next()
        }

        if (!session) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }

        // Verify admin claim via our own API endpoint to avoid importing firebase-admin in middleware
        try {
            const verifyUrl = new URL('/api/auth/verify-admin', request.url)
            const res = await fetch(verifyUrl.toString(), {
                headers: { Cookie: `__session=${session}` },
            })

            if (!res.ok) {
                const loginUrl = new URL('/login', request.url)
                loginUrl.searchParams.set('redirect', pathname)
                loginUrl.searchParams.set('error', 'unauthorized')
                return NextResponse.redirect(loginUrl)
            }
        } catch {
            // On error, allow the page to load
        }
    }

    // ── Protected account routes (excluding wishlist which is public client-side) ──
    if (pathname.startsWith('/account') && !pathname.startsWith('/account/wishlist')) {
        const session = request.cookies.get('__session')?.value
        if (!session) {
            // For account pages, redirect to /login
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/account/:path*'],
}
