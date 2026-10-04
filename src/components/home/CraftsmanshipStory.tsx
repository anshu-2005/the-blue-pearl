'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, ShieldCheck, Sparkles, Hammer, Gem, CheckCircle2, ArrowRight } from 'lucide-react'

const CRAFT_PILLARS = [
    {
        icon: Hammer,
        title: 'Generational Nakshi Art',
        desc: 'Relief carving and hand-beaten repoussé work passed down across four generations of master goldsmiths.',
    },
    {
        icon: Gem,
        title: 'Authentic Jadau Foil Setting',
        desc: 'Uncut gemstones and faux polki stones nestled within 24K hyper-pure gold foil bezels without synthetic adhesives.',
    },
    {
        icon: Award,
        title: '100% BIS Laser Hallmarking',
        desc: 'Every bangle, necklace, and ring undergoes micro-spectrometry testing and carries an official BIS / 925 assay seal.',
    },
]

export default function CraftsmanshipStory() {
    return (
        <section className="py-20 md:py-28 bg-[#14040A] relative overflow-hidden border-t border-brand-gold/15">
            {/* Ambient gold glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#C9A66B08_0%,_transparent_65%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Left Column: Visual with luxury badge overlay */}
                    <motion.div
                        className="lg:col-span-5 relative"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative aspect-[4/5] rounded-sm overflow-hidden border-2 border-brand-gold/30 shadow-2xl">
                            <Image
                                src="/images/products/temple-lakshmi-necklace.jpeg"
                                alt="Master Goldsmith Crafting Jewellery"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                quality={95}
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#14040A] via-transparent to-transparent" />

                            {/* Hallmark floating badge */}
                            <div className="absolute bottom-6 left-6 right-6 bg-[#1A050E]/90 border border-brand-gold/40 p-4 rounded-sm backdrop-blur-md shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-gold/15 border border-brand-gold flex items-center justify-center text-brand-gold flex-shrink-0">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-semibold">Government Certified 916 Hallmark</p>
                                        <p className="text-brand-silver/50 text-[10px]">Purity Tested at Zaveri Bazaar Assay Hub</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Editorial Narrative & Pillars */}
                    <motion.div
                        className="lg:col-span-7 space-y-6"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-brand-gold/30 rounded-full bg-brand-maroon/40 backdrop-blur-xs">
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                            <span className="text-brand-gold text-[10px] tracking-[0.3em] uppercase font-sans font-semibold">
                                The Atelier & Heritage
                            </span>
                        </div>

                        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                            The Art of Preserving Royal Antiquity
                        </h2>

                        <p className="text-brand-silver/70 text-sm md:text-base leading-relaxed font-serif italic">
                            "We don't merely manufacture ornament; we sculpt living history. Each curve of our temple carvings and each knot of filigree wire carries the spirit of Indian royal lineages."
                        </p>

                        <div className="space-y-4 pt-4 border-t border-brand-gold/15">
                            {CRAFT_PILLARS.map(pillar => {
                                const Icon = pillar.icon
                                return (
                                    <div key={pillar.title} className="flex items-start gap-4">
                                        <div className="w-9 h-9 rounded bg-brand-maroon-300/80 border border-brand-gold/30 flex items-center justify-center text-brand-gold flex-shrink-0 mt-1">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-white text-sm font-semibold font-display">
                                                {pillar.title}
                                            </h4>
                                            <p className="text-brand-silver/60 text-xs mt-0.5 leading-relaxed">
                                                {pillar.desc}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                            <Link
                                href="/about"
                                className="btn-gold w-full sm:w-auto py-3 px-8 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                Read Our Atelier Story <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/shop"
                                className="btn-outline-gold w-full sm:w-auto py-3 px-6 text-xs font-bold uppercase tracking-wider text-center"
                            >
                                View Royal Creations
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
