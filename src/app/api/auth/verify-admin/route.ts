import { NextRequest, NextResponse } from 'next/server'

// This route is called by the middleware to verify admin claims
// It runs in Node.js runtime (not Edge) so can use firebase-admin
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    try {
        const cookie = request.cookies.get('__session')?.value
        if (!cookie) {
            return NextResponse.json({ error: 'No session' }, { status: 401 })
        }

        // Dynamic import to avoid any edge runtime issues
        const { adminAuth } = await import('@/lib/firebase/admin')
        const decoded = await adminAuth.verifySessionCookie(cookie, true)

        // Check for admin custom claim
        const isAdmin = decoded.role === 'admin' || decoded.admin === true
        if (!isAdmin) {
            return NextResponse.json({ error: 'Not admin' }, { status: 403 })
        }

        return NextResponse.json({ uid: decoded.uid, email: decoded.email }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
}
