import { NextResponse } from 'next/server'
import { dbGetOrderById, dbUpdateOrderStatus } from '@/lib/db'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const order = dbGetOrderById(id)
        if (!order) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: order })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const updated = dbUpdateOrderStatus(
            id,
            body.orderStatus,
            body.trackingNumber,
            body.courierPartner
        )
        if (!updated) {
            return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: updated })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
