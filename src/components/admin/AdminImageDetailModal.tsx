'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    X,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Minimize2,
    RotateCcw,
    Copy,
    Download,
    ExternalLink,
    Check,
    ShieldCheck,
    Tag,
    Scale,
    Coins,
    Package,
    Sparkles,
    Sliders,
    Layers,
    Sun,
    Moon,
    Edit3,
    Plus,
    Minus,
} from 'lucide-react'
import { ProductItem } from '@/lib/data'
import { useAdminRatesStore } from '@/store/adminRatesStore'
import { useAdminProductStore } from '@/store/adminProductStore'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export interface ImageDetailData {
    src: string
    title?: string
    product?: ProductItem
    category?: string
    metadata?: {
        resolution?: string
        fileSize?: string
        format?: string
        dimensions?: string
    }
}

interface AdminImageDetailModalProps {
    isOpen: boolean
    onClose: () => void
    data: ImageDetailData | null
    onEditProduct?: (product: ProductItem) => void
}

export default function AdminImageDetailModal({
    isOpen,
    onClose,
    data,
    onEditProduct,
}: AdminImageDetailModalProps) {
    const rates = useAdminRatesStore((s) => s.rates)
    const adjustStock = useAdminProductStore((s) => s.adjustStock)
    const products = useAdminProductStore((s) => s.products)

    const [zoomLevel, setZoomLevel] = useState<number>(1)
    const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [bgMode, setBgMode] = useState<'dark' | 'maroon' | 'light'>('dark')
    const [copied, setCopied] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [selectedImageSrc, setSelectedImageSrc] = useState<string>('')

    const imageContainerRef = useRef<HTMLDivElement>(null)

    // Sync selected image when data changes
    useEffect(() => {
        if (data) {
            setSelectedImageSrc(data.src)
            setZoomLevel(1)
            setPanPosition({ x: 0, y: 0 })
        }
    }, [data])

    // Keyboard navigation (ESC to close)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen || !data) return null

    // Get current product instance from store to reflect live edits
    const currentProduct = data.product
        ? products.find((p) => p.id === data.product?.id) || data.product
        : undefined

    const title = currentProduct?.name || data.title || 'Jewellery Specimen'
    const category = currentProduct?.category || data.category || 'Atelier Collection'
    const imageSrc = selectedImageSrc || data.src

    // Extract file name
    const fileName = imageSrc.split('/').pop() || 'image.jpeg'

    // Calculate approximate metal melt value if live gold rates available
    const calculateMetalValue = () => {
        if (!currentProduct) return 0
        const weight = currentProduct.netMetalWeight || currentProduct.weight || 0
        if (currentProduct.purity === '24K') return weight * rates.gold24k
        if (currentProduct.purity === '22K') return weight * rates.gold22k
        if (currentProduct.purity === '18K') return weight * rates.gold18k
        if (currentProduct.purity === '925 Silver') return weight * rates.silver925
        return 0
    }

    const metalValue = calculateMetalValue()

    // Handle zoom controls
    const handleZoomIn = () => setZoomLevel((z) => Math.min(3.5, Number((z + 0.5).toFixed(1))))
    const handleZoomOut = () => {
        setZoomLevel((z) => {
            const next = Math.max(1, Number((z - 0.5).toFixed(1)))
            if (next === 1) setPanPosition({ x: 0, y: 0 })
            return next
        })
    }
    const handleResetZoom = () => {
        setZoomLevel(1)
        setPanPosition({ x: 0, y: 0 })
    }

    // Pan / Drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoomLevel <= 1) return
        setIsDragging(true)
        setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || zoomLevel <= 1) return
        setPanPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        })
    }

    const handleMouseUp = () => setIsDragging(false)

    // Copy path
    const handleCopyPath = () => {
        navigator.clipboard.writeText(imageSrc)
        setCopied(true)
        toast.success('Image path copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
    }

    // Download image
    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = imageSrc
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success(`Downloaded ${fileName}`)
    }

    // Available images gallery for the current product
    const allImages = currentProduct?.images?.length ? currentProduct.images : [imageSrc]

    // Background style classes
    const bgStyles = {
        dark: 'bg-[#090306]',
        maroon: 'bg-[#1C050E]',
        light: 'bg-[#F4F4F6] text-neutral-900',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            {/* Modal Container */}
            <div
                className={`relative w-full max-w-6xl max-h-[94vh] bg-[#14050D] border border-brand-gold/30 rounded-lg shadow-2xl overflow-hidden flex flex-col ${
                    isFullscreen ? '!max-w-[99vw] !max-h-[99vh] h-[99vh]' : 'h-[90vh]'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-brand-gold/20 bg-[#1A0711]/90">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/30">
                                    {category}
                                </span>
                                {currentProduct?.purity && (
                                    <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                        {currentProduct.purity}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-white font-display text-lg font-bold truncate max-w-md sm:max-w-xl">
                                {title}
                            </h2>
                        </div>
                    </div>

                    {/* Top action buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 text-brand-silver/70 hover:text-brand-gold hover:bg-brand-gold/10 rounded transition-colors"
                            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        >
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-brand-silver/70 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                            title="Close (Esc)"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content Area: Split 2 columns on desktop */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                    {/* Left Column: Image Canvas & Zoom Stage (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-brand-gold/20 overflow-hidden relative">
                        {/* Interactive Toolbar */}
                        <div className="flex items-center justify-between px-4 py-2 bg-[#12040B] border-b border-brand-gold/15 text-xs text-brand-silver/80">
                            {/* Zoom controls */}
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={handleZoomOut}
                                    disabled={zoomLevel <= 1}
                                    className="p-1.5 rounded hover:bg-brand-gold/15 text-brand-silver hover:text-brand-gold disabled:opacity-40 transition"
                                    title="Zoom Out"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </button>
                                <span className="font-mono text-brand-gold font-semibold px-2">
                                    {Math.round(zoomLevel * 100)}%
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    disabled={zoomLevel >= 3.5}
                                    className="p-1.5 rounded hover:bg-brand-gold/15 text-brand-silver hover:text-brand-gold disabled:opacity-40 transition"
                                    title="Zoom In"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleResetZoom}
                                    className="p-1.5 rounded hover:bg-brand-gold/15 text-brand-silver hover:text-brand-gold transition ml-1"
                                    title="Reset View"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Canvas Background switch */}
                            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded border border-brand-gold/20">
                                <button
                                    onClick={() => setBgMode('dark')}
                                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                                        bgMode === 'dark' ? 'bg-brand-gold text-brand-maroon font-bold' : 'text-brand-silver hover:text-white'
                                    }`}
                                >
                                    Jet Dark
                                </button>
                                <button
                                    onClick={() => setBgMode('maroon')}
                                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                                        bgMode === 'maroon' ? 'bg-brand-gold text-brand-maroon font-bold' : 'text-brand-silver hover:text-white'
                                    }`}
                                >
                                    Velvet
                                </button>
                                <button
                                    onClick={() => setBgMode('light')}
                                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                                        bgMode === 'light' ? 'bg-brand-gold text-brand-maroon font-bold' : 'text-brand-silver hover:text-white'
                                    }`}
                                >
                                    Studio
                                </button>
                            </div>

                            {/* Quick tools */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleCopyPath}
                                    className="p-1.5 rounded hover:bg-brand-gold/15 text-brand-silver hover:text-brand-gold transition"
                                    title="Copy Image Path"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="p-1.5 rounded hover:bg-brand-gold/15 text-brand-silver hover:text-brand-gold transition"
                                    title="Download High-Res"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Image Viewport */}
                        <div
                            ref={imageContainerRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className={`flex-1 relative flex items-center justify-center p-4 overflow-hidden select-none transition-colors ${
                                bgStyles[bgMode]
                            } ${zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                        >
                            <div
                                style={{
                                    transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                                }}
                                className="relative w-full h-full max-h-[58vh] flex items-center justify-center"
                            >
                                <Image
                                    src={imageSrc}
                                    alt={title}
                                    fill
                                    unoptimized
                                    className="object-contain drop-shadow-2xl pointer-events-none"
                                />
                            </div>

                            {zoomLevel > 1 && (
                                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-brand-gold font-mono border border-brand-gold/30">
                                    Drag to pan • Craftsmanship Inspection Mode
                                </div>
                            )}
                        </div>

                        {/* Thumbnail angle strip (if multiple angles available) */}
                        {allImages.length > 1 && (
                            <div className="flex items-center gap-2 p-2.5 bg-[#0F040A] border-t border-brand-gold/15 overflow-x-auto">
                                <span className="text-[10px] uppercase font-bold text-brand-gold/70 px-2 tracking-wider">
                                    Angles:
                                </span>
                                {allImages.map((src, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedImageSrc(src)
                                            handleResetZoom()
                                        }}
                                        className={`relative w-12 h-12 rounded border overflow-hidden transition-all ${
                                            selectedImageSrc === src
                                                ? 'border-brand-gold ring-2 ring-brand-gold/50 scale-105'
                                                : 'border-brand-gold/20 hover:border-brand-gold/60 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <Image
                                            src={src}
                                            alt={`Angle ${idx + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Complete Specs, Details & Quick Actions (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between overflow-y-auto bg-[#170610] p-5 sm:p-6 space-y-5">
                        <div className="space-y-5">
                            {/* Product Header & Pricing */}
                            <div>
                                <div className="flex items-center justify-between text-xs text-brand-silver/60 mb-1">
                                    <span>Product ID: {currentProduct?.id || 'MEDIA_ITEM'}</span>
                                    {currentProduct?.slug && (
                                        <span className="font-mono text-brand-gold/80">/{currentProduct.slug}</span>
                                    )}
                                </div>
                                <h3 className="text-xl font-display font-bold text-white tracking-wide">
                                    {title}
                                </h3>

                                {currentProduct && (
                                    <div className="mt-3 flex items-baseline gap-3">
                                        <span className="text-2xl font-bold text-gold-gradient font-sans">
                                            {formatCurrency(currentProduct.salePrice)}
                                        </span>
                                        {currentProduct.mrp > currentProduct.salePrice && (
                                            <>
                                                <span className="text-sm text-brand-silver/50 line-through">
                                                    {formatCurrency(currentProduct.mrp)}
                                                </span>
                                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                    {Math.round(((currentProduct.mrp - currentProduct.salePrice) / currentProduct.mrp) * 100)}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Live Valuation Box */}
                            {currentProduct && metalValue > 0 && (
                                <div className="bg-[#240816]/70 border border-brand-gold/30 rounded-lg p-3.5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs text-brand-gold font-semibold uppercase tracking-wider">
                                            <Coins className="w-3.5 h-3.5" />
                                            <span>Live MCX Metal Melt Value</span>
                                        </div>
                                        <span className="text-[10px] text-brand-gold/60">{rates.lastUpdated}</span>
                                    </div>
                                    <div className="flex items-baseline justify-between pt-1">
                                        <span className="text-lg font-bold text-white">
                                            {formatCurrency(Math.round(metalValue))}
                                        </span>
                                        <span className="text-xs text-brand-silver/70">
                                            Net Weight: <strong className="text-white">{currentProduct.netMetalWeight || currentProduct.weight}g</strong>
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-gold/15 text-[11px] text-brand-silver/70">
                                        <div>
                                            Making: <span className="text-white">₹{currentProduct.makingChargePerGram}/g</span>
                                        </div>
                                        <div>
                                            Stone Charges: <span className="text-white">₹{currentProduct.stoneCharges}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Craft & Technical Specifications Grid */}
                            {currentProduct && (
                                <div className="space-y-2">
                                    <h4 className="text-xs uppercase font-bold text-brand-gold/80 tracking-widest flex items-center gap-1.5">
                                        <Scale className="w-3.5 h-3.5" />
                                        <span>Haute Jewellery Specifications</span>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="p-2.5 rounded bg-black/40 border border-brand-gold/15">
                                            <span className="text-brand-silver/60 block text-[10px] uppercase">Material</span>
                                            <span className="text-white font-medium">{currentProduct.material}</span>
                                        </div>
                                        <div className="p-2.5 rounded bg-black/40 border border-brand-gold/15">
                                            <span className="text-brand-silver/60 block text-[10px] uppercase">Purity</span>
                                            <span className="text-brand-gold font-semibold">{currentProduct.purity}</span>
                                        </div>
                                        <div className="p-2.5 rounded bg-black/40 border border-brand-gold/15">
                                            <span className="text-brand-silver/60 block text-[10px] uppercase">Gross Weight</span>
                                            <span className="text-white font-medium">{currentProduct.weight} g</span>
                                        </div>
                                        <div className="p-2.5 rounded bg-black/40 border border-brand-gold/15">
                                            <span className="text-brand-silver/60 block text-[10px] uppercase">Dimensions</span>
                                            <span className="text-white font-medium truncate block">
                                                {currentProduct.dimensions || 'Standard Atelier Fit'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hallmark & Certification Badge */}
                            {currentProduct?.bisHallmarkNumber && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs">
                                    <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-emerald-300 font-semibold flex items-center gap-1.5">
                                            <span>BIS 916 Hallmark Assayed</span>
                                            <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded text-emerald-200">
                                                VERIFIED
                                            </span>
                                        </div>
                                        <div className="text-brand-silver/70 text-[11px] font-mono truncate">
                                            Certificate: {currentProduct.bisHallmarkNumber}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stock & Inventory Controller */}
                            {currentProduct && (
                                <div className="p-3.5 rounded-lg bg-black/40 border border-brand-gold/20 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs uppercase font-bold text-brand-silver/70 tracking-wider flex items-center gap-1.5">
                                            <Package className="w-3.5 h-3.5 text-brand-gold" />
                                            <span>Inventory Level</span>
                                        </span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded font-bold ${
                                                currentProduct.stock > 5
                                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                    : currentProduct.stock > 0
                                                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                            }`}
                                        >
                                            {currentProduct.stock > 5
                                                ? `${currentProduct.stock} Available`
                                                : currentProduct.stock > 0
                                                ? `Only ${currentProduct.stock} Left!`
                                                : 'Out of Stock'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-1">
                                        <button
                                            onClick={() => {
                                                adjustStock(currentProduct.id, -1)
                                                toast.success('Stock reduced by 1')
                                            }}
                                            className="px-2.5 py-1.5 rounded bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/30 text-xs font-bold transition flex items-center gap-1"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                            <span>-1 Stock</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                adjustStock(currentProduct.id, 1)
                                                toast.success('Stock increased by 1')
                                            }}
                                            className="px-2.5 py-1.5 rounded bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/30 text-xs font-bold transition flex items-center gap-1"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>+1 Stock</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                adjustStock(currentProduct.id, 10)
                                                toast.success('Added +10 to inventory batch')
                                            }}
                                            className="px-2.5 py-1.5 rounded bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/30 text-xs font-bold transition ml-auto"
                                        >
                                            +10 Restock
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Media File Technical Info */}
                            <div className="p-3 rounded-lg bg-black/30 border border-brand-gold/10 text-[11px] space-y-1 font-mono text-brand-silver/70">
                                <div className="text-[10px] uppercase font-sans font-bold text-brand-gold/60 tracking-wider mb-1">
                                    Asset Diagnostics
                                </div>
                                <div className="truncate">File: <span className="text-white">{fileName}</span></div>
                                <div className="truncate">Source: <span className="text-brand-silver/50">{imageSrc}</span></div>
                                <div>Status: <span className="text-emerald-400">High-Res Optimized (WebP / JPEG)</span></div>
                            </div>
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="pt-4 border-t border-brand-gold/20 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                {currentProduct && onEditProduct && (
                                    <button
                                        onClick={() => {
                                            onClose()
                                            onEditProduct(currentProduct)
                                        }}
                                        className="w-full py-2.5 px-3 rounded bg-brand-gold hover:bg-brand-gold-300 text-brand-maroon font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit Product</span>
                                    </button>
                                )}

                                {currentProduct?.slug ? (
                                    <Link
                                        href={`/product/${currentProduct.slug}`}
                                        target="_blank"
                                        className="w-full py-2.5 px-3 rounded border border-brand-gold/40 hover:border-brand-gold text-brand-gold hover:bg-brand-gold/10 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition text-center"
                                    >
                                        <span>Live Store Page</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleCopyPath}
                                        className="w-full py-2.5 px-3 rounded border border-brand-gold/40 hover:border-brand-gold text-brand-gold text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Asset URL</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
