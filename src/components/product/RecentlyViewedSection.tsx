'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { History, Sparkles } from 'lucide-react'
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

export default function RecentlyViewedSection({ currentSlug }: { currentSlug?: string }) {
    const recentSlugs = useRecentlyViewedStore(s => s.recentSlugs)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const viewedProducts = recentSlugs
        .filter(s => s !== currentSlug)
        .map(slug => ALL_PRODUCTS.find(p => p.slug === slug))
        .filter((p): p is ProductItem => p !== undefined)
        .slice(0, 6)

    if (viewedProducts.length === 0) return null

    return (
        <div className="mt-16 pt-10 border-t border-brand-gold/15">
            <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest mb-1 font-semibold">
                <History className="w-3.5 h-3.5" />
                <span>Your Browsing History</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-6">Recently Viewed Pieces</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                {viewedProducts.map(p => (
                    <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        className="bg-[#1C0810] border border-brand-gold/15 hover:border-brand-gold/50 rounded-sm overflow-hidden p-2.5 group transition-all"
                    >
                        <div className="relative aspect-square rounded-xs overflow-hidden bg-brand-maroon-400 mb-2">
                            <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="160px"
                                className="object-cover group-hover:scale-105 transition-transform"
                            />
                        </div>
                        <p className="text-[10px] text-brand-gold/60 uppercase tracking-wider">{p.category}</p>
                        <h4 className="text-white text-xs font-display font-medium line-clamp-1 group-hover:text-brand-gold transition-colors">
                            {p.name}
                        </h4>
                        <p className="text-brand-gold font-bold text-xs mt-1">{formatCurrency(p.salePrice)}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
