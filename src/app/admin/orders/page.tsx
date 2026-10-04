'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import {
    ShoppingBag,
    Search,
    Filter,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    Eye,
    ChevronDown,
    MapPin,
    CreditCard,
    Printer,
    Download,
    ExternalLink,
    Sparkles,
} from 'lucide-react'
import { useAdminOrderStore, AdminOrder, OrderStatus } from '@/store/adminOrderStore'
import { useAdminImageModal } from '@/components/admin/AdminImageModalContext'
import InspectableImage from '@/components/admin/InspectableImage'
import OrderDetailModal from '@/components/admin/OrderDetailModal'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_TABS: { label: string; value: 'All' | OrderStatus }[] = [
    { label: 'All Orders', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Dispatched', value: 'Dispatched' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
]

export default function AdminOrdersPage() {
    const orders = useAdminOrderStore((s) => s.orders)
    const updateOrderStatus = useAdminOrderStore((s) => s.updateOrderStatus)

    const [activeTab, setActiveTab] = useState<'All' | OrderStatus>('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    // Filter orders
    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            if (activeTab !== 'All' && o.orderStatus !== activeTab) {
                return false
            }
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchNumber = o.orderNumber.toLowerCase().includes(q)
                const matchCustomer = o.customerName.toLowerCase().includes(q)
                const matchCity = o.shippingAddress.city.toLowerCase().includes(q)
                const matchPhone = o.customerPhone.includes(q)
                if (!matchNumber && !matchCustomer && !matchCity && !matchPhone) return false
            }
            return true
        })
    }, [orders, activeTab, searchQuery])

    const handleOpenDetail = (order: AdminOrder) => {
        setSelectedOrder(order)
        setIsDetailModalOpen(true)
    }

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/15 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Fulfillment & Dispatch Pipeline</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                        Patron Orders & Insured Shipments
                    </h1>
                    <p className="text-xs text-brand-silver/70 mt-1">
                        Manage high-value jewellery orders, payment verifications and armoed courier dispatch.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 font-semibold font-mono">
                        {orders.length} Total Orders
                    </span>
                </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="p-4 rounded-lg bg-[#16050E] border border-brand-gold/20 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                        {STATUS_TABS.map((tab) => {
                            const count =
                                tab.value === 'All'
                                    ? orders.length
                                    : orders.filter((o) => o.orderStatus === tab.value).length
                            return (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition ${
                                        activeTab === tab.value
                                            ? 'bg-brand-gold text-brand-maroon font-bold shadow-gold'
                                            : 'bg-black/40 text-brand-silver/80 hover:text-white hover:bg-brand-gold/10'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                            activeTab === tab.value ? 'bg-brand-maroon text-brand-gold' : 'bg-black/50 text-brand-silver/60'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Search Input */}
                <div className="relative">
                    <Search className="w-4 h-4 text-brand-gold/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Order ID, Patron name, city, phone..."
                        className="w-full bg-black/40 border border-brand-gold/25 focus:border-brand-gold rounded pl-9 pr-4 py-2 text-xs text-white placeholder-brand-silver/40 outline-none"
                    />
                </div>
            </div>

            {/* Instruction Tip */}
            <div className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-maroon/80 to-[#12040B] border border-brand-gold/30 flex items-center justify-between text-xs text-brand-gold">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                        <strong>Click line-item photos:</strong> You can click on any ordered item's photo below to inspect its craftsmanship and specifications!
                    </span>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-lg bg-[#14050D] border border-brand-gold/20 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-brand-gold/20 bg-[#1A0612] text-[10px] uppercase font-bold text-brand-gold/80 tracking-wider">
                                <th className="py-3 px-4">Order Ref</th>
                                <th className="py-3 px-4">Patron Details</th>
                                <th className="py-3 px-4">Ordered Pieces</th>
                                <th className="py-3 px-4">Total Amount</th>
                                <th className="py-3 px-4">Payment</th>
                                <th className="py-3 px-4">Dispatch Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-gold/10">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-brand-gold/5 transition">
                                    {/* Order Ref & Date */}
                                    <td className="py-3 px-4">
                                        <div className="font-mono font-bold text-brand-gold">
                                            #{order.orderNumber}
                                        </div>
                                        <div className="text-[10px] text-brand-silver/50 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </div>
                                    </td>

                                    {/* Patron Info */}
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-white text-xs">{order.customerName}</div>
                                        <div className="text-[11px] text-brand-silver/60">
                                            {order.shippingAddress.city}, {order.shippingAddress.state}
                                        </div>
                                        <div className="text-[10px] text-brand-gold/70">{order.customerPhone}</div>
                                    </td>

                                    {/* Ordered Line Items (Inspectable Thumbnails) */}
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            {order.items.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-10 h-10 rounded border border-brand-gold/30 overflow-hidden shrink-0 bg-black/40"
                                                    title={`${item.productName} (Click to inspect)`}
                                                >
                                                    <InspectableImage
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        fill
                                                        showBadge={false}
                                                    />
                                                </div>
                                            ))}
                                            <div className="ml-1 text-[11px] text-brand-silver/70">
                                                {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                                            </div>
                                        </div>
                                    </td>

                                    {/* Total Amount */}
                                    <td className="py-3 px-4 font-sans font-bold text-white text-sm">
                                        {formatCurrency(order.totalAmount)}
                                    </td>

                                    {/* Payment Status */}
                                    <td className="py-3 px-4">
                                        <div
                                            className={`text-[11px] font-semibold flex items-center gap-1.5 ${
                                                order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    order.paymentStatus === 'Paid' ? 'bg-emerald-400' : 'bg-amber-400'
                                                }`}
                                            />
                                            <span>{order.paymentStatus}</span>
                                        </div>
                                        <span className="text-[10px] text-brand-silver/50 block">
                                            {order.paymentMethod}
                                        </span>
                                    </td>

                                    {/* Dispatch Status & Quick Changer */}
                                    <td className="py-3 px-4">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => {
                                                const next = e.target.value as OrderStatus
                                                updateOrderStatus(order.id, next)
                                                toast.success(`Order #${order.orderNumber} updated to ${next}`)
                                            }}
                                            className="bg-black/50 border border-brand-gold/30 rounded px-2 py-1 text-xs text-white focus:border-brand-gold outline-none"
                                        >
                                            <option value="Pending" className="bg-[#1C060F]">Pending</option>
                                            <option value="Processing" className="bg-[#1C060F]">Processing</option>
                                            <option value="Dispatched" className="bg-[#1C060F]">Dispatched</option>
                                            <option value="Delivered" className="bg-[#1C060F]">Delivered</option>
                                            <option value="Cancelled" className="bg-[#1C060F]">Cancelled</option>
                                        </select>
                                        {order.trackingNumber && (
                                            <div className="text-[10px] font-mono text-brand-silver/50 mt-1 truncate max-w-[140px]">
                                                AWB: {order.trackingNumber}
                                            </div>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => handleOpenDetail(order)}
                                            className="py-1.5 px-3 rounded border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:bg-brand-gold/10 text-xs font-semibold transition"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-brand-silver/50">
                                        No orders found matching the filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            <OrderDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    )
}
