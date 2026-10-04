'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

const OCCASIONS = [
    {
        title: 'Bridal Splendour',
        tagline: 'Forever Heirlooms',
        desc: 'Uncut Jadau Kundan, multi-layered temple chokers, and 22K gold-plated bridal sets crafted for your sacred vows.',
        image: '/images/products/bridal-necklace-earring-set.jpeg',
        href: '/shop?category=bridal',
        count: '12 Curated Sets',
    },
    {
        title: 'Festive Celebrations',
        tagline: 'Navratri & Diwali Radiance',
        desc: 'Intricately oxidised Rajputana silver stacks, rhythmic payals, and statement jhumkas that dance to festive joy.',
        image: '/images/products/antique-oxidised-bangle-set.jpeg',
        href: '/shop?collection=antique',
        count: '18 Signature Pieces',
    },
    {
        title: 'Everyday Elegance',
        tagline: 'Understated Luxury',
        desc: 'Minimal wire-filigree pendants, lightweight floral studs, and adjustable cuffs designed for graceful daily wear.',
        image: '/images/products/filigree-pendant-chain.jpeg',
        href: '/shop?category=earrings',
        count: '15 Daily Essentials',
    },
    {
        title: 'Royal Heritage Gifting',
        tagline: 'Cherished Moments',
        desc: 'Certified BIS Hallmarked keepsakes, bespoke engraved kadas, and statement cocktail rings presented in velvet cases.',
        image: '/images/products/gold-filigree-statement-ring.jpeg',
        href: '/shop?category=rings',
        count: 'Gift Ready · With Custom Note',
    },
]

export default function ShopByOccasion() {
    return (
        <section className="py-20 md:py-28 bg-[#0F0207] relative overflow-hidden border-t border-brand-gold/15">
            {/* Ambient gold glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#C9A66B08_0%,_transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-brand-gold/30 rounded-full mb-3.5 bg-brand-maroon/30 backdrop-blur-xs">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                        <span className="text-brand-gold text-[10px] tracking-[0.3em] uppercase font-sans font-semibold">
                            Occasion Styling
                        </span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                        Adorn Every Occasion
                    </h2>
                    <p className="text-brand-silver/60 text-xs sm:text-sm mt-3 leading-relaxed">
                        From sacred wedding rituals to subtle daily expressions, find jewellery meticulously tuned to your life's memorable milestones.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {OCCASIONS.map((occ, i) => (
                        <motion.div
                            key={occ.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Link
                                href={occ.href}
                                className="group relative block h-80 sm:h-96 rounded-sm overflow-hidden border border-brand-gold/20 hover:border-brand-gold/60 transition-all duration-500 shadow-xl"
                            >
                                <Image
                                    src={occ.image}
                                    alt={occ.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={92}
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />

                                {/* Dual layered gradient overlays for cinematic text contrast */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0206] via-[#0E0206]/50 to-transparent" />
                                <div className="absolute inset-0 bg-brand-maroon/20 group-hover:bg-transparent transition-colors duration-500" />

                                {/* Top Pill */}
                                <div className="absolute top-5 left-5">
                                    <span className="bg-black/50 border border-brand-gold/30 text-brand-gold text-[10px] uppercase tracking-[0.2em] font-sans font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                                        {occ.tagline}
                                    </span>
                                </div>

                                {/* Bottom Info Box */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-brand-gold transition-colors duration-300">
                                            {occ.title}
                                        </h3>
                                        <span className="text-brand-gold/70 text-xs font-mono hidden sm:inline">
                                            {occ.count}
                                        </span>
                                    </div>
                                    <p className="text-brand-silver/70 text-xs sm:text-sm leading-relaxed max-w-lg line-clamp-2 group-hover:text-brand-silver/90 transition-colors">
                                        {occ.desc}
                                    </p>

                                    <div className="mt-4 flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest translate-y-1 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-300">
                                        <span>Discover Occasion Pieces</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
