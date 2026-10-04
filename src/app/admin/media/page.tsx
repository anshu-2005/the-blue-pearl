'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import {
    Image as ImageIcon,
    Search,
    ZoomIn,
    Download,
    Copy,
    Check,
    Sparkles,
    Filter,
    Layers,
    Tag,
    ExternalLink,
    Maximize2,
    Grid,
    Sliders,
} from 'lucide-react'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { useAdminProductStore } from '@/store/adminProductStore'
import { useAdminImageModal } from '@/components/admin/AdminImageModalContext'
import InspectableImage from '@/components/admin/InspectableImage'
import toast from 'react-hot-toast'

// Media items collected from catalogue and public gallery
interface MediaAsset {
    id: string
    title: string
    category: string
    src: string
    role: 'product' | 'lifestyle' | 'hero' | 'category'
    dimensions?: string
    productSlug?: string
    matchingProduct?: ProductItem
}

// Generate complete gallery assets
const GALLERY_MEDIA: MediaAsset[] = [
    // 28 named products
    { id: 'm1', title: 'Antique Oxidised Bangle Set', category: 'Bangles', src: '/images/products/antique-oxidised-bangle-set.jpeg', role: 'product', productSlug: 'antique-oxidised-bangle-set' },
    { id: 'm2', title: 'Temple Art Gold Bangle Pair', category: 'Bangles', src: '/images/products/temple-gold-bangle-pair.jpeg', role: 'product', productSlug: 'temple-gold-bangle-pair' },
    { id: 'm3', title: 'Tribal Silver Cuff Bangle', category: 'Bangles', src: '/images/products/tribal-silver-cuff-bangle.jpeg', role: 'product', productSlug: 'tribal-silver-cuff-bangle' },
    { id: 'm4', title: 'Filigree Broad Bangle', category: 'Bangles', src: '/images/products/filigree-broad-bangle.jpeg', role: 'product', productSlug: 'filigree-broad-bangle' },
    { id: 'm5', title: 'Oxidised Kundan Bangle Set', category: 'Bangles', src: '/images/products/oxidised-kundan-bangle-set-6.jpeg', role: 'product', productSlug: 'oxidised-kundan-bangle-set-6' },
    { id: 'm6', title: 'Antique Brass Bangle Pair', category: 'Bangles', src: '/images/products/antique-brass-bangle-pair.jpeg', role: 'product', productSlug: 'antique-brass-bangle-pair' },
    { id: 'm7', title: 'Temple Choker Necklace', category: 'Necklaces', src: '/images/products/temple-choker-necklace.jpeg', role: 'product', productSlug: 'temple-choker-necklace' },
    { id: 'm8', title: 'Layered Silver Necklace', category: 'Necklaces', src: '/images/products/layered-oxidised-silver-necklace.jpeg', role: 'product', productSlug: 'layered-oxidised-silver-necklace' },
    { id: 'm9', title: 'Kundan Gold Choker', category: 'Necklaces', src: '/images/products/kundan-gold-choker.jpeg', role: 'product', productSlug: 'kundan-gold-choker' },
    { id: 'm10', title: 'Filigree Pendant Chain', category: 'Necklaces', src: '/images/products/filigree-pendant-chain.jpeg', role: 'product', productSlug: 'filigree-pendant-chain' },
    { id: 'm11', title: 'Antique Coin Necklace', category: 'Necklaces', src: '/images/products/antique-coin-necklace.jpeg', role: 'product', productSlug: 'antique-coin-necklace' },
    { id: 'm12', title: 'Temple Lakshmi Necklace', category: 'Necklaces', src: '/images/products/temple-lakshmi-necklace.jpeg', role: 'product', productSlug: 'temple-lakshmi-necklace' },
    { id: 'm13', title: 'Oxidised Jhumka Earrings', category: 'Earrings', src: '/images/products/oxidised-jhumka-earrings.jpeg', role: 'product', productSlug: 'oxidised-jhumka-earrings' },
    { id: 'm14', title: 'Gold Filigree Studs', category: 'Earrings', src: '/images/products/gold-filigree-studs.jpeg', role: 'product', productSlug: 'gold-filigree-studs' },
    { id: 'm15', title: 'Temple Chandelier Earrings', category: 'Earrings', src: '/images/products/temple-chandelier-earrings.jpeg', role: 'product', productSlug: 'temple-chandelier-earrings' },
    { id: 'm16', title: 'Silver Tassel Earrings', category: 'Earrings', src: '/images/products/silver-tassel-earrings.jpeg', role: 'product', productSlug: 'silver-tassel-earrings' },
    { id: 'm17', title: 'Kundan Drop Earrings', category: 'Earrings', src: '/images/products/kundan-drop-earrings.jpeg', role: 'product', productSlug: 'kundan-drop-earrings' },
    { id: 'm18', title: 'Antique Peacock Earrings', category: 'Earrings', src: '/images/products/antique-peacock-earrings.jpeg', role: 'product', productSlug: 'antique-peacock-earrings' },
    { id: 'm19', title: 'Oxidised Adjustable Ring', category: 'Rings', src: '/images/products/oxidised-adjustable-ring.jpeg', role: 'product', productSlug: 'oxidised-adjustable-ring' },
    { id: 'm20', title: 'Gold Filigree Statement Ring', category: 'Rings', src: '/images/products/gold-filigree-statement-ring.jpeg', role: 'product', productSlug: 'gold-filigree-statement-ring' },
    { id: 'm21', title: 'Temple Toe Ring Pair', category: 'Rings', src: '/images/products/temple-toe-ring-pair.jpeg', role: 'product', productSlug: 'temple-toe-ring-pair' },
    { id: 'm22', title: 'Antique Silver Ring Set', category: 'Rings', src: '/images/products/antique-silver-ring-set.jpeg', role: 'product', productSlug: 'antique-silver-ring-set' },
    { id: 'm23', title: 'Bridal Gold Plated Bangle Set', category: 'Bridal', src: '/images/products/bridal-gold-plated-bangle-set-12.jpeg', role: 'product', productSlug: 'bridal-gold-plated-bangle-set-12' },
    { id: 'm24', title: 'Bridal Necklace & Earring Set', category: 'Bridal', src: '/images/products/bridal-necklace-earring-set.jpeg', role: 'product', productSlug: 'bridal-necklace-earring-set' },
    { id: 'm25', title: 'Bridal Maangtikka & Jhumka', category: 'Bridal', src: '/images/products/bridal-maangtikka-jhumka-combo.jpeg', role: 'product', productSlug: 'bridal-maangtikka-jhumka-combo' },
    { id: 'm26', title: 'Temple Anklet Pair', category: 'Anklets', src: '/images/products/temple-anklet-pair.jpeg', role: 'product', productSlug: 'temple-anklet-pair' },
    { id: 'm27', title: 'Silver Bells Anklet Pair', category: 'Anklets', src: '/images/products/silver-bells-anklet-pair.jpeg', role: 'product', productSlug: 'silver-bells-anklet-pair' },
    { id: 'm28', title: 'Oxidised Maangtikka', category: 'Maangtikka', src: '/images/products/oxidised-maangtikka.jpeg', role: 'product', productSlug: 'oxidised-maangtikka' },
    // Hero & Editorial
    { id: 'm29', title: 'Atelier Royal Editorial Banner 1', category: 'Editorial', src: '/images/hero/hero-banner-1.jpeg', role: 'hero' },
    { id: 'm30', title: 'Atelier Royal Editorial Banner 2', category: 'Editorial', src: '/images/hero/hero-banner-2.jpeg', role: 'hero' },
    // Category Feature Banners
    { id: 'm31', title: 'Bangles Heritage Spotlight', category: 'Bangles', src: '/images/categories/category-bangles.jpeg', role: 'category' },
    { id: 'm32', title: 'Necklaces Heritage Spotlight', category: 'Necklaces', src: '/images/categories/category-necklaces.jpeg', role: 'category' },
    { id: 'm33', title: 'Earrings Heritage Spotlight', category: 'Earrings', src: '/images/categories/category-earrings.jpeg', role: 'category' },
    { id: 'm34', title: 'Rings Heritage Spotlight', category: 'Rings', src: '/images/categories/category-rings.jpeg', role: 'category' },
    { id: 'm35', title: 'Bridal Heritage Spotlight', category: 'Bridal', src: '/images/categories/category-bridal.jpeg', role: 'category' },
    { id: 'm36', title: 'Anklets Heritage Spotlight', category: 'Anklets', src: '/images/categories/category-anklets.jpeg', role: 'category' },
    { id: 'm37', title: 'Maangtikka Heritage Spotlight', category: 'Maangtikka', src: '/images/categories/category-maangtikka.jpeg', role: 'category' },
]

const FILTER_CATEGORIES = ['All', 'Bangles', 'Necklaces', 'Earrings', 'Rings', 'Bridal', 'Anklets', 'Maangtikka', 'Editorial']

export default function AdminMediaGalleryPage() {
    const products = useAdminProductStore((s) => s.products)
    const { openImageModal } = useAdminImageModal()

    const [activeCategory, setActiveCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [gridCols, setGridCols] = useState<'normal' | 'dense' | 'large'>('normal')

    // Attach current live product references
    const enrichedMedia = useMemo(() => {
        return GALLERY_MEDIA.map((item) => {
            const product = item.productSlug
                ? products.find((p) => p.slug === item.productSlug)
                : undefined
            return {
                ...item,
                matchingProduct: product,
            }
        })
    }, [products])

    // Filtered media
    const filteredMedia = useMemo(() => {
        return enrichedMedia.filter((item) => {
            if (activeCategory !== 'All' && item.category !== activeCategory) {
                return false
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchTitle = item.title.toLowerCase().includes(q)
                const matchCategory = item.category.toLowerCase().includes(q)
                const matchSrc = item.src.toLowerCase().includes(q)
                if (!matchTitle && !matchCategory && !matchSrc) return false
            }
            return true
        })
    }, [enrichedMedia, activeCategory, searchQuery])

    const handleInspect = (item: MediaAsset) => {
        openImageModal({
            src: item.src,
            title: item.title,
            product: item.matchingProduct,
            category: item.category,
        })
    }

    const gridClasses = {
        dense: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5',
        normal: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5',
        large: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5',
    }

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/15 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>High-Resolution Digital Asset Library</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                        Media & Craftsmanship Image Gallery
                    </h1>
                    <p className="text-xs text-brand-silver/70 mt-1">
                        50+ Master jewel captures, editorial campaign shoots, and category spotlights. Click any image to launch the 4K interactive craftsmanship zoom inspector.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-semibold font-mono">
                        {filteredMedia.length} Assets Loaded
                    </span>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="p-4 rounded-lg bg-[#16050E] border border-brand-gold/20 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                        {FILTER_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                                    activeCategory === cat
                                        ? 'bg-brand-gold text-brand-maroon shadow-gold'
                                        : 'bg-black/40 text-brand-silver/80 hover:text-white hover:bg-brand-gold/10'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Sizing Controls */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded border border-brand-gold/20 self-end md:self-auto">
                        <button
                            onClick={() => setGridCols('dense')}
                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition ${
                                gridCols === 'dense' ? 'bg-brand-gold text-brand-maroon' : 'text-brand-silver/60 hover:text-white'
                            }`}
                        >
                            Dense
                        </button>
                        <button
                            onClick={() => setGridCols('normal')}
                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition ${
                                gridCols === 'normal' ? 'bg-brand-gold text-brand-maroon' : 'text-brand-silver/60 hover:text-white'
                            }`}
                        >
                            Regular
                        </button>
                        <button
                            onClick={() => setGridCols('large')}
                            className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition ${
                                gridCols === 'large' ? 'bg-brand-gold text-brand-maroon' : 'text-brand-silver/60 hover:text-white'
                            }`}
                        >
                            Showcase
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="w-4 h-4 text-brand-gold/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search image title, category or file path..."
                        className="w-full bg-black/40 border border-brand-gold/25 focus:border-brand-gold rounded pl-9 pr-4 py-2 text-xs text-white placeholder-brand-silver/40 outline-none"
                    />
                </div>
            </div>

            {/* Instruction Callout */}
            <div className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-maroon/80 to-[#12040B] border border-brand-gold/30 flex items-center justify-between text-xs text-brand-gold">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                        <strong>Click any photograph:</strong> Opens high-res multi-level zoom, metal valuation calculations, and technical file information.
                    </span>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className={`grid ${gridClasses[gridCols]}`}>
                {filteredMedia.map((item) => (
                    <div
                        key={item.id}
                        className="group relative rounded-lg border border-brand-gold/20 hover:border-brand-gold transition-all duration-300 overflow-hidden bg-black/50 shadow-md flex flex-col"
                    >
                        {/* Image Canvas with Inspect Trigger */}
                        <div className="relative aspect-square w-full">
                            <InspectableImage
                                src={item.src}
                                alt={item.title}
                                product={item.matchingProduct}
                                category={item.category}
                                fill
                                className="w-full h-full"
                            />

                            {/* Category Tag overlay */}
                            <span className="absolute top-2 left-2 z-20 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/75 text-brand-gold border border-brand-gold/30 backdrop-blur-sm pointer-events-none">
                                {item.category}
                            </span>
                        </div>

                        {/* Caption & Metadata */}
                        <div className="p-2.5 space-y-1">
                            <h4
                                onClick={() => handleInspect(item)}
                                className="text-xs font-bold text-white group-hover:text-brand-gold cursor-pointer transition truncate"
                                title={item.title}
                            >
                                {item.title}
                            </h4>

                            <div className="flex items-center justify-between text-[10px] text-brand-silver/50 font-mono">
                                <span className="truncate">{item.src.split('/').pop()}</span>
                                {item.matchingProduct && (
                                    <span className="text-brand-gold font-semibold">
                                        ₹{item.matchingProduct.salePrice}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredMedia.length === 0 && (
                    <div className="col-span-full py-16 text-center text-brand-silver/50">
                        No image assets found matching the selected filter.
                    </div>
                )}
            </div>
        </div>
    )
}
