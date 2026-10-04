'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Scale, X, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useComparisonStore } from '@/store/comparisonStore'
import { useCartStore } from '@/store/cartStore'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProductComparisonDrawer() {
    const productIds = useComparisonStore(s => s.productIds)
    const removeFromCompare = useComparisonStore(s => s.removeFromCompare)
    const clearCompare = useComparisonStore(s => s.clearCompare)
    const addItem = useCartStore(s => s.addItem)

    const [modalOpen, setModalOpen] = useState(false)

    if (productIds.length === 0) return null

    const comparedProducts = productIds
        .map(id => ALL_PRODUCTS.find(p => p.id === id))
        .filter((p): p is ProductItem => p !== undefined)

    return (
        <>
            {/* Floating Comparison Bar at Bottom */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#1A050E]/95 border-2 border-brand-gold/50 rounded-full px-5 py-2.5 shadow-2xl backdrop-blur-md flex items-center gap-4 animate-slide-up max-w-xl w-[92vw] sm:w-auto justify-between">
                <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-brand-gold" />
                    <span className="text-white text-xs font-semibold hidden sm:inline">Compare</span>
                    <span className="text-brand-gold text-xs font-bold font-mono">({comparedProducts.length}/4)</span>
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-2">
                    {comparedProducts.map(p => (
                        <div key={p.id} className="relative w-8 h-8 rounded-full overflow-hidden border border-brand-gold group">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                            <button
                                onClick={() => removeFromCompare(p.id)}
                                className="absolute inset-0 bg-black/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="btn-gold text-xs py-1.5 px-4 font-bold uppercase tracking-wider rounded-full shadow-md"
                    >
                        Compare
                    </button>
                    <button
                        onClick={clearCompare}
                        className="text-brand-silver/50 hover:text-white p-1 text-xs"
                        title="Clear all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Comparison Fullscreen Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#1C0710] border border-brand-gold/40 rounded-sm p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-brand-gold/60 hover:text-brand-gold p-1"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest mb-1">
                            <Scale className="w-4 h-4" />
                            <span>Side-by-Side Evaluation</span>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-white mb-6">Compare Jewellery Specifications</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-brand-gold/20">
                                        <th className="p-3 w-40 text-brand-silver/50 uppercase tracking-wider font-semibold">Attribute</th>
                                        {comparedProducts.map(p => (
                                            <th key={p.id} className="p-3 text-center min-w-[200px]">
                                                <div className="relative w-28 h-28 mx-auto mb-2 rounded overflow-hidden border border-brand-gold/20">
                                                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                                                </div>
                                                <Link href={`/product/${p.slug}`} className="font-display font-semibold text-white hover:text-brand-gold line-clamp-1 block text-sm">
                                                    {p.name}
                                                </Link>
                                                <p className="text-brand-gold font-bold text-sm mt-1">{formatCurrency(p.salePrice)}</p>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-gold/10 text-brand-silver/80">
                                    <tr>
                                        <td className="p-3 font-semibold text-brand-gold/70">Category</td>
                                        {comparedProducts.map(p => (
                                            <td key={p.id} className="p-3 text-center text-white">{p.category}</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-brand-gold/70">Metal & Purity</td>
                                        {comparedProducts.map(p => (
                                            <td key={p.id} className="p-3 text-center font-mono text-brand-gold">{p.purity} ({p.material})</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-brand-gold/70">Gross Weight</td>
                                        {comparedProducts.map(p => (
                                            <td key={p.id} className="p-3 text-center font-mono text-white">{p.weight} g</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-brand-gold/70">Net Metal Weight</td>
                                        {comparedProducts.map(p => (
                                            <td key={p.id} className="p-3 text-center font-mono text-white">{p.netMetalWeight || p.weight} g</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-brand-gold/70">Making Charges</td>
                                        {comparedProducts.map(p => (
                                            <td key={p.id} className="p-3 text-center">₹{p.makingChargePerGram || 150}/g</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-brand-gold/70">Hallmark / Certificate</td>
                                        {comparedProducts.map(p => (
                                            <td key={p.id} className="p-3 text-center">
                                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    {p.certificateType || 'Govt Certified'}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-brand-gold/70">Customer Rating</td>
                                        {comparedProducts.map(p => (
                                            <td key={p.id} className="p-3 text-center font-bold text-white">⭐ {p.rating} ({p.reviews} reviews)</td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-brand-gold/70">Action</td>
                                        {comparedProducts.map(p => (
                                            <td key={p.id} className="p-3 text-center">
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
                                                    className="btn-gold py-2 px-4 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5" /> Buy
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
