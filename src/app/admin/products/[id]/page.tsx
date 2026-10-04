'use client'

import React, { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAdminProductStore } from '@/store/adminProductStore'
import ProductEditModal from '@/components/admin/ProductEditModal'

export default function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const products = useAdminProductStore((s) => s.products)
    const product = products.find((p) => p.id === resolvedParams.id || p.slug === resolvedParams.id)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/products"
                    className="p-2 rounded-full border border-brand-gold/30 hover:border-brand-gold text-brand-gold transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <h1 className="text-xl font-bold font-display text-white">
                    {product ? `Editing: ${product.name}` : 'Product Not Found'}
                </h1>
            </div>

            {product ? (
                <ProductEditModal
                    isOpen={true}
                    onClose={() => router.push('/admin/products')}
                    productToEdit={product}
                />
            ) : (
                <div className="p-8 text-center text-brand-silver/50 bg-[#14050D] border border-brand-gold/20 rounded-lg">
                    Product with ID "{resolvedParams.id}" was not found in the catalogue.
                    <div className="mt-4">
                        <Link href="/admin/products" className="btn-gold py-2 px-4 text-xs font-bold uppercase">
                            Back to Products
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
