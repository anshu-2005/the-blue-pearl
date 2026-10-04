'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { ALL_PRODUCTS } from '@/lib/data'
import ProductCard from '@/components/common/ProductCard'

export default function BestSellers() {
    const bestSellers = ALL_PRODUCTS.filter(p => p.bestSeller || p.featured).slice(0, 8)

    return (
        <section className="py-20 bg-brand-black relative">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-maroon-300/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-brand-gold/30 rounded-full mb-3 bg-brand-maroon/40">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                        <span className="text-brand-gold text-[10px] tracking-[0.25em] uppercase font-sans font-semibold">
                            Atelier Curations
                        </span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                        Signature Masterpieces
                    </h2>
                    <p className="text-brand-silver/70 text-xs md:text-sm max-w-lg mx-auto font-sans">
                        Our most cherished antique gold, oxidised silver and Kundan designs, hand-finished by master karigars.
                    </p>
                </motion.div>

                {/* Product Grid with Instant Quick View */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {bestSellers.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>

                {/* View all CTA */}
                <div className="mt-14 text-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-brand-gold hover:text-white border-b border-brand-gold/40 hover:border-white pb-1 text-xs uppercase tracking-[0.2em] font-sans font-semibold transition-all duration-200 group"
                    >
                        <span>Explore Full Master Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
