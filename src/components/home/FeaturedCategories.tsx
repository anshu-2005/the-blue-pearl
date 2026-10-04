'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CATEGORIES } from '@/lib/data'

export default function FeaturedCategories() {
    return (
        /* ── CREAM SECTION — creates visual contrast break ─────────────────────────── */
        <section className="py-16 md:py-24 bg-[#F8F2E6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-brand-maroon/60 text-xs tracking-[0.3em] uppercase mb-3 font-sans">Curated Craftsmanship</p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-maroon leading-tight">
                        Shop By Category
                    </h2>
                    {/* Gold diamond divider */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className="w-16 h-px bg-brand-maroon/20" />
                        <span className="text-brand-gold text-xl">◆</span>
                        <div className="w-16 h-px bg-brand-maroon/20" />
                    </div>
                </motion.div>

                {/* Category grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                    {CATEGORIES.map((cat, idx) => (
                        <motion.div
                            key={cat.slug}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.06 }}
                            className={idx === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
                        >
                            <Link
                                href={`/shop?category=${cat.slug}`}
                                id={`cat-${cat.slug}`}
                                className="group relative overflow-hidden rounded-xs block border border-brand-maroon/10 hover:border-brand-gold/60 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(42,10,20,0.25)] h-full"
                            >
                                {/* Image */}
                                <div className={`relative overflow-hidden ${idx === 0 ? 'h-64 sm:h-full min-h-[19rem]' : 'h-44 md:h-52'} bg-brand-maroon/20`}>
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        quality={90}
                                        className="object-cover object-center group-hover:scale-108 transition-transform duration-700"
                                    />
                                    {/* Maroon gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/90 via-brand-maroon/30 to-transparent" />
                                </div>

                                {/* Label */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="font-display font-bold text-white text-base md:text-lg group-hover:text-brand-gold transition-colors duration-300">
                                        {cat.name}
                                    </h3>
                                    <p className="text-brand-gold/80 text-xs mt-0.5 line-clamp-1">{cat.description || `${cat.count} Designs`}</p>
                                </div>

                                {/* Gold shimmer on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent pointer-events-none" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View all */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <Link
                        href="/shop"
                        id="categories-view-all"
                        className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-brand-maroon text-brand-maroon font-bold text-xs tracking-[0.18em] uppercase rounded-xs hover:bg-brand-maroon hover:text-brand-gold transition-all duration-300 shadow-sm"
                    >
                        View Full Master Catalog
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
