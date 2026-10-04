'use client'
import { useState } from 'react'
import type { Metadata } from 'next'

const FAQS = [
    { q: 'Are your jewellery pieces handcrafted?', a: 'Yes, every piece sold at The Blue Pearl is handcrafted by skilled artisans in our Jaipur workshop. We do not mass-produce or machine-replicate any design.' },
    { q: 'What materials do you use?', a: 'We use high-quality oxidised silver, 22K gold-plated brass, kundan stones, glass beads, and meenakari enamel work. Material details are listed on every product page.' },
    { q: 'Will the gold plating fade?', a: 'Our gold-plated pieces use a thick plating that is designed to last. Avoid exposure to water, sweat, perfume, and chemicals to maximise longevity. Re-plating services are available on request.' },
    { q: 'How do I track my order?', a: 'Visit our Track Order page and enter your Order ID and registered email/phone. Alternatively, go to My Orders in your account for live tracking updates.' },
    { q: 'What is your return policy?', a: 'We offer 7-day hassle-free returns for unused products in original packaging. See our Return & Refund Policy for full details.' },
    { q: 'Can I cancel my order after placing it?', a: 'Orders can be cancelled within 12 hours of placement if they have not yet been dispatched. Contact us immediately at hello@thebluepearl.in or via WhatsApp.' },
    { q: 'Do you offer cash on delivery?', a: 'COD is available on select pincodes for orders up to ₹4,999. Availability is shown at checkout based on your delivery pincode.' },
    { q: 'Can I customise a piece?', a: 'We accept custom orders for bulk/wholesale and certain bridal sets. Contact us with your design references and requirements and we will revert within 2 business days.' },
    { q: 'Are your prices inclusive of GST?', a: 'Yes — all displayed prices are inclusive of applicable GST. The tax breakdown is shown on your invoice.' },
    { q: 'How do I care for oxidised silver jewellery?', a: 'Store in an airtight box or zip-lock bag when not in use. Avoid contact with water, soap, and perfume. Do not use silver polish on oxidised pieces as it will remove the antique finish.' },
]

export default function FAQsPage() {
    const [open, setOpen] = useState<number | null>(null)
    return (
        <div className="min-h-screen bg-brand-black py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2 text-center">Frequently Asked Questions</h1>
                <p className="text-brand-silver/50 text-center mb-10">Can't find your answer? <a href="mailto:hello@thebluepearl.in" className="text-brand-gold hover:underline">Email us</a>.</p>
                <div className="space-y-3">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="border border-brand-gold/20 rounded-sm overflow-hidden">
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left bg-[#1E0A10] hover:bg-brand-maroon-300 transition-colors"
                            >
                                <span className="font-display font-semibold text-white text-sm pr-4">{faq.q}</span>
                                <span className="text-brand-gold text-xl flex-shrink-0">{open === i ? '−' : '+'}</span>
                            </button>
                            {open === i && (
                                <div className="px-5 py-4 bg-brand-maroon/30 text-brand-silver/70 text-sm leading-relaxed border-t border-brand-gold/10">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
