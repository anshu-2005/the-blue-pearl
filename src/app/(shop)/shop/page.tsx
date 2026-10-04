'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { SlidersHorizontal, Heart, ShoppingBag, Star, X, Sparkles, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatCurrency } from '@/lib/utils'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const CATEGORIES = [
    { label: 'All Jewellery', value: '' },
    { label: 'Bangles & Kadas', value: 'Bangles' },
    { label: 'Necklaces & Chokers', value: 'Necklaces' },
    { label: 'Earrings & Jhumkas', value: 'Earrings' },
    { label: 'Rings & Toe Rings', value: 'Rings' },
    { label: 'Bridal Sets', value: 'Bridal' },
    { label: 'Anklets (Payal)', value: 'Anklets' },
    { label: 'Maang Tikka', value: 'Maangtikka' },
]

const MATERIALS = [
    'All Materials',
    'Oxidised Silver',
    'Gold Plated Brass',
    'Kundan & Jadau',
    'Temple Jewellery',
    'Antique Brass',
]

const SORT_OPTIONS = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Top Customer Rated', value: 'rating' },
    { label: 'Most Popular', value: 'popular' },
]

import ProductCard from '@/components/common/ProductCard'

function ShopContent() {
    const params = useSearchParams()
    const initCat = params.get('category') || ''
    const initSort = params.get('sort') || 'newest'
    const initSearch = params.get('search') || ''
    const initCollection = params.get('collection') || ''

    const [category, setCategory] = useState(initCat)
    const [sort, setSort] = useState(initSort)
    const [search, setSearch] = useState(initSearch)
    const [collection, setCollection] = useState(initCollection)
    const [selectedMaterial, setSelectedMaterial] = useState('All Materials')
    const [maxPrice, setMaxPrice] = useState(10000)
    const [filtersOpen, setFiltersOpen] = useState(false)

    // Normalize category comparison case-insensitively
    let products = ALL_PRODUCTS
        .filter(p => {
            if (!category) return true
            return p.category.toLowerCase() === category.toLowerCase() ||
                   (category.toLowerCase() === 'maangtikka' && p.category.toLowerCase().includes('maang'))
        })
        .filter(p => {
            if (!collection) return true
            const col = collection.toLowerCase()
            if (col === 'antique') return p.material.toLowerCase().includes('oxidised') || p.material.toLowerCase().includes('antique') || p.name.toLowerCase().includes('antique')
            if (col === 'temple') return p.material.toLowerCase().includes('temple') || p.name.toLowerCase().includes('temple') || (p.tags && p.tags.some(t => t.toLowerCase().includes('temple')))
            if (col === 'contemporary') return p.category.toLowerCase() === 'rings' || (p.tags && p.tags.some(t => t.toLowerCase().includes('boho') || t.toLowerCase().includes('modern')))
            return true
        })
        .filter(p => {
            if (selectedMaterial === 'All Materials') return true
            return p.material.toLowerCase().includes(selectedMaterial.toLowerCase().split(' ')[0])
        })
        .filter(p => {
            if (!search) return true
            const q = search.toLowerCase()
            return p.name.toLowerCase().includes(q) ||
                   p.category.toLowerCase().includes(q) ||
                   p.material.toLowerCase().includes(q) ||
                   (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
        })
        .filter(p => p.salePrice <= maxPrice)

    if (sort === 'price_asc') products = [...products].sort((a, b) => a.salePrice - b.salePrice)
    if (sort === 'price_desc') products = [...products].sort((a, b) => b.salePrice - a.salePrice)
    if (sort === 'rating') products = [...products].sort((a, b) => b.rating - a.rating)
    if (sort === 'popular') products = [...products].sort((a, b) => b.reviews - a.reviews)

    const activeCatObj = CATEGORIES.find(c => c.value.toLowerCase() === category.toLowerCase())

    return (
        <div className="min-h-screen bg-brand-black">
            {/* Page header banner */}
            <div className="bg-gradient-to-r from-brand-maroon-600 via-brand-maroon to-brand-maroon-600 border-b border-brand-gold/20 py-10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A66B_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-brand-gold/60 text-xs tracking-[0.3em] uppercase mb-1 font-sans">Handcrafted Collection</p>
                            <h1 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient">
                                {activeCatObj?.label || (category ? category : 'All Royal Jewellery')}
                            </h1>
                            <p className="text-brand-silver/70 text-xs sm:text-sm mt-1">
                                Discover {products.length} authentic pieces handcrafted for royalty
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-brand-black/40 backdrop-blur-sm border border-brand-gold/25 px-3 py-1.5 rounded-full text-xs text-brand-gold">
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                            <span>100% Certified Purity & Authenticity</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-gold/15">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setFiltersOpen(o => !o)}
                            className="lg:hidden flex items-center gap-2 bg-brand-maroon-300 border border-brand-gold/30 hover:border-brand-gold text-brand-gold py-2 px-4 text-xs rounded-sm transition-all"
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                        </button>
                        {search && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-brand-maroon-300 border border-brand-gold/40 rounded-full text-xs text-brand-gold">
                                <span>Search: "{search}"</span>
                                <button onClick={() => setSearch('')} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
                            </div>
                        )}
                        {category && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-brand-maroon-300 border border-brand-gold/40 rounded-full text-xs text-brand-gold">
                                <span>Category: {activeCatObj?.label || category}</span>
                                <button onClick={() => setCategory('')} className="hover:text-white"><X className="w-3.5 h-3.5" /></button>
                            </div>
                        )}
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-brand-silver/50 text-xs hidden sm:block">Sort by:</span>
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            className="bg-brand-maroon-300 border border-brand-gold/30 text-brand-gold text-xs px-3 py-2 rounded-sm outline-none focus:border-brand-gold cursor-pointer"
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar filters */}
                    <aside className={`
                        ${filtersOpen ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:static lg:bg-transparent lg:backdrop-blur-none' : 'hidden lg:block'}
                        lg:w-60 flex-shrink-0
                    `}>
                        <div className={`
                            ${filtersOpen ? 'absolute right-0 top-0 bottom-0 w-80 bg-[#1A060E] border-l border-brand-gold/20 p-6 overflow-y-auto' : ''}
                            lg:static lg:bg-transparent lg:p-0
                        `}>
                            {filtersOpen && (
                                <div className="flex items-center justify-between mb-6 lg:hidden">
                                    <h3 className="font-display font-semibold text-brand-gold text-lg">Filter Jewellery</h3>
                                    <button onClick={() => setFiltersOpen(false)} className="text-brand-gold/70 hover:text-brand-gold">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {/* Category Filter */}
                            <div className="mb-7 pb-6 border-b border-brand-gold/15">
                                <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-3">Category</p>
                                <div className="flex flex-col gap-1">
                                    {CATEGORIES.map(cat => {
                                        const isSelected = (!category && !cat.value) || (category.toLowerCase() === cat.value.toLowerCase())
                                        return (
                                            <button
                                                key={cat.value}
                                                onClick={() => {
                                                    setCategory(cat.value)
                                                    setFiltersOpen(false)
                                                }}
                                                className={`text-left text-xs py-2 px-3 rounded-xs transition-all flex items-center justify-between ${
                                                    isSelected
                                                        ? 'text-brand-gold font-semibold bg-brand-maroon-300/80 border-l-2 border-brand-gold'
                                                        : 'text-brand-silver/70 hover:text-brand-gold hover:bg-brand-maroon/20'
                                                }`}
                                            >
                                                <span>{cat.label}</span>
                                                {isSelected && <Check className="w-3 h-3 text-brand-gold" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Price range */}
                            <div className="mb-7 pb-6 border-b border-brand-gold/15">
                                <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-3">Max Price</p>
                                <div className="flex items-center justify-between text-xs text-brand-gold font-semibold mb-2">
                                    <span>₹0</span>
                                    <span>Up to {formatCurrency(maxPrice)}</span>
                                </div>
                                <input
                                    type="range"
                                    min={500}
                                    max={7000}
                                    step={250}
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(Number(e.target.value))}
                                    className="w-full accent-brand-gold cursor-pointer"
                                />
                            </div>

                            {/* Materials */}
                            <div className="mb-7 pb-6 border-b border-brand-gold/15">
                                <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-3">Material</p>
                                <div className="flex flex-col gap-1">
                                    {MATERIALS.map(mat => {
                                        const isSelected = selectedMaterial === mat
                                        return (
                                            <button
                                                key={mat}
                                                onClick={() => setSelectedMaterial(mat)}
                                                className={`text-left text-xs py-1.5 px-3 rounded-xs transition-colors flex items-center justify-between ${
                                                    isSelected
                                                        ? 'text-brand-gold font-semibold bg-brand-maroon-300/60'
                                                        : 'text-brand-silver/65 hover:text-brand-gold'
                                                }`}
                                            >
                                                <span>{mat}</span>
                                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={() => {
                                    setCategory('')
                                    setSort('newest')
                                    setSearch('')
                                    setSelectedMaterial('All Materials')
                                    setMaxPrice(10000)
                                    setFiltersOpen(false)
                                }}
                                className="w-full py-2 border border-brand-gold/30 hover:border-brand-gold text-brand-gold/80 hover:text-brand-gold text-xs rounded-xs transition-colors uppercase tracking-wider font-medium"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1 min-w-0">
                        {products.length === 0 ? (
                            <div className="text-center py-24 bg-[#18050D]/60 rounded border border-brand-gold/10">
                                <span className="text-5xl block mb-4">💎</span>
                                <p className="text-brand-gold font-display text-xl mb-2 font-semibold">No Pieces Found</p>
                                <p className="text-brand-silver/60 text-sm max-w-sm mx-auto mb-6">
                                    We couldn't find any jewellery matching your chosen filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setCategory('')
                                        setSearch('')
                                        setSelectedMaterial('All Materials')
                                        setMaxPrice(10000)
                                    }}
                                    className="px-6 py-2.5 bg-brand-gold text-brand-maroon font-bold text-xs uppercase tracking-wider rounded-xs"
                                >
                                    View All Designs
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                                {products.map((p, i) => (
                                    <ProductCard key={p.id} product={p} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-brand-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-brand-gold font-display text-lg">Curating Royal Collection...</p>
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    )
}
