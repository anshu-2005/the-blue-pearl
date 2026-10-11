import { NextResponse } from 'next/server'
import { dbGetUserProfile, dbUpsertUserProfile } from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid')
        if (!uid) {
            return NextResponse.json({ success: false, error: 'User UID required' }, { status: 400 })
        }
        const user = dbGetUserProfile(uid)
        return NextResponse.json({ success: true, data: user })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { uid, ...data } = body
        if (!uid) {
            return NextResponse.json({ success: false, error: 'User UID required' }, { status: 400 })
        }
        const updated = dbUpsertUserProfile(uid, data)
        return NextResponse.json({ success: true, data: updated })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
