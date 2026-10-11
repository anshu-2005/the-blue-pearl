import { NextResponse } from 'next/server'
import { dbGetOrders, dbCreateOrder } from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId') || undefined
        const orders = dbGetOrders(userId)
        return NextResponse.json({ success: true, count: orders.length, data: orders })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const newOrder = dbCreateOrder(body)
        return NextResponse.json({ success: true, data: newOrder }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
