'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
    X,
    Package,
    Truck,
    ShieldCheck,
    CreditCard,
    Printer,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
} from 'lucide-react'
import { AdminOrder, OrderStatus, PaymentStatus, useAdminOrderStore } from '@/store/adminOrderStore'
import { formatCurrency } from '@/lib/utils'
import InspectableImage from './InspectableImage'
import toast from 'react-hot-toast'

interface OrderDetailModalProps {
    isOpen: boolean
    onClose: () => void
    order: AdminOrder | null
}

export default function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
    const updateOrderStatus = useAdminOrderStore((s) => s.updateOrderStatus)
    const updatePaymentStatus = useAdminOrderStore((s) => s.updatePaymentStatus)

    const [status, setStatus] = useState<OrderStatus>('Pending')
    const [trackingNumber, setTrackingNumber] = useState('')
    const [courierPartner, setCourierPartner] = useState<AdminOrder['courierPartner']>('BlueDart Apex')

    React.useEffect(() => {
        if (order) {
            setStatus(order.orderStatus)
            setTrackingNumber(order.trackingNumber || '')
            setCourierPartner(order.courierPartner || 'BlueDart Apex')
        }
    }, [order])

    if (!isOpen || !order) return null

    const handleSaveStatus = () => {
        updateOrderStatus(order.id, status, trackingNumber, courierPartner)
        toast.success(`Order #${order.orderNumber} updated to ${status}`)
        onClose()
    }

    const handlePrintInvoice = () => {
        window.print()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#14050D] border border-brand-gold/30 rounded-lg shadow-2xl flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gold/20 bg-[#1A0711]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                            <Package className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-white font-display text-lg font-bold">
                                    Order #{order.orderNumber}
                                </h2>
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                        order.orderStatus === 'Delivered'
                                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                            : order.orderStatus === 'Dispatched'
                                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                            : order.orderStatus === 'Processing'
                                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                            : 'bg-neutral-500/20 text-neutral-300 border-neutral-500/30'
                                    }`}
                                >
                                    {order.orderStatus}
                                </span>
                            </div>
                            <p className="text-xs text-brand-silver/60 flex items-center gap-2 mt-0.5">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrintInvoice}
                            className="p-2 text-brand-silver/70 hover:text-brand-gold hover:bg-brand-gold/10 rounded transition"
                            title="Print Tax Invoice"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-brand-silver/60 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Customer & Shipping Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Patron Information */}
                        <div className="p-4 rounded-lg bg-black/40 border border-brand-gold/15 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-brand-gold/80 tracking-wider block">
                                Patron & Recipient
                            </span>
                            <div className="text-white font-semibold text-sm">{order.customerName}</div>
                            <div className="text-xs text-brand-silver/70 flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-brand-gold/60" />
                                <span>{order.customerEmail}</span>
                            </div>
                            <div className="text-xs text-brand-silver/70 flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-brand-gold/60" />
                                <span>{order.customerPhone}</span>
                            </div>
                        </div>

                        {/* Shipping Destination */}
                        <div className="p-4 rounded-lg bg-black/40 border border-brand-gold/15 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-brand-gold/80 tracking-wider block">
                                Insured Delivery Address
                            </span>
                            <div className="text-xs text-white flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-brand-gold/80 shrink-0 mt-0.5" />
                                <div>
                                    <p>{order.shippingAddress.line1}</p>
                                    <p>
                                        {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                                    </p>
                                </div>
                            </div>
                            {order.trackingNumber && (
                                <div className="text-xs text-brand-silver/80 pt-1 font-mono">
                                    Courier: <strong className="text-white">{order.courierPartner}</strong> | AWB: <strong className="text-brand-gold">{order.trackingNumber}</strong>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Line Items */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs uppercase font-bold text-brand-gold tracking-widest">
                                Ordered Jewels ({order.items.length} items)
                            </span>
                            <span className="text-[11px] text-brand-gold/60">
                                Tip: Click any jewel image to inspect craftsmanship & specs
                            </span>
                        </div>

                        <div className="border border-brand-gold/20 rounded-lg overflow-hidden divide-y divide-brand-gold/10">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="p-3.5 flex items-center gap-4 bg-black/30 hover:bg-black/50 transition">
                                    {/* Clickable Image */}
                                    <div className="w-14 h-14 shrink-0 rounded-md overflow-hidden border border-brand-gold/30">
                                        <InspectableImage
                                            src={item.productImage}
                                            alt={item.productName}
                                            fill
                                            className="w-full h-full"
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white text-xs font-bold truncate">
                                            {item.productName}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-brand-silver/70">
                                            <span className="px-1.5 py-0.5 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                                                {item.purity}
                                            </span>
                                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                            {item.weightGrams && <span>Weight: {item.weightGrams}g</span>}
                                        </div>
                                    </div>

                                    {/* Price & Quantity */}
                                    <div className="text-right shrink-0">
                                        <div className="text-xs text-brand-silver/60">
                                            Qty: <strong className="text-white">{item.quantity}</strong> × {formatCurrency(item.unitPrice)}
                                        </div>
                                        <div className="text-sm font-bold text-brand-gold font-sans mt-0.5">
                                            {formatCurrency(item.unitPrice * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Payment & Security */}
                        <div className="p-4 rounded-lg bg-black/40 border border-brand-gold/15 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-brand-gold/80 tracking-wider block">
                                Payment Details
                            </span>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-brand-silver/70">Method</span>
                                <span className="text-white font-medium">{order.paymentMethod}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-brand-silver/70">Payment Status</span>
                                <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            {order.paymentId && (
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-brand-silver/70">Transaction ID</span>
                                    <span className="text-brand-gold/90">{order.paymentId}</span>
                                </div>
                            )}
                        </div>

                        {/* Invoice Calculation */}
                        <div className="p-4 rounded-lg bg-black/40 border border-brand-gold/15 space-y-1.5 text-xs">
                            <div className="flex justify-between text-brand-silver/70">
                                <span>Subtotal</span>
                                <span className="text-white">{formatCurrency(order.subtotal)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-400">
                                    <span>Discount ({order.couponCode || 'Promo'})</span>
                                    <span>-{formatCurrency(order.discountAmount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-brand-silver/70">
                                <span>GST (3% Jewellery Rate)</span>
                                <span className="text-white">{formatCurrency(order.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between text-brand-silver/70">
                                <span>Insured Express Courier</span>
                                <span className="text-emerald-400">COMPLIMENTARY</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-brand-gold border-t border-brand-gold/20 pt-2 mt-1">
                                <span>Total Amount</span>
                                <span className="text-gold-gradient">{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Manage Order Pipeline (Status, Tracking) */}
                    <div className="p-4 rounded-lg bg-[#220713]/80 border border-brand-gold/30 space-y-3">
                        <span className="text-xs uppercase font-bold text-brand-gold tracking-widest block">
                            Fulfillment & Pipeline Action
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[11px] text-brand-silver/80 mb-1">
                                    Dispatch Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                                    className="w-full bg-black/50 border border-brand-gold/30 rounded px-2.5 py-1.5 text-xs text-white focus:border-brand-gold outline-none"
                                >
                                    <option value="Pending" className="bg-[#1C060F]">Pending</option>
                                    <option value="Processing" className="bg-[#1C060F]">Processing</option>
                                    <option value="Dispatched" className="bg-[#1C060F]">Dispatched</option>
                                    <option value="Delivered" className="bg-[#1C060F]">Delivered</option>
                                    <option value="Cancelled" className="bg-[#1C060F]">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] text-brand-silver/80 mb-1">
                                    Courier Partner
                                </label>
                                <select
                                    value={courierPartner}
                                    onChange={(e) => setCourierPartner(e.target.value as AdminOrder['courierPartner'])}
                                    className="w-full bg-black/50 border border-brand-gold/30 rounded px-2.5 py-1.5 text-xs text-white focus:border-brand-gold outline-none"
                                >
                                    <option value="BlueDart Apex" className="bg-[#1C060F]">BlueDart Apex</option>
                                    <option value="BVC Logistics Secure" className="bg-[#1C060F]">BVC Logistics Secure</option>
                                    <option value="Sequel 24 Safe" className="bg-[#1C060F]">Sequel 24 Safe</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] text-brand-silver/80 mb-1">
                                    Airway Bill / Tracking No.
                                </label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="e.g. BD-EXP-992817"
                                    className="w-full bg-black/50 border border-brand-gold/30 rounded px-2.5 py-1.5 text-xs text-white focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleSaveStatus}
                                className="btn-gold py-2 px-5 text-xs uppercase font-bold tracking-wider"
                            >
                                Update Order Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
