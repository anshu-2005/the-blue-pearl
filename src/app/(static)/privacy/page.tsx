import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy', description: 'Privacy Policy for The Blue Pearl.' }

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-brand-black py-16">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-display text-4xl font-bold text-gold-gradient mb-2">Privacy Policy</h1>
                <p className="text-brand-silver/40 text-sm mb-10">Last updated: August 2026</p>
                <div className="space-y-8 text-brand-silver/70 text-sm leading-relaxed">
                    {[
                        ['Data We Collect', 'We collect personal information (name, email, phone, delivery address) when you register, place an order, or contact us. We also collect payment information through our secure payment partner Razorpay — we do not store card details.'],
                        ['How We Use Your Data', 'Your data is used to process orders, manage your account, personalise your shopping experience, and send order-related communications. We do not sell your data to third parties.'],
                        ['Cookies', 'We use cookies to improve your browsing experience, remember your cart, and analyse website traffic. You may disable cookies in your browser settings, though some features may not function correctly.'],
                        ['Data Security', 'We implement industry-standard security measures including SSL encryption and secure storage. While we strive to protect your data, no internet transmission is 100% secure.'],
                        ['Your Rights', 'You have the right to access, correct, or delete your personal data. Email us at hello@thebluepearl.in to exercise these rights. We will respond within 7 business days.'],
                        ['Third Parties', 'We share data with Razorpay (payment processing), Shiprocket (shipping), and Firebase (database/auth). These services have their own privacy policies.'],
                    ].map(([title, body]) => (
                        <section key={title}>
                            <h2 className="font-display text-xl font-bold text-brand-gold mb-3">{title}</h2>
                            <p>{body}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
