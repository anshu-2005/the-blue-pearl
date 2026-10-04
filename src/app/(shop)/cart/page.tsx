'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Gift, Sparkles, ShieldCheck, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function CartPage() {
    const items = useCartStore(s => s.items)
    const removeItem = useCartStore(s => s.removeItem)
    const updateQty = useCartStore(s => s.updateQty)
    const subtotal = useCartStore(s => s.subtotal())
    const shippingFee = useCartStore(s => s.shippingFee())
    const discount = useCartStore(s => s.discount)
    const couponCode = useCartStore(s => s.couponCode)
    const applyCoupon = useCartStore(s => s.applyCoupon)
    const removeCoupon = useCartStore(s => s.removeCoupon)

    const [couponInput, setCouponInput] = useState('')
    const [couponLoading, setCouponLoading] = useState(false)
    const [giftWrap, setGiftWrap] = useState(false)
    const [giftMessage, setGiftMessage] = useState('')

    const giftWrapCost = giftWrap ? 149 : 0
    const finalTotal = Math.max(0, subtotal - discount + shippingFee + giftWrapCost)

    const handleCoupon = async () => {
        if (!couponInput.trim()) return
        setCouponLoading(true)
        await new Promise(r => setTimeout(r, 400))
        const code = couponInput.trim().toUpperCase()

        if (code === 'WELCOME10' || code === 'ROYAL10') {
            const disc = Math.round(subtotal * 0.10)
            applyCoupon(code, disc)
            toast.success(`Coupon ${code} applied! Saved ${formatCurrency(disc)}`)
        } else if (code === 'FESTIVE15') {
            const disc = Math.round(subtotal * 0.15)
            applyCoupon('FESTIVE15', disc)
            toast.success(`Festive 15% discount applied! Saved ${formatCurrency(disc)}`)
        } else if (code === 'BRIDAL500') {
            const disc = Math.min(500, subtotal)
            applyCoupon('BRIDAL500', disc)
            toast.success('₹500 Bridal discount applied!')
        } else {
            toast.error('Invalid coupon code. Try ROYAL10 or FESTIVE15')
        }
        setCouponLoading(false)
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[75vh] bg-brand-black flex flex-col items-center justify-center text-center px-4 py-20">
                <div className="w-20 h-20 rounded-full bg-brand-maroon-300/40 border border-brand-gold/20 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-brand-gold/40" />
                </div>
                <h1 className="font-display text-3xl font-bold text-white mb-2">Your Shopping Bag is Empty</h1>
                <p className="text-brand-silver/50 mb-8 max-w-sm text-sm">
                    Discover our royal collection of handcrafted jewellery and add your favourite pieces.
                </p>
                <Link href="/shop" className="btn-gold px-8 py-3.5 text-xs font-bold uppercase tracking-widest">
                    Explore Master Collection
                </Link>
            </div>
        )
    }

    const freeShippingThreshold = 2999
    const amountNeededForFreeShip = Math.max(0, freeShippingThreshold - subtotal)
    const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

    return (
        <div className="min-h-screen bg-brand-black py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Free Shipping Progress Meter */}
                <div className="bg-[#1C0810] border border-brand-gold/25 rounded-sm p-4 mb-8">
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-white font-semibold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                            {amountNeededForFreeShip === 0
                                ? '🎉 You have unlocked Free Insured Express Delivery across India!'
                                : `Add ${formatCurrency(amountNeededForFreeShip)} more to unlock Free Insured Shipping`}
                        </span>
                        <span className="font-mono text-brand-gold font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-brand-maroon rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-brand-gold-300 to-brand-gold transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-gold/20">
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient">
                        Shopping Bag ({items.length} {items.length === 1 ? 'item' : 'items'})
                    </h1>
                    <Link href="/shop" className="text-brand-gold/70 hover:text-brand-gold text-xs underline">
                        + Add more jewellery
                    </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart items list */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {items.map(item => (
                                <motion.div
                                    key={item.productId}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex gap-4 bg-[#1E0A10] border border-brand-gold/15 rounded-sm p-4 hover:border-brand-gold/30 transition-all"
                                >
                                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xs overflow-hidden bg-brand-maroon-400 border border-brand-gold/20">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <Link
                                                href={`/product/${item.slug}`}
                                                className="font-display font-semibold text-white text-sm hover:text-brand-gold transition-colors line-clamp-2 leading-snug"
                                            >
                                                {item.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-brand-gold font-bold text-sm">
                                                    {formatCurrency(item.price)}
                                                </span>
                                                {item.mrp > item.price && (
                                                    <span className="text-brand-silver/40 text-xs line-through">
                                                        {formatCurrency(item.mrp)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-gold/10">
                                            <div className="flex items-center border border-brand-gold/30 rounded-xs bg-[#14040A]">
                                                <button
                                                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="px-2.5 py-1 text-brand-gold hover:bg-brand-maroon-300 disabled:opacity-30"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-3 text-xs text-white font-mono font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                                                    className="px-2.5 py-1 text-brand-gold hover:bg-brand-maroon-300"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="text-white font-bold font-mono text-sm">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        removeItem(item.productId)
                                                        toast('Item removed', { icon: '🗑️' })
                                                    }}
                                                    className="text-brand-silver/40 hover:text-red-400 p-1"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Gift Packaging Option */}
                        <div className="bg-[#1E0A10] border border-brand-gold/15 rounded-sm p-5 space-y-3">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={giftWrap}
                                    onChange={e => setGiftWrap(e.target.checked)}
                                    className="mt-0.5 accent-brand-gold w-4 h-4 cursor-pointer"
                                />
                                <div>
                                    <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                                        <Gift className="w-4 h-4 text-brand-gold" />
                                        <span>Add Royal Velvet Gift Packaging (+₹149)</span>
                                    </span>
                                    <p className="text-brand-silver/50 text-[11px] mt-0.5">
                                        Includes luxury gold-embossed presentation box, satin ribbon, and personalized message card.
                                    </p>
                                </div>
                            </label>

                            {giftWrap && (
                                <div className="pt-2 pl-7">
                                    <input
                                        type="text"
                                        maxLength={100}
                                        value={giftMessage}
                                        onChange={e => setGiftMessage(e.target.value)}
                                        placeholder="Write your personalized gift message here..."
                                        className="input-gold text-xs w-full py-2 placeholder:text-brand-silver/30"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Coupon Code Section */}
                        <div className="bg-[#1E0A10] border border-brand-gold/15 rounded-sm p-5">
                            <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Tag className="w-4 h-4" /> Apply Promotional Coupon
                            </p>
                            {couponCode ? (
                                <div className="flex items-center justify-between bg-brand-gold/10 border border-brand-gold/30 px-4 py-2.5 rounded-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-brand-gold font-bold text-xs">{couponCode}</span>
                                        <span className="text-emerald-400 text-xs font-semibold">
                                            (Saved {formatCurrency(discount)})
                                        </span>
                                    </div>
                                    <button
                                        onClick={removeCoupon}
                                        className="text-red-400 text-xs font-medium hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex gap-2">
                                        <input
                                            value={couponInput}
                                            onChange={e => setCouponInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                                            placeholder="Enter coupon code (e.g. ROYAL10)"
                                            className="input-gold flex-1 text-xs py-2 font-mono uppercase"
                                        />
                                        <button
                                            onClick={handleCoupon}
                                            disabled={couponLoading}
                                            className="btn-gold py-2 px-5 text-xs font-bold uppercase tracking-wider"
                                        >
                                            {couponLoading ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                    <div className="flex gap-2 mt-2 text-[10px] text-brand-silver/50">
                                        <span>Popular codes:</span>
                                        <button onClick={() => setCouponInput('ROYAL10')} className="text-brand-gold underline font-mono">ROYAL10</button>
                                        <span>·</span>
                                        <button onClick={() => setCouponInput('FESTIVE15')} className="text-brand-gold underline font-mono">FESTIVE15</button>
                                        <span>·</span>
                                        <button onClick={() => setCouponInput('BRIDAL500')} className="text-brand-gold underline font-mono">BRIDAL500</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1E0A10] border border-brand-gold/25 rounded-sm p-6 sticky top-28 space-y-4">
                            <h2 className="font-display font-bold text-white text-lg pb-3 border-b border-brand-gold/20">
                                Order Summary
                            </h2>

                            <div className="space-y-2.5 text-xs text-brand-silver/80">
                                <div className="flex justify-between">
                                    <span>Items Subtotal</span>
                                    <span className="text-white font-mono">{formatCurrency(subtotal)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Coupon Discount ({couponCode})</span>
                                        <span className="font-mono">−{formatCurrency(discount)}</span>
                                    </div>
                                )}

                                {giftWrap && (
                                    <div className="flex justify-between text-brand-gold">
                                        <span>Royal Velvet Packaging</span>
                                        <span className="font-mono">+{formatCurrency(giftWrapCost)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Insured Shipping</span>
                                    <span>
                                        {shippingFee === 0 ? (
                                            <span className="text-emerald-400 font-semibold">FREE</span>
                                        ) : (
                                            formatCurrency(shippingFee)
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-[11px] text-brand-silver/50">
                                    <span>Estimated GST (3% on Gold)</span>
                                    <span>Included</span>
                                </div>

                                <div className="h-px bg-brand-gold/20 my-2" />

                                <div className="flex justify-between font-bold text-white text-base">
                                    <span>Total Payable</span>
                                    <span className="text-brand-gold text-xl font-display">
                                        {formatCurrency(finalTotal)}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="btn-gold w-full py-3.5 mt-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                            >
                                Proceed to Checkout <ArrowRight className="w-4 h-4" />
                            </Link>

                            <div className="pt-3 border-t border-brand-gold/10 space-y-2 text-[11px] text-brand-silver/60">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-brand-gold" />
                                    <span>100% Certified BIS Hallmark / Assayed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-brand-gold" />
                                    <span>7-Day Insured Return Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
