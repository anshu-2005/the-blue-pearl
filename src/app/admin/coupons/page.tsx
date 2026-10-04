'use client'

import React, { useState } from 'react'
import {
    Tag,
    Plus,
    Trash2,
    Check,
    X,
    Calendar,
    Coins,
    Sparkles,
    Copy,
    Percent,
} from 'lucide-react'
import { useAdminCouponStore, AdminCoupon } from '@/store/adminCouponStore'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminCouponsPage() {
    const coupons = useAdminCouponStore((s) => s.coupons)
    const addCoupon = useAdminCouponStore((s) => s.addCoupon)
    const toggleCoupon = useAdminCouponStore((s) => s.toggleCoupon)
    const deleteCoupon = useAdminCouponStore((s) => s.deleteCoupon)

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [code, setCode] = useState('')
    const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage')
    const [discountValue, setDiscountValue] = useState<number>(10)
    const [minOrderValue, setMinOrderValue] = useState<number>(2999)
    const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(1500)
    const [validUntil, setValidUntil] = useState('2026-12-31')
    const [usageLimit, setUsageLimit] = useState<number>(500)
    const [description, setDescription] = useState('')

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!code.trim()) {
            toast.error('Coupon code is required')
            return
        }

        const newCoupon: AdminCoupon = {
            id: `cp-${Date.now()}`,
            code: code.trim().toUpperCase(),
            discountType,
            discountValue: Number(discountValue),
            minOrderValue: Number(minOrderValue),
            maxDiscountAmount: discountType === 'percentage' ? Number(maxDiscountAmount) : undefined,
            validUntil,
            active: true,
            usedCount: 0,
            usageLimit: Number(usageLimit),
            description: description || `${discountValue}% off on order above ₹${minOrderValue}`,
        }

        addCoupon(newCoupon)
        toast.success(`Coupon "${newCoupon.code}" created!`)
        setIsAddModalOpen(false)
        setCode('')
        setDescription('')
    }

    const copyCode = (c: string) => {
        navigator.clipboard.writeText(c)
        toast.success(`Code ${c} copied to clipboard!`)
    }

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/15 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-semibold mb-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Privilege Offers & Festive Promotions</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                        Coupons & Promotional Discounts
                    </h1>
                    <p className="text-xs text-brand-silver/70 mt-1">
                        Configure privilege codes, bridal festival allowances, and patron loyalty discounts.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-gold py-2.5 px-5 text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Promo Code</span>
                </button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                    <div
                        key={coupon.id}
                        className={`p-5 rounded-lg border transition shadow-lg flex flex-col justify-between space-y-4 ${
                            coupon.active
                                ? 'bg-[#14050D] border-brand-gold/30 hover:border-brand-gold'
                                : 'bg-[#10030A] border-neutral-800 opacity-60'
                        }`}
                    >
                        <div className="space-y-2">
                            {/* Code Badge & Active Switch */}
                            <div className="flex items-center justify-between">
                                <div
                                    onClick={() => copyCode(coupon.code)}
                                    className="flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-brand-gold/40 text-brand-gold font-mono font-bold text-sm tracking-wider cursor-pointer hover:border-brand-gold group transition"
                                    title="Click to copy coupon code"
                                >
                                    <span>{coupon.code}</span>
                                    <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                            coupon.active
                                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                                : 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30'
                                        }`}
                                    >
                                        {coupon.active ? 'Active' : 'Disabled'}
                                    </span>

                                    <button
                                        onClick={() => toggleCoupon(coupon.id)}
                                        className={`text-xs px-2 py-0.5 rounded font-semibold transition ${
                                            coupon.active
                                                ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20'
                                                : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                        }`}
                                    >
                                        {coupon.active ? 'Pause' : 'Activate'}
                                    </button>
                                </div>
                            </div>

                            <p className="text-xs text-white font-medium">{coupon.description}</p>
                        </div>

                        {/* Rules Grid */}
                        <div className="grid grid-cols-3 gap-2 text-xs bg-black/40 p-3 rounded-lg border border-brand-gold/15">
                            <div>
                                <span className="text-brand-silver/50 block text-[10px] uppercase">Discount</span>
                                <span className="font-bold text-brand-gold">
                                    {coupon.discountType === 'percentage'
                                        ? `${coupon.discountValue}% OFF`
                                        : `₹${coupon.discountValue} FLAT`}
                                </span>
                            </div>
                            <div>
                                <span className="text-brand-silver/50 block text-[10px] uppercase">Min Order</span>
                                <span className="font-bold text-white">
                                    {formatCurrency(coupon.minOrderValue)}
                                </span>
                            </div>
                            <div>
                                <span className="text-brand-silver/50 block text-[10px] uppercase">Used / Limit</span>
                                <span className="font-bold text-white font-mono">
                                    {coupon.usedCount} / {coupon.usageLimit}
                                </span>
                            </div>
                        </div>

                        {/* Footer Expiry & Delete */}
                        <div className="flex items-center justify-between text-[11px] text-brand-silver/60 pt-2 border-t border-brand-gold/15">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-brand-gold/60" />
                                <span>Valid until: {coupon.validUntil}</span>
                            </span>

                            <button
                                onClick={() => {
                                    if (confirm(`Delete coupon "${coupon.code}"?`)) {
                                        deleteCoupon(coupon.id)
                                        toast.success('Coupon removed')
                                    }
                                }}
                                className="p-1 text-brand-silver/40 hover:text-rose-400 transition"
                                title="Delete Coupon"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal: Create Coupon */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
                    <div className="relative w-full max-w-lg bg-[#14050D] border border-brand-gold/30 rounded-lg shadow-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
                            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                                <Tag className="w-4 h-4 text-brand-gold" />
                                <span>Create Promotional Coupon</span>
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-brand-silver/60 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-brand-silver/80 mb-1">Coupon Code *</label>
                                <input
                                    type="text"
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="e.g. DIWALI2026"
                                    className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white font-mono uppercase outline-none focus:border-brand-gold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-brand-silver/80 mb-1">Discount Type</label>
                                    <select
                                        value={discountType}
                                        onChange={(e) => setDiscountType(e.target.value as any)}
                                        className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold"
                                    >
                                        <option value="percentage" className="bg-[#1C060F]">Percentage (%)</option>
                                        <option value="flat" className="bg-[#1C060F]">Flat Amount (₹)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-brand-silver/80 mb-1">
                                        {discountType === 'percentage' ? 'Percentage Off (%)' : 'Flat Off (₹)'} *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                                        className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-brand-silver/80 mb-1">Minimum Order Value (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={minOrderValue}
                                        onChange={(e) => setMinOrderValue(Number(e.target.value))}
                                        className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block text-brand-silver/80 mb-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={validUntil}
                                        onChange={(e) => setValidUntil(e.target.value)}
                                        className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-brand-silver/80 mb-1">Offer Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g. Exclusive 15% festive offer on Temple jewellery sets."
                                    className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-brand-gold/15">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 rounded border border-brand-gold/30 text-brand-silver hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-gold py-2 px-5 text-xs font-bold uppercase tracking-wider"
                                >
                                    Save Coupon
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
