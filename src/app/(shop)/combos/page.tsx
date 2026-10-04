'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Sparkles,
    ShoppingBag,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Plus,
    Percent,
} from 'lucide-react'
import { useComboStore } from '@/store/comboStore'
import { useCartStore } from '@/store/cartStore'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CombosPage() {
    const combos = useComboStore(s => s.combos)
    const addItem = useCartStore(s => s.addItem)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="min-h-screen bg-brand-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const activeCombos = combos.filter(c => c.isActive)

    const handleAddComboToCart = (comboTitle: string, products: ProductItem[], comboPrice: number) => {
        // Calculate proportionate discount per product so total matches comboPrice
        const rawTotal = products.reduce((sum, p) => sum + p.salePrice, 0)
        const ratio = comboPrice / rawTotal

        products.forEach(p => {
            const discountedPrice = Math.round(p.salePrice * ratio)
            addItem({
                productId: `${p.id}-combo-${Date.now()}`,
                name: `${p.name} [Part of ${comboTitle}]`,
                image: p.image,
                price: discountedPrice,
                mrp: p.mrp,
                quantity: 1,
                slug: p.slug,
            })
        })

        toast.success(`🎉 Entire ${comboTitle} added to cart for ${formatCurrency(comboPrice)}!`)
    }

    return (
        <div className="min-h-screen bg-brand-black py-10">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-brand-maroon-600 via-brand-maroon to-brand-maroon-600 border-b border-brand-gold/20 py-12 relative overflow-hidden mb-12">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A66B_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1 border border-brand-gold/40 rounded-full mb-4 bg-brand-maroon/50">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                        <span className="text-brand-gold text-xs tracking-[0.25em] uppercase font-sans font-semibold">
                            Curated Artisan Sets
                        </span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-3">
                        Exclusive Jewellery Combos & Sets
                    </h1>
                    <p className="text-brand-silver/70 text-sm max-w-xl mx-auto leading-relaxed">
                        Complete your look with masterfully coordinated royal necklace, jhumka, and kada sets at exclusive bundled prices.
                    </p>
                </div>
            </div>

            {/* Combos Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {activeCombos.length === 0 ? (
                    <div className="text-center py-20 bg-[#1E0A10] border border-brand-gold/15 rounded-sm">
                        <ShoppingBag className="w-12 h-12 text-brand-gold/40 mx-auto mb-3" />
                        <h2 className="font-display text-2xl font-bold text-white mb-2">New Combos Coming Soon</h2>
                        <p className="text-brand-silver/50 text-xs mb-6">Our artisans are curating fresh bridal and festive bundles.</p>
                        <Link href="/shop" className="btn-gold py-2.5 px-6 text-xs uppercase font-bold tracking-wider">
                            Explore All Jewellery
                        </Link>
                    </div>
                ) : (
                    activeCombos.map((combo, idx) => {
                        const products = combo.productIds
                            .map(id => ALL_PRODUCTS.find(p => p.id === id))
                            .filter((p): p is ProductItem => p !== undefined)

                        const rawTotal = products.reduce((sum, p) => sum + p.salePrice, 0)
                        const rawMrp = products.reduce((sum, p) => sum + p.mrp, 0)
                        const savings = Math.max(0, rawTotal - combo.customPrice)
                        const savingsPercent = rawTotal > 0 ? Math.round((savings / rawTotal) * 100) : 0

                        return (
                            <div
                                key={combo.id}
                                className="bg-[#1C0810] border-2 border-brand-gold/30 hover:border-brand-gold/60 rounded-sm overflow-hidden p-6 sm:p-8 transition-all duration-300 shadow-xl relative"
                            >
                                {/* Top Badge */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/20 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-brand-gold text-brand-maroon text-xs font-bold px-3 py-1 rounded-xs uppercase tracking-wider">
                                                {combo.badge}
                                            </span>
                                            <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                                                Save {formatCurrency(savings)} ({savingsPercent}% OFF)
                                            </span>
                                        </div>
                                        <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                                            {combo.title}
                                        </h2>
                                        <p className="text-brand-silver/70 text-xs sm:text-sm mt-1 max-w-2xl">
                                            {combo.description}
                                        </p>
                                    </div>

                                    {/* Pricing & Add to Cart Header Button */}
                                    <div className="flex flex-col sm:items-end gap-1">
                                        <div className="flex items-baseline gap-3">
                                            <span className="font-display text-3xl md:text-4xl font-bold text-brand-gold">
                                                {formatCurrency(combo.customPrice)}
                                            </span>
                                            <span className="text-brand-silver/40 text-base line-through">
                                                {formatCurrency(rawTotal)}
                                            </span>
                                        </div>
                                        <p className="text-brand-silver/50 text-[11px]">
                                            Includes all {products.length} matching pieces · Free Insured Delivery
                                        </p>
                                    </div>
                                </div>

                                {/* Bundled Products Preview Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                                    {products.map((p, pIdx) => (
                                        <div
                                            key={p.id}
                                            className="bg-[#120308] border border-brand-gold/15 rounded-sm p-4 flex gap-4 items-center group relative"
                                        >
                                            <div className="relative w-24 h-24 rounded-xs overflow-hidden bg-brand-maroon-400 border border-brand-gold/20 flex-shrink-0">
                                                <Image
                                                    src={p.image}
                                                    alt={p.name}
                                                    fill
                                                    sizes="120px"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-brand-gold/60 text-[10px] uppercase tracking-wider block mb-0.5">
                                                    Piece #{pIdx + 1} · {p.category}
                                                </span>
                                                <Link
                                                    href={`/product/${p.slug}`}
                                                    className="font-display font-semibold text-white text-sm hover:text-brand-gold line-clamp-2 leading-snug transition-colors"
                                                >
                                                    {p.name}
                                                </Link>
                                                <p className="text-brand-silver/60 text-xs mt-1">
                                                    {p.material} ({p.weight}g)
                                                </p>
                                                <p className="text-brand-gold font-bold text-xs mt-1">
                                                    Standalone: {formatCurrency(p.salePrice)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Action Bar */}
                                <div className="bg-[#260A16] border border-brand-gold/25 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-6 text-xs text-brand-silver/70 flex-wrap">
                                        <span className="flex items-center gap-1.5 text-brand-gold">
                                            <ShieldCheck className="w-4 h-4" /> 100% Certified BIS Hallmark
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Velvet Gift Packaging Included
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={() => handleAddComboToCart(combo.title, products, combo.customPrice)}
                                            className="btn-gold flex-1 sm:flex-initial py-3 px-8 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <ShoppingBag className="w-4 h-4" /> Add Combo to Cart
                                        </button>
                                        <Link
                                            href="/checkout"
                                            onClick={() => handleAddComboToCart(combo.title, products, combo.customPrice)}
                                            className="btn-outline-gold py-3 px-6 text-xs font-bold uppercase tracking-wider text-center"
                                        >
                                            Instant Buy
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
