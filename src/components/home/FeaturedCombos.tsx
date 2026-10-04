'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useComboStore } from '@/store/comboStore'
import { useCartStore } from '@/store/cartStore'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function FeaturedCombos() {
    const combos = useComboStore(s => s.combos)
    const addItem = useCartStore(s => s.addItem)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const activeCombos = combos.filter(c => c.isActive).slice(0, 2)
    if (activeCombos.length === 0) return null

    const handleAddComboToCart = (comboTitle: string, products: ProductItem[], comboPrice: number) => {
        const rawTotal = products.reduce((sum, p) => sum + p.salePrice, 0)
        const ratio = comboPrice / rawTotal

        products.forEach(p => {
            const discountedPrice = Math.round(p.salePrice * ratio)
            addItem({
                productId: `${p.id}-combo-${Date.now()}`,
                name: `${p.name} [${comboTitle}]`,
                image: p.image,
                price: discountedPrice,
                mrp: p.mrp,
                quantity: 1,
                slug: p.slug,
            })
        })

        toast.success(`🎉 ${comboTitle} added to cart for ${formatCurrency(comboPrice)}!`)
    }

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-[#18040C] via-brand-maroon to-[#14030A] relative overflow-hidden border-t border-brand-gold/15">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 text-brand-gold text-xs uppercase tracking-[0.25em] font-semibold mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Exclusive Artisan Bundles</span>
                        </div>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                            Royal Jewellery Combos
                        </h2>
                    </div>
                    <Link
                        href="/combos"
                        className="btn-outline-gold text-xs py-2 px-5 flex items-center gap-1.5 self-start sm:self-auto font-bold uppercase tracking-wider"
                    >
                        View All Combos <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Combos Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {activeCombos.map(combo => {
                        const products = combo.productIds
                            .map(id => ALL_PRODUCTS.find(p => p.id === id))
                            .filter((p): p is ProductItem => p !== undefined)

                        const rawTotal = products.reduce((sum, p) => sum + p.salePrice, 0)
                        const savings = Math.max(0, rawTotal - combo.customPrice)

                        return (
                            <div
                                key={combo.id}
                                className="bg-[#1C0810] border border-brand-gold/30 hover:border-brand-gold/60 rounded-sm p-6 flex flex-col justify-between transition-all duration-300 shadow-xl"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="bg-brand-gold text-brand-maroon text-[10px] font-bold px-2.5 py-0.5 rounded-xs uppercase tracking-wider">
                                            {combo.badge}
                                        </span>
                                        <span className="text-emerald-400 text-xs font-semibold">
                                            Save {formatCurrency(savings)}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-xl font-bold text-white mb-2">
                                        {combo.title}
                                    </h3>
                                    <p className="text-brand-silver/70 text-xs line-clamp-2 mb-6">
                                        {combo.description}
                                    </p>

                                    {/* Products Thumbnail Row */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {products.map(p => (
                                            <div key={p.id} className="text-center">
                                                <div className="relative aspect-square rounded overflow-hidden bg-brand-maroon-400 border border-brand-gold/20 mb-1.5">
                                                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                                                </div>
                                                <p className="text-white text-[11px] font-medium truncate">{p.name}</p>
                                                <p className="text-brand-gold text-[10px] font-bold">{formatCurrency(p.salePrice)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pricing & Action */}
                                <div className="pt-4 border-t border-brand-gold/15 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-brand-silver/40 text-xs line-through">{formatCurrency(rawTotal)}</p>
                                        <p className="font-display text-2xl font-bold text-brand-gold">
                                            {formatCurrency(combo.customPrice)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleAddComboToCart(combo.title, products, combo.customPrice)}
                                        className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" /> Buy Combo
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
