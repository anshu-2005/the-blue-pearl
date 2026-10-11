import { NextResponse } from 'next/server'
import { dbGetRates, dbUpdateRates } from '@/lib/db'

export async function GET() {
    try {
        const rates = dbGetRates()
        return NextResponse.json({ success: true, data: rates })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const updated = dbUpdateRates(body)
        return NextResponse.json({ success: true, data: updated })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
