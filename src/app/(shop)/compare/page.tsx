'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Scale, X, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useComparisonStore } from '@/store/comparisonStore'
import { useCartStore } from '@/store/cartStore'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ComparePage() {
    const productIds = useComparisonStore(s => s.productIds)
    const removeFromCompare = useComparisonStore(s => s.removeFromCompare)
    const clearCompare = useComparisonStore(s => s.clearCompare)
    const addItem = useCartStore(s => s.addItem)

    const comparedProducts = productIds
        .map(id => ALL_PRODUCTS.find(p => p.id === id))
        .filter((p): p is ProductItem => p !== undefined)

    if (comparedProducts.length === 0) {
        return (
            <div className="min-h-[75vh] bg-brand-black flex flex-col items-center justify-center text-center px-4 py-16">
                <div className="w-20 h-20 rounded-full bg-brand-maroon-300/40 border border-brand-gold/20 flex items-center justify-center mb-6 text-brand-gold/40">
                    <Scale className="w-10 h-10" />
                </div>
                <h1 className="font-display text-3xl font-bold text-white mb-2">No Jewellery in Comparison</h1>
                <p className="text-brand-silver/60 text-xs max-w-sm mb-8 leading-relaxed">
                    Browse our catalogue and tap "Add to Compare" on any jewellery piece to compare metal purity, weights, and pricing side-by-side.
                </p>
                <Link href="/shop" className="btn-gold px-8 py-3 text-xs font-bold uppercase tracking-widest">
                    Browse Catalogue
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-brand-black py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-brand-gold/20">
                    <div>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-1.5 text-xs text-brand-gold/70 hover:text-brand-gold uppercase tracking-wider mb-2"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
                        </Link>
                        <h1 className="font-display text-3xl font-bold text-gold-gradient">
                            Compare Jewellery ({comparedProducts.length}/4)
                        </h1>
                    </div>
                    <button
                        onClick={clearCompare}
                        className="btn-outline-gold text-xs py-2 px-4 self-start sm:self-auto"
                    >
                        Clear Comparison
                    </button>
                </div>

                {/* Full Compare Table */}
                <div className="bg-[#1C0710] border border-brand-gold/25 rounded-sm p-6 overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="border-b border-brand-gold/20">
                                <th className="p-4 w-44 text-brand-silver/50 uppercase tracking-wider font-semibold">Attribute</th>
                                {comparedProducts.map(p => (
                                    <th key={p.id} className="p-4 text-center min-w-[220px]">
                                        <div className="relative w-36 h-36 mx-auto mb-3 rounded-xs overflow-hidden border border-brand-gold/30 bg-brand-maroon-400">
                                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                                            <button
                                                onClick={() => removeFromCompare(p.id)}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                                                title="Remove from comparison"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <Link href={`/product/${p.slug}`} className="font-display font-semibold text-white hover:text-brand-gold line-clamp-1 block text-sm">
                                            {p.name}
                                        </Link>
                                        <p className="text-brand-gold font-bold text-base mt-1">{formatCurrency(p.salePrice)}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-gold/10 text-brand-silver/80">
                            <tr>
                                <td className="p-4 font-semibold text-brand-gold/70">Category</td>
                                {comparedProducts.map(p => (
                                    <td key={p.id} className="p-4 text-center text-white">{p.category}</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-brand-gold/70">Metal & Purity</td>
                                {comparedProducts.map(p => (
                                    <td key={p.id} className="p-4 text-center font-mono text-brand-gold">{p.purity} ({p.material})</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-brand-gold/70">Gross Weight</td>
                                {comparedProducts.map(p => (
                                    <td key={p.id} className="p-4 text-center font-mono text-white">{p.weight} g</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-brand-gold/70">Net Metal Weight</td>
                                {comparedProducts.map(p => (
                                    <td key={p.id} className="p-4 text-center font-mono text-white">{p.netMetalWeight || p.weight} g</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-brand-gold/70">Artisan Making Charges</td>
                                {comparedProducts.map(p => (
                                    <td key={p.id} className="p-4 text-center">₹{p.makingChargePerGram || 150}/g</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-brand-gold/70">Hallmark / Certificate</td>
                                {comparedProducts.map(p => (
                                    <td key={p.id} className="p-4 text-center">
                                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {p.certificateType || 'Govt BIS Hallmark 916'}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-brand-gold/70">Customer Rating</td>
                                {comparedProducts.map(p => (
                                    <td key={p.id} className="p-4 text-center font-bold text-white">⭐ {p.rating} ({p.reviews} reviews)</td>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold text-brand-gold/70">Action</td>
                                {comparedProducts.map(p => (
                                    <td key={p.id} className="p-4 text-center">
                                        <button
                                            onClick={() => {
                                                addItem({
                                                    productId: p.id,
                                                    name: p.name,
                                                    image: p.image,
                                                    price: p.salePrice,
                                                    mrp: p.mrp,
                                                    quantity: 1,
                                                    slug: p.slug,
                                                })
                                                toast.success(`${p.name} added to cart!`)
                                            }}
                                            className="btn-gold py-2 px-5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
