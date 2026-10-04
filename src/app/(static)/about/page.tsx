import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'About Us — Our Story',
    description: 'The story behind The Blue Pearl — a family of artisans dedicated to preserving India\'s jewellery-making traditions.',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-brand-black">
            {/* Hero */}
            <section className="relative py-24 bg-brand-maroon overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_#C9A66B_0%,_transparent_70%)]" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <p className="text-brand-gold/60 text-xs tracking-[0.3em] uppercase mb-4">Est. 2014</p>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-6">
                        A Legacy Woven in Gold
                    </h1>
                    <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent mb-6" />
                    <p className="text-brand-silver/70 text-lg font-serif italic leading-relaxed">
                        "Every piece we create carries the memory of a thousand hands that shaped our craft —
                        the grandmothers who wore these designs, the artisans who perfected them, and the women
                        who will carry them forward."
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="py-16 md:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <p className="text-brand-gold/60 text-xs tracking-[0.3em] uppercase mb-3">Our Story</p>
                            <h2 className="font-display text-3xl font-bold text-white mb-5">Born in the Workshops of Jaipur</h2>
                            <div className="space-y-4 text-brand-silver/60 leading-relaxed">
                                <p>The Blue Pearl was born in the narrow lanes of Jaipur's Johari Bazaar — where the air smells of metal polish and age-old designs are etched into copper plates passed down through generations. Our founder, Meenaben, grew up watching her father and grandfather create masterpieces for maharanis and noble families.</p>
                                <p>What began as a small workshop selling oxidised silver bangles at local haats has grown into a nationwide brand — but we have never lost sight of what matters most: the artisan. Every piece you purchase supports fair-wage craftspeople who practice dying arts.</p>
                                <p>We fuse temple craftsmanship with contemporary sensibility, creating jewellery that works equally well at a family puja, a wedding reception, or a fashion shoot in Mumbai. Antique Charm. Modern Grace. Jewellery that speaks your story.</p>
                            </div>
                        </div>
                        <div className="relative h-72 md:h-96 rounded overflow-hidden border border-brand-gold/20">
                            <Image src="/images/hero/hero-banner-1.jpeg" alt="The Blue Pearl Workshop" fill className="object-cover object-center" />
                            <div className="absolute inset-0 bg-brand-maroon/30" />
                        </div>
                    </div>

                    {/* Values */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-12 border-y border-brand-gold/20">
                        {[
                            { emoji: '🏺', title: 'Artisan-First', desc: 'Every piece is handcrafted by skilled artisans earning fair wages in our Jaipur workshop. No machine replication.' },
                            { emoji: '🌿', title: 'Responsible Materials', desc: 'We use recycled metals wherever possible and source stones responsibly, with full supply-chain transparency.' },
                            { emoji: '♾️', title: 'Timeless Design', desc: 'We do not follow fast-fashion cycles. Our designs are built to last — heirlooms you pass down, not trends you discard.' },
                        ].map(v => (
                            <div key={v.title} className="text-center p-6 bg-brand-maroon-300 border border-brand-gold/10 rounded-sm">
                                <span className="text-4xl mb-4 block">{v.emoji}</span>
                                <h3 className="font-display font-bold text-brand-gold text-lg mb-2">{v.title}</h3>
                                <p className="text-brand-silver/60 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <Link href="/shop" className="btn-gold">Explore Our Collections</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
