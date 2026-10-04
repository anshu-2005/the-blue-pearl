'use client'

import { use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Package, Truck, CheckCircle2, ShieldCheck, Download, Clock } from 'lucide-react'
import { ALL_PRODUCTS } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    // Demo realistic order summary
    const sampleProducts = [ALL_PRODUCTS[0], ALL_PRODUCTS[6]]
    const orderDate = 'October 02, 2026'
    const total = sampleProducts.reduce((acc, p) => acc + p.salePrice, 0)

    return (
        <div className="min-h-screen bg-brand-black py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/account/orders"
                    className="inline-flex items-center gap-2 text-brand-gold/70 hover:text-brand-gold text-xs uppercase tracking-wider mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Link>

                {/* Header Card */}
                <div className="bg-[#1E0A10] border border-brand-gold/20 rounded-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-gold/15">
                        <div>
                            <span className="text-brand-gold/50 text-xs tracking-widest uppercase block mb-1">Order Details</span>
                            <h1 className="font-mono text-xl md:text-2xl font-bold text-white">{id}</h1>
                            <p className="text-brand-silver/50 text-xs mt-1">Placed on {orderDate} · Payment via Razorpay (Prepaid)</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Order Confirmed
                            </span>
                            <Link
                                href={`/track-order?orderId=${id}`}
                                className="btn-gold text-xs py-2 px-3.5 flex items-center gap-1.5"
                            >
                                <Truck className="w-3.5 h-3.5" /> Track Live
                            </Link>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="pt-6">
                        <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-4">Delivery Status</p>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {[
                                { title: 'Order Placed', time: 'Oct 02, 11:30 AM', done: true },
                                { title: 'Crafting & QA', time: 'Oct 02, 04:15 PM', done: true },
                                { title: 'Shipped (Bluedart)', time: 'Expected Today', done: true },
                                { title: 'Delivery', time: 'By Oct 06, 2026', done: false },
                            ].map((step, idx) => (
                                <div key={step.title} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        step.done ? 'bg-brand-gold text-brand-maroon' : 'bg-white/10 text-white/40'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold ${step.done ? 'text-white' : 'text-brand-silver/40'}`}>
                                            {step.title}
                                        </p>
                                        <p className="text-[11px] text-brand-silver/50">{step.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Items and Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Items List */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-[#1E0A10] border border-brand-gold/15 rounded-sm p-6">
                            <h2 className="font-display text-base font-semibold text-brand-gold mb-4">Items in this Package</h2>
                            <div className="space-y-4 divide-y divide-brand-gold/10">
                                {sampleProducts.map(p => (
                                    <div key={p.id} className="pt-4 first:pt-0 flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded overflow-hidden bg-brand-maroon-400 flex-shrink-0 border border-brand-gold/20">
                                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/product/${p.slug}`} className="text-white hover:text-brand-gold text-sm font-display font-medium line-clamp-1 transition-colors">
                                                {p.name}
                                            </Link>
                                            <p className="text-brand-silver/40 text-xs mt-0.5">{p.material} · 1 Unit</p>
                                            <p className="text-brand-gold font-semibold text-xs mt-1">{formatCurrency(p.salePrice)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="bg-[#1E0A10] border border-brand-gold/15 rounded-sm p-6 h-fit space-y-4">
                        <h2 className="font-display text-base font-semibold text-brand-gold">Payment Summary</h2>
                        <div className="space-y-2 text-xs text-brand-silver/70">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-white">{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Insured Shipping</span>
                                <span className="text-green-400">FREE</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST (3% Jewellery)</span>
                                <span className="text-white">Included</span>
                            </div>
                            <div className="border-t border-brand-gold/15 pt-2 flex justify-between font-bold text-sm text-brand-gold">
                                <span>Total Paid</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-brand-gold/10 flex items-center gap-2 text-[11px] text-brand-silver/50">
                            <ShieldCheck className="w-4 h-4 text-brand-gold" />
                            <span>Hallmark & Authenticity Certified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
