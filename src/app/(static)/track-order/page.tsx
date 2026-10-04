'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function TrackOrderPage() {
    const [form, setForm] = useState({ orderId: '', email: '' })
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<null | 'found' | 'not_found'>(null)

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        // Stub — replace with real Shiprocket tracking API call
        if (form.orderId.startsWith('TBP')) {
            setResult('found')
        } else {
            setResult('not_found')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-brand-black py-20">
            <div className="max-w-lg mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="font-display text-4xl font-bold text-gold-gradient mb-3">Track Your Order</h1>
                    <p className="text-brand-silver/60 text-sm">Enter your Order ID and registered email to track your shipment in real time.</p>
                </div>
                <div className="bg-[#1E0A10] border border-brand-gold/20 rounded-sm p-8">
                    <form onSubmit={handleTrack} className="space-y-5">
                        <div>
                            <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1.5">Order ID *</label>
                            <input required value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))} placeholder="e.g. TBP20240001" className="input-gold" />
                        </div>
                        <div>
                            <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1.5">Email / Phone *</label>
                            <input required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Registered email or phone" className="input-gold" />
                        </div>
                        <button type="submit" disabled={loading} className="btn-gold w-full">
                            {loading ? 'Tracking...' : 'Track Order'}
                        </button>
                    </form>

                    {result === 'found' && (
                        <div className="mt-6 p-4 bg-brand-maroon-300 border border-brand-gold/20 rounded-sm">
                            <p className="text-brand-gold font-display font-bold mb-3">Order {form.orderId}</p>
                            <div className="space-y-2">
                                {['Order Placed', 'Payment Confirmed', 'Packed', 'Shipped'].map((step, i) => (
                                    <div key={step} className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i < 4 ? 'bg-brand-gold' : 'bg-brand-maroon-200 border border-brand-gold/30'}`} />
                                        <span className="text-sm text-brand-silver/70">{step}</span>
                                        {i === 3 && <span className="text-xs text-green-400 ml-auto">Current</span>}
                                    </div>
                                ))}
                            </div>
                            <p className="text-brand-silver/50 text-xs mt-4">Estimated delivery: 2–3 more business days</p>
                        </div>
                    )}
                    {result === 'not_found' && (
                        <p className="mt-6 text-red-400 text-sm text-center">Order not found. Please check your Order ID and try again.</p>
                    )}
                </div>
                <p className="text-center text-brand-silver/40 text-xs mt-6">
                    Need help? <a href="mailto:hello@thebluepearl.in" className="text-brand-gold hover:underline">Contact us</a>
                </p>
            </div>
        </div>
    )
}
