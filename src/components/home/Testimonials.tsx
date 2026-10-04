'use client'

import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

const TESTIMONIALS = [
    {
        name: 'Priya Sharma',
        location: 'Mumbai',
        rating: 5,
        text: 'Absolutely mesmerising craftsmanship! I ordered the temple choker for my sister\'s wedding and it received so many compliments. The quality is beyond what I expected at this price point.',
        product: 'Temple Gold Choker Necklace',
        initial: 'P',
    },
    {
        name: 'Ananya Reddy',
        location: 'Hyderabad',
        rating: 5,
        text: 'The oxidised jhumkas are a dream. They\'re lightweight yet look so heavy and regal. Packaging was also very premium — felt like a luxury unboxing experience.',
        product: 'Oxidised Silver Jhumka Earrings',
        initial: 'A',
    },
    {
        name: 'Meera Iyer',
        location: 'Chennai',
        rating: 5,
        text: 'I\'ve been searching for authentic temple jewellery for months and The Blue Pearl delivered exactly that. The bangle set is perfect for Pongal and still feels contemporary enough for parties.',
        product: 'Temple Art Gold Bangle Pair',
        initial: 'M',
    },
    {
        name: 'Kavita Joshi',
        location: 'Pune',
        rating: 4,
        text: 'Really happy with the bridal set for my engagement. In person it\'s even more stunning. Delivery was prompt and customer service was very helpful throughout.',
        product: 'Bridal Gold Bangle Set',
        initial: 'K',
    },
    {
        name: 'Deepa Nair',
        location: 'Bangalore',
        rating: 5,
        text: 'My go-to jewellery brand now. Every piece from The Blue Pearl feels handmade with love. The antique finish is exactly what those of us who love vintage aesthetics have been searching for.',
        product: 'Antique Oxidised Bangle Set',
        initial: 'D',
    },
]

function TestimonialCard({ t, i }: { t: typeof TESTIMONIALS[0]; i: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative bg-white/90 border border-brand-maroon/10 rounded-sm p-6 shadow-[0_4px_20px_rgba(42,10,20,0.08)] hover:shadow-[0_8px_32px_rgba(42,10,20,0.14)] transition-shadow duration-300"
        >
            {/* Large quote */}
            <Quote className="absolute top-4 right-4 w-10 h-10 text-brand-maroon/6" />

            <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5" fill={si < t.rating ? '#C9A66B' : 'none'} stroke="#C9A66B" strokeWidth={1.5} />
                ))}
            </div>

            <p className="text-brand-maroon/75 text-sm leading-relaxed mb-5 font-serif italic">
                "{t.text}"
            </p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-maroon flex items-center justify-center text-brand-gold font-display font-bold text-sm flex-shrink-0">
                        {t.initial}
                    </div>
                    <div>
                        <p className="font-display font-bold text-brand-maroon text-sm">{t.name}</p>
                        <p className="text-brand-maroon/40 text-xs">{t.location}</p>
                    </div>
                </div>
                <p className="text-brand-gold/60 text-[10px] text-right max-w-[90px] leading-tight hidden sm:block">
                    {t.product}
                </p>
            </div>
        </motion.div>
    )
}

export default function Testimonials() {
    return (
        /* ── CREAM SECTION — third alternation ─────────────────────────────────── */
        <section className="py-16 md:py-24 bg-[#FAF5EC] relative overflow-hidden">
            {/* Subtle diagonal gold line texture */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C9A66B 0, #C9A66B 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-brand-maroon/50 text-xs tracking-[0.3em] uppercase mb-3">Customer Stories</p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-maroon leading-tight">
                        What Our Customers Say
                    </h2>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className="w-16 h-px bg-brand-maroon/20" />
                        <span className="text-brand-gold text-xl">◆</span>
                        <div className="w-16 h-px bg-brand-maroon/20" />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {TESTIMONIALS.slice(0, 3).map((t, i) => <TestimonialCard key={i} t={t} i={i} />)}
                </div>
                <div className="hidden lg:grid grid-cols-2 gap-5 mt-5 max-w-2xl mx-auto">
                    {TESTIMONIALS.slice(3).map((t, i) => <TestimonialCard key={i + 3} t={t} i={i + 3} />)}
                </div>
            </div>
        </section>
    )
}
