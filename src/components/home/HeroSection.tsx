'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, ShieldCheck, Award, Eye, Calendar, Camera, CheckCircle2, ChevronRight, Gem, Clock, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AppointmentModal from '@/components/common/AppointmentModal'
import VirtualTryOnModal from '@/components/common/VirtualTryOnModal'
import { ALL_PRODUCTS, LIVE_GOLD_RATES, ProductItem } from '@/lib/data'

interface HeroCuratedSlide {
    id: string
    category: string
    titleLead: string
    titleHighlight: string
    story: string
    bgImage: string
    productSlug: string
    purityBadge: string
    weightSpec: string
    artisanOrigin: string
    price: number
    mrp: number
    tag: string
    badgeIcon: string
}

const LUXURY_SLIDES: HeroCuratedSlide[] = [
    {
        id: 'bridal',
        category: 'AUTUMN BRIDAL ATELIER 2026',
        titleLead: 'Where Royal Heritage',
        titleHighlight: 'Meets Eternal Grace',
        story: 'Uncut Jadau Kundan, cascading lustrous Basra pearls, and 22K BIS 916 gold heirlooms sculpted for forever royal memories.',
        bgImage: '/images/hero/hero-banner-1.jpeg',
        productSlug: 'kundan-gold-choker',
        purityBadge: '22K (916) BIS Hallmarked',
        weightSpec: 'Net Metal: 84.5g • 48 Artisanal Hours',
        artisanOrigin: 'Handcrafted in Jaipur Atelier',
        price: 2499,
        mrp: 3499,
        tag: 'Royal Bridal',
        badgeIcon: '👑',
    },
    {
        id: 'temple',
        category: 'SACRED TEMPLE NAKSHI',
        titleLead: 'Sacred Nakshi Art,',
        titleHighlight: 'Carved to Divine Perfection',
        story: 'Centuries-old Chola & South Indian temple carving traditions reborn with embossed Goddess Lakshmi & Mayura motifs in pure gold finish.',
        bgImage: '/images/hero/hero-banner-2.jpeg',
        productSlug: 'temple-gold-bangle-pair',
        purityBadge: '22K Solid Gold Finish',
        weightSpec: 'Net Metal: 60.0g • Certified Nakshi Carving',
        artisanOrigin: 'Master Craftsmen of Thanjavur',
        price: 1399,
        mrp: 1999,
        tag: 'Temple Art',
        badgeIcon: '🛕',
    },
    {
        id: 'solitaire',
        category: 'HAUTE FILIGREE & SOLITAIRES',
        titleLead: 'Whispers of Gold,',
        titleHighlight: 'Sculpted in Delicate Filigree',
        story: 'Featherlight spun gold filigree threads intertwined with sparkling diamond solitaires, capturing the purest essence of modern Indian royalty.',
        bgImage: '/images/products/gold-filigree-statement-ring.jpeg',
        productSlug: 'gold-filigree-statement-ring',
        purityBadge: '18K & 22K Certified Filigree',
        weightSpec: 'Net Metal: 12.0g • Laser Precision Cut',
        artisanOrigin: 'Cuttack Filigree Guild',
        price: 799,
        mrp: 1199,
        tag: 'Filigree & Rings',
        badgeIcon: '💎',
    },
    {
        id: 'antique',
        category: 'RAJPUTANA ANTIQUITIES',
        titleLead: 'Rustic Silver Patina,',
        titleHighlight: 'Timeless Nomadic Soul',
        story: 'Hand-beaten 925 sterling oxidised silver kadas and jhumkas aged with authentic antique charcoal patina for an enigmatic vintage allure.',
        bgImage: '/images/products/antique-oxidised-bangle-set.jpeg',
        productSlug: 'antique-oxidised-bangle-set',
        purityBadge: '925 Sterling Silver Assayed',
        weightSpec: 'Net Metal: 75.0g • Pure 92.5% Silver',
        artisanOrigin: 'Udaipur Royal Vaults',
        price: 999,
        mrp: 1499,
        tag: 'Antique Silver',
        badgeIcon: '🌿',
    },
]

export default function HeroSection() {
    const [current, setCurrent] = useState(0)
    const [mounted, setMounted] = useState(false)
    const [appointModalOpen, setAppointModalOpen] = useState(false)
    const [tryOnOpen, setTryOnOpen] = useState(false)
    const [pincode, setPincode] = useState('')
    const [pincodeResult, setPincodeResult] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
        const timer = setInterval(() => {
            setCurrent(c => (c + 1) % LUXURY_SLIDES.length)
        }, 8500)
        return () => clearInterval(timer)
    }, [])

    const slide = LUXURY_SLIDES[current]
    const currentProduct: ProductItem =
        ALL_PRODUCTS.find(p => p.slug === slide.productSlug) || ALL_PRODUCTS[0]

    const handlePincodeCheck = (e: React.FormEvent) => {
        e.preventDefault()
        if (pincode.length === 6 && /^\d+$/.test(pincode)) {
            const today = new Date()
            const delDate = new Date(today.setDate(today.getDate() + 2))
            const formatted = delDate.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
            })
            setPincodeResult(`VIP Insured Delivery available by ${formatted} to Pincode ${pincode}`)
        } else {
            setPincodeResult('Please enter a valid 6-digit Indian PIN code.')
        }
    }

    return (
        <section
            className="relative min-h-[96vh] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-[#0A0205] text-white pt-24 sm:pt-28"
            suppressHydrationWarning
        >
            {/* Cinematic Background Image Layer with Luxury Dark Vignette */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                {mounted ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.03 }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={slide.bgImage}
                                alt={slide.titleLead}
                                fill
                                priority
                                quality={95}
                                sizes="100vw"
                                className="object-cover object-center filter brightness-[0.45] contrast-[1.15]"
                            />
                            {/* Multi-layered luxury obsidian & gold aura gradients */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0C0206] via-[#0C0206]/85 to-[#0C0206]/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0205] via-transparent to-black/50" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,_rgba(201,166,107,0.18)_0%,_transparent_60%)]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(139,26,43,0.25)_0%,_transparent_55%)]" />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="absolute inset-0">
                        <Image
                            src={LUXURY_SLIDES[0].bgImage}
                            alt="The Blue Pearl Haute Joaillerie"
                            fill
                            priority
                            quality={95}
                            sizes="100vw"
                            className="object-cover object-center filter brightness-[0.45]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0206] via-[#0C0206]/85 to-[#0C0206]/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0205] via-transparent to-black/50" />
                    </div>
                )}
            </div>

            {/* Main Interactive Stage Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center py-8 lg:py-12">
                
                {/* Royal Maison Crest Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center gap-3 mb-6"
                >
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-brand-gold/60" />
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-brand-gold font-sans font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                        MAISON D&apos;ARTISAN • ESTD 1994 • JAIPUR &amp; UDAIPUR
                    </span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-brand-gold/60" />
                </motion.div>

                {/* 2-Column Split: Editorial Storytelling (Left) & Showcase Pedestal (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Column: Editorial & Interactive Experience (7 Cols) */}
                    <div className="lg:col-span-7 flex flex-col items-start">
                        
                        {/* Collection Category Pill */}
                        <motion.div
                            key={`cat-${current}`}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 bg-brand-maroon-300/40 border border-brand-gold/40 backdrop-blur-md shadow-[0_0_20px_rgba(201,166,107,0.15)]"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                            <span className="text-brand-gold text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold">
                                {slide.category}
                            </span>
                        </motion.div>

                        {/* Grand Royal Headline */}
                        <motion.h1
                            key={`head-${current}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="font-display text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight mb-5 text-white drop-shadow-2xl"
                        >
                            <span className="block">{slide.titleLead}</span>
                            <span className="text-gold-gradient italic font-serif font-light block mt-1">
                                {slide.titleHighlight}
                            </span>
                        </motion.h1>

                        {/* Story Excerpt */}
                        <motion.p
                            key={`story-${current}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-brand-silver/90 text-sm sm:text-base md:text-lg font-serif italic mb-7 max-w-2xl leading-relaxed drop-shadow"
                        >
                            &ldquo;{slide.story}&rdquo;
                        </motion.p>

                        {/* Craftsmanship Highlights Badges */}
                        <motion.div
                            key={`specs-${current}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 mb-8 w-full"
                        >
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-brand-gold/25 backdrop-blur-xs text-xs text-brand-silver">
                                <Award className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                                <span className="truncate">{slide.purityBadge}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-brand-gold/25 backdrop-blur-xs text-xs text-brand-silver">
                                <Gem className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                                <span className="truncate">{slide.weightSpec}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 border border-brand-gold/25 backdrop-blur-xs text-xs text-brand-silver col-span-2 sm:col-span-1">
                                <Sparkles className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />
                                <span className="truncate">{slide.artisanOrigin}</span>
                            </div>
                        </motion.div>

                        {/* High-Impact Action CTAs */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                            <Link
                                href={`/product/${slide.productSlug}`}
                                className="btn-gold py-3.5 sm:py-4 px-7 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group shadow-[0_0_35px_rgba(201,166,107,0.4)] hover:scale-[1.03] transition-all duration-300"
                            >
                                <span>Acquire Masterpiece</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                            </Link>

                            <button
                                type="button"
                                onClick={() => setTryOnOpen(true)}
                                className="py-3.5 sm:py-4 px-6 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-[#1C0710]/90 text-brand-gold border border-brand-gold/60 hover:bg-brand-gold hover:text-brand-maroon transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(201,166,107,0.3)]"
                            >
                                <Camera className="w-4 h-4" />
                                <span>Virtual Try-On (AR)</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setAppointModalOpen(true)}
                                className="py-3.5 sm:py-4 px-5 rounded-xs text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 bg-black/40 text-brand-silver/90 border border-white/20 hover:border-brand-gold hover:text-white transition-all duration-300 backdrop-blur-xs"
                            >
                                <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                                <span>Private Viewing</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Floating Masterpiece Pedestal Card (5 Cols) */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-end">
                        <motion.div
                            key={`card-${current}`}
                            initial={{ opacity: 0, scale: 0.94, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#1E0612]/90 via-[#14030B]/90 to-[#0A0205]/95 border border-brand-gold/40 rounded-sm p-5 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl group"
                        >
                            {/* Golden Hairline Corner Accents */}
                            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-brand-gold" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-brand-gold" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-brand-gold" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-brand-gold" />

                            {/* Top Card Info Bar */}
                            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20 mb-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm">{slide.badgeIcon}</span>
                                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-gold">
                                        Artisan Spotlight
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                                    {currentProduct.purity} Pure
                                </span>
                            </div>

                            {/* Jewel Image with Radial Glow Aura */}
                            <div className="relative h-64 sm:h-72 w-full rounded-sm overflow-hidden bg-black/60 border border-brand-gold/20 flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,166,107,0.25)_0%,_transparent_70%)]" />
                                
                                <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out">
                                    <Image
                                        src={currentProduct.image}
                                        alt={currentProduct.name}
                                        fill
                                        priority
                                        className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                                    />
                                </div>

                                {/* Floating Micro Hotspots on Jewel */}
                                <div className="absolute top-3 left-3 bg-black/75 border border-brand-gold/40 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-brand-gold flex items-center gap-1.5 shadow-lg">
                                    <Award className="w-3 h-3 text-brand-gold" />
                                    <span>BIS 916 Hallmark</span>
                                </div>

                                <button
                                    onClick={() => setTryOnOpen(true)}
                                    className="absolute bottom-3 right-3 bg-brand-gold text-brand-maroon hover:bg-white transition-colors p-2 rounded-full shadow-[0_0_20px_rgba(201,166,107,0.5)]"
                                    title="Try on in AR"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Bottom Card Specs & Pricing */}
                            <div className="mt-4 flex flex-col gap-2">
                                <Link
                                    href={`/product/${currentProduct.slug}`}
                                    className="font-display font-bold text-lg text-white group-hover:text-brand-gold transition-colors truncate"
                                >
                                    {currentProduct.name}
                                </Link>

                                <div className="flex items-baseline justify-between pt-1">
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-bold font-mono text-gold-gradient">
                                                ₹{currentProduct.salePrice.toLocaleString('en-IN')}
                                            </span>
                                            <span className="text-xs font-mono text-brand-silver/50 line-through">
                                                ₹{currentProduct.mrp.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-brand-silver/60">
                                            Making ₹{currentProduct.makingChargePerGram}/g • Incl. 3% GST
                                        </p>
                                    </div>

                                    <Link
                                        href={`/product/${currentProduct.slug}`}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold hover:text-white uppercase tracking-wider py-1"
                                    >
                                        <span>View Details</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Horizon Strip: Collection Selector Cards & Quick VIP Delivery Bar */}
            <div className="relative z-10 w-full bg-[#080104]/90 border-t border-brand-gold/20 backdrop-blur-md py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
                    
                    {/* Collection Pillar Selector Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
                        {LUXURY_SLIDES.map((s, idx) => (
                            <button
                                key={s.id}
                                onClick={() => setCurrent(idx)}
                                className={`text-left p-2.5 rounded border transition-all duration-300 flex items-center gap-3 ${
                                    current === idx
                                        ? 'bg-[#220713] border-brand-gold shadow-[0_0_20px_rgba(201,166,107,0.25)] ring-1 ring-brand-gold/40'
                                        : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100 hover:border-brand-gold/40'
                                }`}
                            >
                                <div className="text-xl">{s.badgeIcon}</div>
                                <div className="min-w-0">
                                    <p className="text-[9px] text-brand-gold font-mono font-bold tracking-widest uppercase">
                                        0{idx + 1}
                                    </p>
                                    <p className="text-xs text-white font-medium truncate">{s.tag}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Quick Pincode Delivery Estimator */}
                    <form
                        onSubmit={handlePincodeCheck}
                        className="flex items-center gap-2 w-full lg:w-auto bg-black/60 border border-brand-gold/25 rounded px-3 py-1.5"
                    >
                        <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0" />
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="Enter PIN for VIP Delivery"
                            value={pincode}
                            onChange={e => {
                                setPincode(e.target.value)
                                setPincodeResult(null)
                            }}
                            className="bg-transparent text-xs text-white placeholder:text-brand-silver/50 outline-none w-36 sm:w-44 font-mono"
                        />
                        <button
                            type="submit"
                            className="text-[11px] font-bold uppercase tracking-wider text-brand-gold hover:text-white transition-colors px-2 py-0.5"
                        >
                            Check
                        </button>
                    </form>
                </div>

                {/* Pincode Result Alert */}
                {pincodeResult && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
                        <p className="text-xs text-brand-gold flex items-center gap-1.5 bg-brand-maroon-300/60 border border-brand-gold/30 rounded p-2 animate-fade-in">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{pincodeResult}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Modals: Private Viewing Appointment & Virtual Try-On AR */}
            <AppointmentModal
                isOpen={appointModalOpen}
                onClose={() => setAppointModalOpen(false)}
            />

            <VirtualTryOnModal
                isOpen={tryOnOpen}
                onClose={() => setTryOnOpen(false)}
                product={currentProduct}
            />
        </section>
    )
}

