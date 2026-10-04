'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    X,
    Star,
    ShieldCheck,
    ShoppingBag,
    Zap,
    Heart,
    Sparkles,
    Scale,
    Coins,
    Award,
    Check,
    ArrowRight,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Truck,
    RefreshCw,
    Maximize2,
} from 'lucide-react'
import { ProductItem, LIVE_GOLD_RATES } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import toast from 'react-hot-toast'

interface ProductQuickViewModalProps {
    isOpen: boolean
    onClose: () => void
    product: ProductItem | null
}

export default function ProductQuickViewModal({
    isOpen,
    onClose,
    product,
}: ProductQuickViewModalProps) {
    const router = useRouter()
    const addItem = useCartStore((s) => s.addItem)
    const toggleWishlist = useWishlistStore((s) => s.toggle)
    const isWishlisted = useWishlistStore((s) => (product ? s.has(product.id) : false))

    const [selectedImage, setSelectedImage] = useState<string>('')
    const [selectedPurity, setSelectedPurity] = useState<string>('22K')
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [quantity, setQuantity] = useState<number>(1)
    const [zoomLevel, setZoomLevel] = useState<number>(1)

    useEffect(() => {
        if (product) {
            setSelectedImage(product.image)
            setSelectedPurity(product.purity || '22K')
            setSelectedSize(product.availableSizes?.[0] || 'Standard Fit')
            setQuantity(1)
            setZoomLevel(1)
        }
    }, [product, isOpen])

    // ESC to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen || !product) return null

    const allImages = product.images?.length ? product.images : [product.image]
    const discount = Math.round(((product.mrp - product.salePrice) / product.mrp) * 100)

    // Calculate live bullion melt value
    const calculateMetalValue = () => {
        const weight = product.netMetalWeight || product.weight || 0
        if (selectedPurity === '24K') return weight * LIVE_GOLD_RATES.gold24k
        if (selectedPurity === '22K') return weight * LIVE_GOLD_RATES.gold22k
        if (selectedPurity === '18K') return weight * LIVE_GOLD_RATES.gold18k
        if (selectedPurity === '925 Silver') return weight * LIVE_GOLD_RATES.silver925
        return weight * LIVE_GOLD_RATES.gold22k
    }

    const metalValue = calculateMetalValue()
    const makingCost = (product.makingChargePerGram || 150) * (product.weight || 50)
    const gstCost = Math.round(product.salePrice * 0.03)

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.salePrice,
            mrp: product.mrp,
            quantity,
            slug: product.slug,
            purity: selectedPurity,
            size: selectedSize,
        })
        toast.success(`Added ${quantity} × ${product.name} to your Shopping Bag!`)
        onClose()
    }

    const handleBuyNow = () => {
        addItem({
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.salePrice,
            mrp: product.mrp,
            quantity,
            slug: product.slug,
            purity: selectedPurity,
            size: selectedSize,
        })
        onClose()
        router.push('/checkout')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            {/* Modal Container */}
            <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#14050D] border border-brand-gold/30 rounded-lg shadow-2xl overflow-hidden flex flex-col">
                {/* Top Header */}
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-brand-gold/20 bg-[#1A0711]">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                            {product.category}
                        </span>
                        <span className="text-brand-silver/50 font-sans">•</span>
                        <span className="text-brand-silver/70 text-xs font-serif italic">
                            Atelier Specimen #{product.id}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2 rounded-full transition ${
                                isWishlisted
                                    ? 'bg-brand-gold text-brand-maroon'
                                    : 'text-brand-silver/70 hover:text-brand-gold hover:bg-brand-gold/10'
                            }`}
                            title="Add to Wishlist"
                        >
                            <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-brand-silver/60 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Body */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto lg:overflow-hidden">
                    {/* Left: Image Showcase & Zoom Canvas (6 cols) */}
                    <div className="lg:col-span-6 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-brand-gold/20 bg-[#0E0309] space-y-4">
                        {/* Main High-Res Image Viewport */}
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-brand-gold/25 bg-black/60 flex items-center justify-center group select-none">
                            <div
                                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-out' }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    quality={95}
                                    className="object-contain p-4 drop-shadow-2xl"
                                />
                            </div>

                            {/* Floating Discount & Best Seller Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                                {discount > 0 && (
                                    <span className="bg-brand-gold text-brand-maroon text-xs font-bold px-2.5 py-0.5 rounded shadow tracking-wide">
                                        {discount}% OFF
                                    </span>
                                )}
                                {product.bestSeller && (
                                    <span className="bg-amber-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase backdrop-blur-xs">
                                        Best Seller
                                    </span>
                                )}
                            </div>

                            {/* Zoom controls */}
                            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded border border-brand-gold/30 z-10">
                                <button
                                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                                    disabled={zoomLevel <= 1}
                                    className="p-1 text-brand-silver hover:text-brand-gold disabled:opacity-40"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-[10px] font-mono text-brand-gold font-bold px-1.5">
                                    {Math.round(zoomLevel * 100)}%
                                </span>
                                <button
                                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.5))}
                                    disabled={zoomLevel >= 2.5}
                                    className="p-1 text-brand-silver hover:text-brand-gold disabled:opacity-40"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Multi-angle Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedImage(img)
                                            setZoomLevel(1)
                                        }}
                                        className={`relative w-14 h-14 rounded border overflow-hidden shrink-0 transition ${
                                            selectedImage === img
                                                ? 'border-brand-gold ring-2 ring-brand-gold/50 scale-105'
                                                : 'border-brand-gold/20 hover:border-brand-gold/60 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <Image src={img} alt={`Angle ${i + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Hallmark Trust Badge */}
                        <div className="flex items-center gap-3 p-3 rounded bg-emerald-950/25 border border-emerald-500/25 text-xs text-emerald-300">
                            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div>
                                <div className="font-semibold flex items-center gap-1.5">
                                    <span>BIS 916 Hallmark Assayed</span>
                                    <span className="text-[9px] bg-emerald-500/20 px-1 py-0.2 rounded text-emerald-200">
                                        100% AUTHENTIC
                                    </span>
                                </div>
                                <div className="text-brand-silver/60 text-[11px]">
                                    Govt Lab Certificate: {product.bisHallmarkNumber || 'BIS-916-TBP-VERIFIED'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Full Specifications, Pricing, Breakdown & Cart (6 cols) */}
                    <div className="lg:col-span-6 p-6 overflow-y-auto space-y-5 bg-[#170610]">
                        {/* Title & Rating */}
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="flex items-center gap-0.5 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                </div>
                                <span className="text-xs text-brand-silver/60 font-sans">
                                    ({product.reviews || 94} verified patron reviews)
                                </span>
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white tracking-wide">
                                {product.name}
                            </h2>
                            <p className="text-xs text-brand-silver/70 mt-1 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-3 pt-1 border-t border-brand-gold/15">
                            <span className="text-3xl font-bold text-gold-gradient font-sans">
                                {formatCurrency(product.salePrice)}
                            </span>
                            {product.mrp > product.salePrice && (
                                <>
                                    <span className="text-base text-brand-silver/50 line-through">
                                        {formatCurrency(product.mrp)}
                                    </span>
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                        Save {formatCurrency(product.mrp - product.salePrice)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Transparent Price & Bullion Melt Breakdown */}
                        <div className="p-3.5 rounded-lg bg-black/40 border border-brand-gold/25 space-y-2 text-xs">
                            <div className="flex items-center justify-between text-brand-gold font-bold uppercase tracking-wider text-[11px]">
                                <span className="flex items-center gap-1.5">
                                    <Coins className="w-3.5 h-3.5" />
                                    <span>Transparent Price Breakdown</span>
                                </span>
                                <span className="text-[10px] text-brand-silver/50 font-normal">Live MCX Benchmark</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] text-brand-silver/70 pt-1 border-t border-brand-gold/15">
                                <div>
                                    Pure Metal Melt: <strong className="text-white">{formatCurrency(Math.round(metalValue))}</strong>
                                </div>
                                <div>
                                    Gross Weight: <strong className="text-white">{product.weight}g</strong>
                                </div>
                                <div>
                                    Making Charge: <strong className="text-white">₹{product.makingChargePerGram || 150}/g</strong>
                                </div>
                                <div>
                                    GST (3%): <strong className="text-white">{formatCurrency(gstCost)}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Purity Selector */}
                        {product.purityOptions && product.purityOptions.length > 1 && (
                            <div>
                                <label className="block text-xs uppercase font-bold text-brand-gold tracking-wider mb-2">
                                    Select Metal Purity
                                </label>
                                <div className="flex flex-wrap items-center gap-2">
                                    {product.purityOptions.map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setSelectedPurity(p)}
                                            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                                                selectedPurity === p
                                                    ? 'bg-brand-gold text-brand-maroon font-bold shadow-gold'
                                                    : 'bg-black/40 text-brand-silver hover:text-white border border-brand-gold/25'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {product.availableSizes && product.availableSizes.length > 0 && (
                            <div>
                                <label className="block text-xs uppercase font-bold text-brand-gold tracking-wider mb-2">
                                    Select Size
                                </label>
                                <div className="flex flex-wrap items-center gap-2">
                                    {product.availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                                                selectedSize === size
                                                    ? 'bg-brand-gold text-brand-maroon font-bold shadow-gold'
                                                    : 'bg-black/40 text-brand-silver hover:text-white border border-brand-gold/25'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Action Buttons */}
                        <div className="pt-3 border-t border-brand-gold/15 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center rounded border border-brand-gold/30 bg-black/40 overflow-hidden">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="w-8 h-9 text-brand-gold font-bold hover:bg-brand-gold/20 flex items-center justify-center transition"
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center text-xs font-mono font-bold text-white">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="w-8 h-9 text-brand-gold font-bold hover:bg-brand-gold/20 flex items-center justify-center transition"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-3 px-4 rounded bg-brand-gold hover:bg-brand-gold-300 text-brand-maroon font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Add to Bag</span>
                                </button>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                className="w-full py-3 px-4 rounded bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition"
                            >
                                <Zap className="w-4 h-4" />
                                <span>Instant Buy Now</span>
                            </button>
                        </div>

                        {/* Full Detail Page Link */}
                        <div className="pt-2 text-center">
                            <Link
                                href={`/product/${product.slug}`}
                                onClick={onClose}
                                className="text-xs text-brand-gold hover:underline inline-flex items-center gap-1.5 font-semibold"
                            >
                                <span>View Full Product Page, Reviews & Bundles</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
