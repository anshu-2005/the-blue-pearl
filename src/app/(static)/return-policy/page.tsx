import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Return & Refund Policy', description: 'Return & Refund Policy for The Blue Pearl.' }
export default function ReturnPolicyPage() {
    return (
        <div className="min-h-screen bg-brand-black py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2">Return & Refund Policy</h1>
                <p className="text-brand-silver/40 text-sm mb-10">Effective from August 2026</p>
                <div className="space-y-8 text-brand-silver/70 text-sm leading-relaxed">
                    {[
                        ['7-Day Return Window', 'We offer hassle-free returns within 7 days of delivery. To be eligible, the item must be unused, in its original condition, with all tags and packaging intact.'],
                        ['Non-Returnable Items', 'Custom-made or personalised jewellery cannot be returned. Items showing signs of wear, damage, or alteration after delivery are not eligible.'],
                        ['How to Initiate a Return', 'Email hello@thebluepearl.in with your Order ID and reason for return, along with photographs of the item. Our team will confirm eligibility within 24 hours and arrange a pickup.'],
                        ['Refund Processing', 'Once the returned item is received and inspected, refunds are processed within 5–7 business days. Refunds are credited to the original payment method (card, UPI, wallet) or as store credit.'],
                        ['Shipping for Returns', 'For defective or incorrect items, we will arrange and bear the return shipping cost. For change-of-mind returns, a flat ₹99 return shipping fee will be deducted from your refund.'],
                        ['Exchange', "If you'd prefer an exchange over a refund, we are happy to facilitate this subject to stock availability.Contact us and we'll make it work."],
                    ].map(([t, b]) => (
                        <section key={t}><h2 className="font-display text-xl font-bold text-brand-gold mb-3">{t}</h2><p>{b}</p></section>
                    ))}
                </div>
            </div>
        </div>
    )
}
