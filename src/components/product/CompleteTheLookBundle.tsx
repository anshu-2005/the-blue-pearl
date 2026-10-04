'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react'
import { ProductItem, ALL_PRODUCTS } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface CompleteTheLookBundleProps {
    currentProduct: ProductItem
}

export default function CompleteTheLookBundle({ currentProduct }: CompleteTheLookBundleProps) {
    const addItem = useCartStore(s => s.addItem)

    // Find bundle items from product's bundleSlugs or fallback to same category
    const bundleSlugs = currentProduct.bundleSlugs || []
    const matchingProducts = ALL_PRODUCTS.filter(p => bundleSlugs.includes(p.slug)).slice(0, 2)

    // Include current product + matching products in bundle
    const allBundleItems = [currentProduct, ...matchingProducts]
    const [selectedIds, setSelectedIds] = useState<string[]>(allBundleItems.map(p => p.id))

    if (matchingProducts.length === 0) return null

    const toggleItem = (id: string) => {
        if (id === currentProduct.id) return // Always include main item
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const selectedProducts = allBundleItems.filter(p => selectedIds.includes(p.id))
    const rawTotal = selectedProducts.reduce((sum, p) => sum + p.salePrice, 0)
    const rawMrp = selectedProducts.reduce((sum, p) => sum + p.mrp, 0)
    // 5% Extra bundle bonus when 2+ items selected
    const bundleDiscount = selectedProducts.length > 1 ? Math.round(rawTotal * 0.05) : 0
    const finalBundlePrice = rawTotal - bundleDiscount

    const handleAddBundleToCart = () => {
        selectedProducts.forEach(p => {
            addItem({
                productId: p.id,
                name: p.name,
                image: p.image,
                price: p.salePrice,
                mrp: p.mrp,
                quantity: 1,
                slug: p.slug,
            })
        })
        toast.success(`Complete Look (${selectedProducts.length} pieces) added to Cart!`)
    }

    return (
        <div className="bg-[#1C0810] border border-brand-gold/30 rounded-sm p-6 my-10 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 text-brand-gold text-[11px] uppercase tracking-widest font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Curated Coordination</span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-white">Complete the Royal Look</h2>
                    <p className="text-brand-silver/60 text-xs mt-0.5">
                        Hand-picked matching jewellery pieces styled by master craftsmen
                    </p>
                </div>
                {bundleDiscount > 0 && (
                    <span className="bg-brand-gold text-brand-maroon text-xs font-bold px-3 py-1 rounded-xs uppercase tracking-wider hidden sm:block">
                        Extra 5% Bundle Bonus
                    </span>
                )}
            </div>

            {/* Product Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
                {allBundleItems.map((item, idx) => {
                    const isSelected = selectedIds.includes(item.id)
                    const isMain = item.id === currentProduct.id

                    return (
                        <div key={item.id} className="relative">
                            <div
                                onClick={() => !isMain && toggleItem(item.id)}
                                className={`bg-brand-maroon-300/50 border rounded-sm p-3 flex items-center gap-3 transition-all ${
                                    isSelected
                                        ? 'border-brand-gold/60 ring-1 ring-brand-gold/30'
                                        : 'border-brand-gold/15 opacity-60'
                                } ${!isMain ? 'cursor-pointer hover:border-brand-gold' : ''}`}
                            >
                                <div className="relative w-16 h-16 rounded overflow-hidden bg-brand-maroon flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-[10px] text-brand-gold/60 uppercase tracking-wider block">
                                        {isMain ? 'This Item' : item.category}
                                    </span>
                                    <p className="text-white text-xs font-display font-medium truncate">
                                        {item.name}
                                    </p>
                                    <p className="text-brand-gold font-bold text-xs mt-1">
                                        {formatCurrency(item.salePrice)}
                                    </p>
                                </div>
                                <div className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                                    isSelected ? 'bg-brand-gold text-brand-maroon' : 'border border-brand-gold/40 text-transparent'
                                }`}>
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Bundle Checkout Row */}
            <div className="bg-[#240A14] border border-brand-gold/20 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-brand-silver/60 text-xs">Bundle Total ({selectedProducts.length} items):</span>
                        <span className="font-display text-xl font-bold text-brand-gold">
                            {formatCurrency(finalBundlePrice)}
                        </span>
                        {rawMrp > finalBundlePrice && (
                            <span className="text-brand-silver/40 text-xs line-through">
                                {formatCurrency(rawMrp)}
                            </span>
                        )}
                    </div>
                    {bundleDiscount > 0 && (
                        <p className="text-emerald-400 text-xs mt-0.5 font-medium">
                            ✦ Includes extra 5% bundle discount ({formatCurrency(bundleDiscount)} saved)
                        </p>
                    )}
                </div>

                <button
                    onClick={handleAddBundleToCart}
                    className="btn-gold py-3 px-6 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-4 h-4" /> Add Bundle to Cart
                </button>
            </div>
        </div>
    )
}
