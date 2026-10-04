'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const COLLECTIONS = [
    {
        name: 'Antique Collection',
        desc: 'Timeless pieces with oxidised silver finish — heritage reimagined.',
        image: '/images/products/tribal-silver-cuff-bangle.jpeg',
        href: '/shop?collection=antique',
        badge: 'Heritage Series',
    },
    {
        name: 'Temple Art',
        desc: 'Sacred motifs, divine craftsmanship — jewellery for the soul.',
        image: '/images/products/temple-lakshmi-necklace.jpeg',
        href: '/shop?collection=temple',
        badge: 'Devotional',
    },
    {
        name: 'Bridal Splendour',
        desc: 'Complete bridal jewellery sets — crafted for your forever moment.',
        image: '/images/products/bridal-necklace-earring-set.jpeg',
        href: '/shop?category=bridal',
        badge: 'Bridal',
    },
    {
        name: 'Contemporary Fusion',
        desc: 'Modern silhouettes with traditional soul — wear your heritage lightly.',
        image: '/images/products/gold-filigree-statement-ring.jpeg',
        href: '/shop?collection=contemporary',
        badge: 'Trending',
    },
]

export default function CollectionBanners() {
    return (
        // Back to dark — creating rhythm alternation
        <section className="py-16 md:py-24 bg-brand-maroon relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,_#C9A66B0A_0%,_transparent_65%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-brand-gold/50 text-xs tracking-[0.3em] uppercase mb-3">Curated For You</p>
                    <h2 className="section-heading-gold">Shop by Collection</h2>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className="w-16 h-px bg-brand-gold/20" />
                        <span className="text-brand-gold">◆</span>
                        <div className="w-16 h-px bg-brand-gold/20" />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    {COLLECTIONS.map((col, i) => (
                        <motion.div
                            key={col.name}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <Link
                                href={col.href}
                                id={`collection-${col.name.toLowerCase().replace(/\s/g, '-')}`}
                                className="group relative h-60 md:h-72 overflow-hidden rounded-sm block border border-brand-gold/10 hover:border-brand-gold/40 transition-all duration-400 hover:shadow-[0_8px_40px_rgba(201,166,107,0.25)]"
                            >
                                <Image
                                    src={col.image}
                                    alt={col.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={90}
                                    className="object-cover object-center group-hover:scale-[1.06] transition-transform duration-700"
                                />
                                {/* Layered gradient for depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon via-brand-maroon/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-maroon/30 via-transparent to-transparent" />

                                {/* Badge */}
                                <span className="absolute top-4 left-4 px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 rounded-full text-brand-gold text-[10px] tracking-[0.2em] uppercase backdrop-blur-sm">
                                    {col.badge}
                                </span>

                                {/* Text overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-1.5 group-hover:text-brand-gold transition-colors duration-300">
                                        {col.name}
                                    </h3>
                                    <p className="text-brand-silver/60 text-sm leading-snug group-hover:text-brand-silver/80 transition-colors">
                                        {col.desc}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <span className="text-brand-gold text-sm font-semibold tracking-wide">Explore Collection</span>
                                        <span className="text-brand-gold">→</span>
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
