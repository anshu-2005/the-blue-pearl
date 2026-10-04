'use client'

import { motion } from 'framer-motion'
import { Shield, RotateCcw, Truck, Award } from 'lucide-react'

const BADGES = [
    { Icon: Award, title: 'Premium Quality', desc: 'Handcrafted by master artisans with certified materials and age-old techniques.' },
    { Icon: Shield, title: 'Secure Payments', desc: '100% safe checkout via Razorpay — Cards, UPI & more. SSL encrypted.' },
    {
        Icon: RotateCcw, title: '7-Day Returns', desc: "Hassle-free returns within 7 days if you're not completely delighted."
    },
    { Icon: Truck, title: 'Fast Shipping', desc: 'Free delivery on orders above ₹2,999 across India. Express options available.' },
]

export default function TrustBadges() {
    return (
        <section
            className="relative py-10 md:py-14 border-y border-brand-gold/20"
            style={{
                background: 'linear-gradient(135deg, #2A0A14 0%, #1E0810 50%, #2A0A14 100%)',
            }}
        >
            {/* Filigree texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A66B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {BADGES.map(({ Icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="w-12 h-12 rounded-full border border-brand-gold/40 flex items-center justify-center mb-3 bg-brand-maroon-300/50">
                                <Icon className="w-5 h-5 text-brand-gold" />
                            </div>
                            <h3 className="font-display font-semibold text-white text-sm mb-1">{title}</h3>
                            <p className="text-brand-silver/50 text-xs leading-relaxed hidden sm:block">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
