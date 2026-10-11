import { NextResponse } from 'next/server'
import { dbGetCoupons, dbGetCouponByCode, dbCreateCoupon, dbDeleteCoupon } from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')

        if (code) {
            const coupon = dbGetCouponByCode(code)
            if (!coupon) {
                return NextResponse.json({ success: false, error: 'Invalid or expired coupon' }, { status: 404 })
            }
            return NextResponse.json({ success: true, data: coupon })
        }

        const coupons = dbGetCoupons()
        return NextResponse.json({ success: true, count: coupons.length, data: coupons })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const newCoupon = dbCreateCoupon(body)
        return NextResponse.json({ success: true, data: newCoupon }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json({ success: false, error: 'Coupon ID required' }, { status: 400 })
        }
        const res = dbDeleteCoupon(id)
        return NextResponse.json({ success: true, data: res })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
