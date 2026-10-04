'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Check, ShoppingBag, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

const METALS = [
    { id: 'antique-gold', name: 'Antique Gold', color: '#D4AF37', priceOffset: 0 },
    { id: 'rose-gold', name: 'Rose Gold', color: '#B76E79', priceOffset: 200 },
    { id: 'oxidised-silver', name: 'Oxidised Silver', color: '#8D8E92', priceOffset: -300 },
    { id: 'two-tone', name: 'Two-Tone', color: '#E8D5B0', priceOffset: 400 },
]

const STONES = [
    { id: 'kundan', name: 'Kundan', color: '#F0E6D2' },
    { id: 'polki', name: 'Polki', color: '#E8E9EB' },
    { id: 'ruby', name: 'Ruby Red', color: '#8B0000' },
    { id: 'emerald', name: 'Emerald Green', color: '#004B23' },
]

const SIZES = ['2.2', '2.4', '2.6', '2.8']

// A pseudo 360-viewer that cycles through frames based on drag
export default function InteractiveConfigurator({ product }: { product: any }) {
    const [metal, setMetal] = useState(METALS[0])
    const [stone, setStone] = useState(STONES[0])
    const [size, setSize] = useState(SIZES[2])
    const [frameIndex, setFrameIndex] = useState(0)

    const addItem = useCartStore(s => s.addItem)

    // Generate a mock sequence of frames (we duplicate the image and softly rotate it using CSS to simulate a spin if we lack real frames) 
    // In production, this would be an array of actual 24 frames.
    const TOTAL_FRAMES = 24

    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)

    // Calculate dynamic price
    const finalPrice = product.salePrice + metal.priceOffset

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true)
        setStartX(e.clientX)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return
        const diff = e.clientX - startX
        // change frame every 10px of drag
        if (Math.abs(diff) > 10) {
            const dir = diff > 0 ? 1 : -1
            setFrameIndex((prev) => (prev + dir + TOTAL_FRAMES) % TOTAL_FRAMES)
            setStartX(e.clientX) // Reset start 
        }
    }

    const handlePointerUp = () => {
        setIsDragging(false)
    }

    const handleAddToCart = () => {
        const variantName = `${product.name} - ${metal.name} / ${stone.name} / ${size}`
        addItem({
            productId: `${product.id}-${metal.id}-${stone.id}-${size}`,
            name: variantName,
            image: product.image,
            price: finalPrice,
            mrp: product.mrp,
            quantity: 1,
            slug: product.slug,
        })
    }

    // Determine the styling of the image based on selected metal/stone
    // This is a CSS filter trick for the prototype since we lack multiple photo variants
    const filterStyle = metal.id === 'oxidised-silver' ? 'grayscale(80%) brightness(0.9) contrast(1.1)'
        : metal.id === 'rose-gold' ? 'sepia(40%) hue-rotate(-30deg) saturate(160%) brightness(1.05)'
            : metal.id === 'two-tone' ? 'sepia(30%) saturate(120%) brightness(1.1)'
                : 'sepia(15%) saturate(130%) brightness(1.05)' // default antique gold

    const stoneGlow = `drop-shadow(0 0 20px ${stone.color}60)` // 60 is alpha for hex
    const combinedFilter = `${filterStyle} ${stoneGlow}`

    const rotation = (frameIndex / TOTAL_FRAMES) * 360

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-brand-black text-white">
            {/* Left: 360 Viewer */}
            <div className="flex-1 lg:w-2/3 relative h-[50vh] lg:h-screen bg-[#1E0A10] flex items-center justify-center overflow-hidden border-r border-brand-gold/10"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                {/* 360 Indicator */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10 opacity-60">
                    <RotateCcw className="w-5 h-5 text-brand-gold animate-pulse" />
                    <span className="text-brand-gold text-[10px] tracking-widest uppercase">Drag to Rotate</span>
                </div>

                <motion.div
                    className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] select-none"
                    style={{ transform: `rotate(${rotation}deg)`, filter: combinedFilter, transition: 'filter 0.5s ease-in-out' }}
                >
                    <Image
                        src={product.image}
                        alt="360 view"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={90}
                        draggable={false}
                        className="object-contain pointer-events-none drop-shadow-[0_20px_40px_rgba(201,166,107,0.15)]"
                    />
                </motion.div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-brand-silver/30 text-[10px] tracking-widest uppercase">
                    Interactive Preview • Stage 1
                </div>
            </div>

            {/* Right: Controls & Price */}
            <div className="flex-1 lg:w-1/3 bg-brand-maroon/50 p-6 md:p-10 lg:p-12 overflow-y-auto lg:h-screen no-scrollbar">
                <Link href={`/product/${product.slug}`} className="text-brand-gold/50 hover:text-brand-gold text-xs flex items-center gap-2 mb-8 transition-colors">
                    ← Back to Details
                </Link>

                <h1 className="font-display text-3xl font-bold text-white mb-2">{product.name}</h1>
                <p className="text-brand-silver/50 text-sm mb-10">Design your own bespoke variation. Watch the preview update instantly.</p>

                <div className="space-y-10">
                    {/* Metal */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-sans text-brand-gold text-xs uppercase tracking-widest font-semibold">Base Metal</h3>
                            <span className="text-brand-silver/80 text-xs">{metal.name}</span>
                        </div>
                        <div className="flex gap-4">
                            {METALS.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setMetal(m)}
                                    className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 ${metal.id === m.id ? 'border-brand-gold scale-110 shadow-gold' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: m.color }}
                                    title={m.name}
                                >
                                    {metal.id === m.id && <Check className="absolute inset-0 m-auto w-4 h-4 text-brand-maroon drop-shadow" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stone */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-sans text-brand-gold text-xs uppercase tracking-widest font-semibold">Gemstone</h3>
                            <span className="text-brand-silver/80 text-xs">{stone.name}</span>
                        </div>
                        <div className="flex gap-4">
                            {STONES.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setStone(s)}
                                    className={`relative w-10 h-10 rounded shadow-inner transition-all duration-300 ${stone.id === s.id ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-brand-maroon scale-110' : 'hover:scale-105'}`}
                                    style={{ backgroundColor: s.color }}
                                    title={s.name}
                                >
                                    {/* Glassy reflection overlay on stone */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div className="pb-8 border-b border-brand-gold/15">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-sans text-brand-gold text-xs uppercase tracking-widest font-semibold">Size</h3>
                            <span className="text-brand-silver/80 text-xs">{size}</span>
                        </div>
                        <div className="flex gap-3">
                            {SIZES.map(sz => (
                                <button
                                    key={sz}
                                    onClick={() => setSize(sz)}
                                    className={`flex-1 py-2.5 text-sm transition-all duration-200 border rounded-sm ${size === sz ? 'bg-brand-gold text-brand-maroon border-brand-gold font-bold' : 'bg-transparent text-white border-brand-gold/20 hover:border-brand-gold/50'}`}
                                >
                                    {sz}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary & Buy */}
                    <div className="sticky bottom-0 bg-brand-maroon/95 backdrop-blur-md pt-4 pb-0 z-20">
                        <div className="flex items-end justify-between mb-2">
                            <div>
                                <p className="text-brand-silver/50 text-[10px] tracking-widest uppercase mb-1">Total Configuration</p>
                                <p className="text-brand-gold text-xs">{metal.name} • {stone.name} • Size {size}</p>
                            </div>
                            <div className="text-right">
                                <motion.div
                                    key={finalPrice}
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="font-display text-3xl font-bold text-white mb-1"
                                >
                                    {formatCurrency(finalPrice)}
                                </motion.div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full btn-gold py-4 text-sm mt-4 flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(201,166,107,0.4)]"
                        >
                            <ShoppingBag className="w-5 h-5" /> Add Custom Design to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
