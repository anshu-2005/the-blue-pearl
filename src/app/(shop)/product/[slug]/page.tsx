import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

import { ALL_PRODUCTS } from '@/lib/data'

export async function generateStaticParams() {
    return ALL_PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const product = ALL_PRODUCTS.find(p => p.slug === slug)
    if (!product) return { title: 'Product Not Found' }
    return {
        title: product.name,
        description: product.description.slice(0, 160),
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = ALL_PRODUCTS.find(p => p.slug === slug)
    if (!product) notFound()
    const related = ALL_PRODUCTS.filter(p => p.category === product.category && p.slug !== product.slug).slice(0, 4)
    return <ProductDetailClient product={product as any} related={related as any} />
}
