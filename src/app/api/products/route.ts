import { NextResponse } from 'next/server'
import { dbGetProducts, dbCreateProduct } from '@/lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category') || undefined
        const featured = searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined

        const products = dbGetProducts({ category, featured })
        return NextResponse.json({ success: true, count: products.length, data: products })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const newProduct = dbCreateProduct(body)
        return NextResponse.json({ success: true, data: newProduct }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
