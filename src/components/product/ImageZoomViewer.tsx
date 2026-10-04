'use client'

import { useState, useRef, MouseEvent } from 'react'
import Image from 'next/image'
import { Maximize2, X, ChevronLeft, ChevronRight, Heart, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageZoomViewerProps {
    images: string[]
    name: string
    discount?: number
    isWishlisted?: boolean
    onToggleWishlist?: () => void
}

export default function ImageZoomViewer({
    images,
    name,
    discount = 0,
    isWishlisted = false,
    onToggleWishlist,
}: ImageZoomViewerProps) {
    const [currentIdx, setCurrentIdx] = useState(0)
    const [isHovering, setIsHovering] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [lightboxOpen, setLightboxOpen] = useState(false)

    const imgContainerRef = useRef<HTMLDivElement>(null)

    const activeImage = images[currentIdx] || images[0]

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!imgContainerRef.current) return
        const rect = imgContainerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
    }

    return (
        <div>
            {/* Main Image Container with Magnifier */}
            <div
                ref={imgContainerRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
                className="relative aspect-square rounded-sm overflow-hidden bg-[#1E0A10] border border-brand-gold/20 mb-4 cursor-crosshair group select-none"
            >
                <Image
                    src={activeImage}
                    alt={name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={95}
                    priority
                    className="object-cover object-center transition-transform duration-200"
                />

                {/* Magnified Loupe Overlay on Hover */}
                {isHovering && (
                    <div
                        className="absolute inset-0 pointer-events-none z-20 border border-brand-gold/40"
                        style={{
                            backgroundImage: `url(${activeImage})`,
                            backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                            backgroundSize: '240%',
                            backgroundRepeat: 'no-repeat',
                        }}
                    />
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                    <span className="absolute top-4 left-4 bg-brand-gold text-brand-maroon text-xs font-bold px-3 py-1 rounded-xs z-30 shadow-md">
                        {discount}% OFF
                    </span>
                )}

                {/* Fullscreen Lightbox Trigger */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        setLightboxOpen(true)
                    }}
                    className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-brand-gold hover:text-brand-maroon text-white/90 flex items-center justify-center backdrop-blur-sm transition-all z-30"
                    aria-label="View Fullscreen"
                    title="Fullscreen Lightbox"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>

                {/* Wishlist Button */}
                {onToggleWishlist && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleWishlist()
                        }}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-30 ${
                            isWishlisted
                                ? 'bg-brand-gold text-brand-maroon shadow-lg'
                                : 'bg-black/50 text-brand-gold hover:text-white'
                        }`}
                        aria-label="Wishlist"
                    >
                        <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                )}

                {/* Hover Hint */}
                <div className="absolute bottom-4 left-4 text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs pointer-events-none flex items-center gap-1 z-30 opacity-75 group-hover:opacity-100">
                    <ZoomIn className="w-3 h-3 text-brand-gold" />
                    <span>Hover to zoom · Click to enlarge</span>
                </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setCurrentIdx(i)}
                            className={`relative w-20 h-20 rounded-xs overflow-hidden border transition-all duration-200 flex-shrink-0 ${
                                currentIdx === i
                                    ? 'border-brand-gold ring-1 ring-brand-gold'
                                    : 'border-brand-gold/20 hover:border-brand-gold/50 opacity-70 hover:opacity-100'
                            }`}
                        >
                            <Image src={img} alt="" fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
                    >
                        {/* Lightbox Topbar */}
                        <div className="flex items-center justify-between text-white border-b border-brand-gold/20 pb-4">
                            <div>
                                <h3 className="font-display font-bold text-lg text-brand-gold">{name}</h3>
                                <p className="text-brand-silver/50 text-xs">High Resolution Master View ({currentIdx + 1}/{images.length})</p>
                            </div>
                            <button
                                onClick={() => setLightboxOpen(false)}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-gold hover:text-brand-maroon flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Lightbox Main Image */}
                        <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden">
                            <div className="relative w-full h-full max-w-4xl max-h-[75vh]">
                                <Image
                                    src={activeImage}
                                    alt={name}
                                    fill
                                    quality={100}
                                    className="object-contain"
                                />
                            </div>

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentIdx(c => (c === 0 ? images.length - 1 : c - 1))}
                                        className="absolute left-4 w-12 h-12 rounded-full bg-black/60 hover:bg-brand-gold hover:text-brand-maroon text-white flex items-center justify-center transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentIdx(c => (c === images.length - 1 ? 0 : c + 1))}
                                        className="absolute right-4 w-12 h-12 rounded-full bg-black/60 hover:bg-brand-gold hover:text-brand-maroon text-white flex items-center justify-center transition-colors"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Lightbox Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex justify-center gap-2 pt-2 border-t border-brand-gold/15">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIdx(i)}
                                        className={`relative w-16 h-16 rounded overflow-hidden border transition-all ${
                                            currentIdx === i ? 'border-brand-gold scale-105' : 'border-white/20 opacity-50'
                                        }`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
