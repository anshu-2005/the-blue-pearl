import { NextResponse } from 'next/server'
import { dbGetProductById, dbGetProductBySlug, dbUpdateProduct, dbDeleteProduct } from '@/lib/db'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        let product = dbGetProductById(id)
        if (!product) {
            product = dbGetProductBySlug(id)
        }
        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: product })
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
        const updated = dbUpdateProduct(id, body)
        if (!updated) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: updated })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const result = dbDeleteProduct(id)
        return NextResponse.json({ success: true, data: result })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
