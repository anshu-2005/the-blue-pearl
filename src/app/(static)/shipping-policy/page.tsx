import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Shipping Policy', description: 'Shipping Policy for The Blue Pearl.' }
export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-brand-black py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2">Shipping Policy</h1>
                <p className="text-brand-silver/40 text-sm mb-10">Effective from August 2026</p>
                <div className="space-y-8 text-brand-silver/70 text-sm leading-relaxed">
                    {[
                        ['Free Shipping', 'Enjoy complimentary shipping on all orders above ₹2,999 delivered anywhere within India. Orders below ₹2,999 are charged a flat ₹99 shipping fee.'],
                        ['Processing Time', 'Orders are processed within 1–2 business days of confirmed payment. You will receive a dispatch notification email with a tracking link once your order ships.'],
                        ['Delivery Timeline', 'Standard delivery: 3–5 business days for metro cities; 5–7 business days for Tier 2/3 cities and remote areas. Delivery timelines may extend during sale events, festivals, or unforeseen circumstances.'],
                        ['Tracking Your Order', 'Track your order from the "My Orders" section of your account, or use the Track Order page with your order ID and registered email/phone. Live Shiprocket tracking is available once your parcel is dispatched.'],
                        ['International Shipping', 'We currently ship within India only. International shipping is not available at this time.'],
                        ['Refused / Failed Deliveries', 'If a delivery attempt fails and the package is returned to us (RTO), we will contact you to reattempt delivery. A re-delivery fee may apply.'],
                    ].map(([t, b]) => (
                        <section key={t}><h2 className="font-display text-xl font-bold text-brand-gold mb-3">{t}</h2><p>{b}</p></section>
                    ))}
                </div>
            </div>
        </div>
    )
}
