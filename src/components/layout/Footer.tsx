'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

const QUICK_LINKS = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Bangles', href: '/shop?category=bangles' },
    { label: 'Necklaces', href: '/shop?category=necklaces' },
    { label: 'Earrings', href: '/shop?category=earrings' },
    { label: 'Bridal Sets', href: '/shop?category=bridal' },
    { label: 'New Arrivals', href: '/shop?sort=newest' },
]

const SUPPORT_LINKS = [
    { label: 'Track Order', href: '/track-order' },
    { label: 'Return & Refund', href: '/return-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'FAQs', href: '/faqs' },
]

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    )
}

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    )
}

function YoutubeIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.57 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
        </svg>
    )
}

export default function Footer() {
    return (
        <footer className="bg-brand-maroon border-t border-brand-gold/20">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <span className="font-display text-2xl font-bold text-gold-gradient tracking-wider">
                                The Blue Pearl
                            </span>
                            <p className="text-brand-gold/50 text-xs tracking-[0.15em] uppercase mt-0.5">
                                Elegance in Every Detail
                            </p>
                        </Link>
                        <p className="text-brand-silver/60 text-sm leading-relaxed mb-6">
                            Antique Charm. Modern Grace. Each piece is handcrafted by skilled artisans
                            who carry forward centuries of jewellery-making tradition — fusing temple
                            craftsmanship with contemporary sensibility.
                        </p>

                        {/* Social icons */}
                        <div className="flex items-center gap-3">
                            {[
                                { Icon: InstagramIcon, href: '#', label: 'Instagram' },
                                { Icon: FacebookIcon, href: '#', label: 'Facebook' },
                                { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
                            ].map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 border border-brand-gold/30 rounded flex items-center justify-center
                             text-brand-gold/60 hover:text-brand-gold hover:border-brand-gold transition-all duration-200"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="font-display text-brand-gold font-semibold mb-4 text-sm tracking-widest uppercase">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {QUICK_LINKS.map(link => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-brand-silver/60 hover:text-brand-gold text-sm transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-display text-brand-gold font-semibold mb-4 text-sm tracking-widest uppercase">
                            Customer Care
                        </h4>
                        <ul className="space-y-2.5">
                            {SUPPORT_LINKS.map(link => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-brand-silver/60 hover:text-brand-gold text-sm transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact + Newsletter */}
                    <div>
                        <h4 className="font-display text-brand-gold font-semibold mb-4 text-sm tracking-widest uppercase">
                            Get in Touch
                        </h4>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-2 text-sm text-brand-silver/60">
                                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-gold/50" />
                                <a href="mailto:hello@thebluepearl.in" className="hover:text-brand-gold transition-colors">
                                    hello@thebluepearl.in
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-brand-silver/60">
                                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-gold/50" />
                                <a href="tel:+919876543210" className="hover:text-brand-gold transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-brand-silver/60">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-gold/50" />
                                <span>Jaipur, Rajasthan, India — 302001</span>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <p className="text-brand-silver/60 text-xs mb-2 uppercase tracking-widest">Newsletter</p>
                        <form onSubmit={e => e.preventDefault()} className="flex gap-0">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-3 py-2 bg-brand-maroon-300 border border-brand-gold/30 rounded-l
                           text-sm text-white placeholder:text-brand-silver/30
                           focus:outline-none focus:border-brand-gold transition-colors"
                                id="footer-newsletter-input"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-brand-gold text-brand-maroon text-sm font-semibold rounded-r
                           hover:bg-brand-gold-300 transition-colors cursor-pointer"
                                id="footer-newsletter-btn"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Gold divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

            {/* Bottom bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs text-brand-silver/40 text-center md:text-left flex-wrap">
                        <p>© {new Date().getFullYear()} The Blue Pearl. All rights reserved. Made with ♥ in India.</p>
                        <span>•</span>
                        <Link href="/admin" className="text-brand-gold/70 hover:text-brand-gold transition underline font-medium">
                            Admin Atelier Portal →
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {['UPI', 'Visa', 'Mastercard', 'RuPay', 'Netbanking', 'COD'].map(method => (
                            <span
                                key={method}
                                className="px-2 py-0.5 border border-brand-gold/20 rounded text-brand-gold/40 text-[10px] tracking-wide"
                            >
                                {method}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
