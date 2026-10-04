import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'Terms and Conditions for The Blue Pearl jewellery store.',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-brand-black py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2">Terms & Conditions</h1>
                <p className="text-brand-silver/40 text-sm mb-10">Last updated: August 2026</p>
                <div className="prose prose-invert max-w-none space-y-8 text-brand-silver/70 text-sm leading-relaxed">
                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-gold mb-3">1. Agreement to Terms</h2>
                        <p>By accessing and using The Blue Pearl website (thebluepearl.in), you accept and agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of our website immediately.</p>
                    </section>
                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-gold mb-3">2. Products & Pricing</h2>
                        <p>We reserve the right to modify prices without notice. Product images are representative; slight variations in colour and finish may occur due to the handcrafted nature of our jewellery. All prices are inclusive of taxes unless stated otherwise.</p>
                    </section>
                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-gold mb-3">3. Orders & Payments</h2>
                        <p>Orders are confirmed only upon successful payment. We accept payments via Razorpay (Cards, UPI, Netbanking, Wallets) and Cash on Delivery (where available). The Blue Pearl shall not be liable for payment gateway failures beyond our control.</p>
                    </section>
                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-gold mb-3">4. Intellectual Property</h2>
                        <p>All content on this website — including designs, photographs, text, and logos — is the property of The Blue Pearl and protected under Indian copyright law. Reproduction without written consent is prohibited.</p>
                    </section>
                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-gold mb-3">5. Limitation of Liability</h2>
                        <p>The Blue Pearl's liability is limited to the value of the product purchased. We are not responsible for indirect, consequential, or incidental damages arising from the use of our products or website.</p>
                    </section>
                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-gold mb-3">6. Governing Law</h2>
                        <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Jaipur, Rajasthan.</p>
                    </section>
                    <section>
                        <h2 className="font-display text-xl font-bold text-brand-gold mb-3">7. Contact</h2>
                        <p>For questions about these terms, email us at <a href="mailto:hello@thebluepearl.in" className="text-brand-gold hover:underline">hello@thebluepearl.in</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
