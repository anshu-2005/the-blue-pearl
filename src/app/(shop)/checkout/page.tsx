'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { Shield, Lock, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Credit / Debit Card' },
    { id: 'netbanking', label: 'Net Banking' },
    { id: 'cod', label: 'Cash on Delivery' },
]

export default function CheckoutPage() {
    const items = useCartStore(s => s.items)
    const subtotal = useCartStore(s => s.subtotal())
    const shipping = useCartStore(s => s.shippingFee())
    const total = useCartStore(s => s.total())
    const discount = useCartStore(s => s.discount)
    const clearCart = useCartStore(s => s.clearCart)
    const router = useRouter()

    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [address, setAddr] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pin: '' })
    const [payment, setPayment] = useState('upi')
    const [placing, setPlacing] = useState(false)

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                <p className="font-display text-2xl text-brand-gold">Your cart is empty</p>
                <Link href="/shop" className="btn-gold">Shop Now</Link>
            </div>
        )
    }

    const placeOrder = async () => {
        setPlacing(true)
        // Simulate Razorpay flow — wire /api/orders/create later
        await new Promise(r => setTimeout(r, 1500))
        clearCart()
        toast.success('Order placed successfully! 🎉')
        router.push('/account/orders')
    }

    return (
        <div className="min-h-screen bg-brand-black py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Steps */}
                <div className="flex items-center gap-2 mb-10 text-sm">
                    {(['Address', 'Payment', 'Review'] as const).map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 <= step ? 'bg-brand-gold text-brand-maroon' : 'bg-brand-maroon-300 text-brand-silver/40'}`}>
                                {i + 1}
                            </div>
                            <span className={i + 1 <= step ? 'text-brand-gold' : 'text-brand-silver/40'}>{s}</span>
                            {i < 2 && <ChevronRight className="w-4 h-4 text-brand-silver/30" />}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1 — Address */}
                        {step === 1 && (
                            <div className="bg-[#1E0A10] border border-brand-gold/20 rounded-sm p-6">
                                <h2 className="font-display text-xl font-bold text-brand-gold mb-5">Delivery Address</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {[['Full Name', 'name', 'Your full name'], ['Phone', 'phone', '+91 XXXXX XXXXX'], ['Address Line 1', 'line1', 'House / Flat / Building'], ['Address Line 2', 'line2', 'Street / Area (optional)'], ['City', 'city', 'City'], ['State', 'state', 'State'], ['Pincode', 'pin', '6-digit pincode']].map(([l, k, p]) => (
                                        <div key={k} className={k === 'line1' || k === 'line2' ? 'sm:col-span-2' : ''}>
                                            <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1.5">{l}</label>
                                            <input
                                                value={(address as any)[k]}
                                                onChange={e => setAddr(a => ({ ...a, [k]: e.target.value }))}
                                                placeholder={p}
                                                className="input-gold"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => { if (!address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.pin) { toast.error('Please fill all required fields'); return }; setStep(2) }}
                                    className="btn-gold mt-6"
                                >
                                    Continue to Payment →
                                </button>
                            </div>
                        )}

                        {/* Step 2 — Payment */}
                        {step === 2 && (
                            <div className="bg-[#1E0A10] border border-brand-gold/20 rounded-sm p-6">
                                <h2 className="font-display text-xl font-bold text-brand-gold mb-5">Payment Method</h2>
                                <div className="space-y-3">
                                    {PAYMENT_METHODS.map(m => (
                                        <label key={m.id} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${payment === m.id ? 'border-brand-gold bg-brand-maroon-300' : 'border-brand-gold/20 hover:border-brand-gold/40'}`}>
                                            <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={e => setPayment(e.target.value)} className="accent-brand-gold" />
                                            <span className="text-white text-sm">{m.label}</span>
                                        </label>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 mt-4 text-brand-silver/40 text-xs">
                                    <Lock className="w-3.5 h-3.5" /> Secured by Razorpay · 256-bit SSL encryption
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button onClick={() => setStep(1)} className="btn-outline-gold">← Back</button>
                                    <button onClick={() => setStep(3)} className="btn-gold">Review Order →</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3 — Review */}
                        {step === 3 && (
                            <div className="bg-[#1E0A10] border border-brand-gold/20 rounded-sm p-6">
                                <h2 className="font-display text-xl font-bold text-brand-gold mb-5">Review & Place Order</h2>
                                <div className="space-y-3 mb-6">
                                    {items.map(item => (
                                        <div key={item.productId} className="flex gap-3">
                                            <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-semibold line-clamp-1">{item.name}</p>
                                                <p className="text-brand-silver/40 text-xs">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-brand-gold font-bold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-brand-maroon-300 rounded p-4 text-sm text-brand-silver/70 mb-6">
                                    <p className="font-semibold text-white mb-1">Delivering to:</p>
                                    <p>{address.name} · {address.phone}</p>
                                    <p>{address.line1}{address.line2 ? ', ' + address.line2 : ''}</p>
                                    <p>{address.city}, {address.state} — {address.pin}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="btn-outline-gold">← Back</button>
                                    <button onClick={placeOrder} disabled={placing} className="btn-gold flex-1">
                                        {placing ? 'Placing Order...' : `Pay ${formatCurrency(total)} →`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div className="bg-[#1E0A10] border border-brand-gold/20 rounded-sm p-6 h-fit sticky top-28">
                        <h3 className="font-display font-bold text-brand-gold text-lg mb-4">Price Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-brand-silver/70"><span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span><span>{formatCurrency(subtotal)}</span></div>
                            {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>−{formatCurrency(discount)}</span></div>}
                            <div className="flex justify-between text-brand-silver/70"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-400">FREE</span> : formatCurrency(shipping)}</span></div>
                            <div className="h-px bg-brand-gold/20 my-2" />
                            <div className="flex justify-between font-bold text-white"><span>Total</span><span className="text-brand-gold">{formatCurrency(total)}</span></div>
                        </div>
                        <div className="flex items-center gap-2 mt-5 text-brand-silver/40 text-xs">
                            <Shield className="w-3.5 h-3.5 text-brand-gold/50" /> Safe & Secure Payments
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
