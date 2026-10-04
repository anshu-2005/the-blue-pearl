'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    TrendingUp,
    ShoppingBag,
    Diamond,
    Users,
    ArrowUpRight,
    AlertTriangle,
    Coins,
    Sparkles,
    Eye,
    Plus,
    Clock,
    CheckCircle2,
    Truck,
    ArrowRight,
    Layers,
    Image as ImageIcon,
} from 'lucide-react'
import { useAdminProductStore } from '@/store/adminProductStore'
import { useAdminOrderStore, AdminOrder } from '@/store/adminOrderStore'
import { useAdminRatesStore } from '@/store/adminRatesStore'
import { useAdminCustomerStore } from '@/store/adminCustomerStore'
import { useAdminImageModal } from '@/components/admin/AdminImageModalContext'
import InspectableImage from '@/components/admin/InspectableImage'
import ProductEditModal from '@/components/admin/ProductEditModal'
import OrderDetailModal from '@/components/admin/OrderDetailModal'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
    const products = useAdminProductStore((s) => s.products)
    const orders = useAdminOrderStore((s) => s.orders)
    const rates = useAdminRatesStore((s) => s.rates)
    const customers = useAdminCustomerStore((s) => s.customers)
    const adjustStock = useAdminProductStore((s) => s.adjustStock)
    const { openImageModal } = useAdminImageModal()

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

    // Calculated metrics
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) + 4820000
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing')
    const lowStockItems = products.filter((p) => p.stock <= 5)
    const bestSellers = products.filter((p) => p.bestSeller || p.featured).slice(0, 6)

    const handleViewOrder = (order: AdminOrder) => {
        setSelectedOrder(order)
        setIsOrderModalOpen(true)
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Top Welcome & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/15 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Haute Horlogerie & Jewellery Atelier</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                        Executive Overview & Curatorial Desk
                    </h1>
                    <p className="text-xs text-brand-silver/70 mt-1">
                        Live inventory, bullion market benchmarks, patron orders & asset management.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                        href="/admin/media"
                        className="py-2.5 px-4 rounded border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:bg-brand-gold/10 text-xs uppercase font-bold tracking-wider flex items-center gap-2 transition"
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span>Media Gallery (50+)</span>
                    </Link>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn-gold py-2.5 px-5 text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Jewel</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="p-5 rounded-lg bg-[#18050F] border border-brand-gold/25 relative overflow-hidden group hover:border-brand-gold/60 transition shadow-lg">
                    <div className="flex items-center justify-between text-brand-silver/60 text-xs mb-2">
                        <span className="uppercase font-semibold tracking-wider">Gross Atelier Revenue</span>
                        <div className="w-8 h-8 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gold-gradient font-sans">
                        {formatCurrency(totalRevenue)}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>+18.4% vs last billing cycle</span>
                    </div>
                </div>

                {/* Completed & Active Orders */}
                <div className="p-5 rounded-lg bg-[#18050F] border border-brand-gold/25 relative overflow-hidden group hover:border-brand-gold/60 transition shadow-lg">
                    <div className="flex items-center justify-between text-brand-silver/60 text-xs mb-2">
                        <span className="uppercase font-semibold tracking-wider">Patron Orders</span>
                        <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400">
                            <ShoppingBag className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white font-sans">
                        1,284 <span className="text-xs font-normal text-brand-silver/60">orders</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400 mt-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{pendingOrders.length} orders awaiting dispatch</span>
                    </div>
                </div>

                {/* Active Jewellery Pieces */}
                <div className="p-5 rounded-lg bg-[#18050F] border border-brand-gold/25 relative overflow-hidden group hover:border-brand-gold/60 transition shadow-lg">
                    <div className="flex items-center justify-between text-brand-silver/60 text-xs mb-2">
                        <span className="uppercase font-semibold tracking-wider">Curated Masterworks</span>
                        <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center text-purple-400">
                            <Diamond className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white font-sans">
                        {products.length} <span className="text-xs font-normal text-brand-silver/60">designs</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-brand-gold mt-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Click any image to inspect specs</span>
                    </div>
                </div>

                {/* Registered Patrons */}
                <div className="p-5 rounded-lg bg-[#18050F] border border-brand-gold/25 relative overflow-hidden group hover:border-brand-gold/60 transition shadow-lg">
                    <div className="flex items-center justify-between text-brand-silver/60 text-xs mb-2">
                        <span className="uppercase font-semibold tracking-wider">Patron Directory</span>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-white font-sans">
                        942 <span className="text-xs font-normal text-brand-silver/60">VIP patrons</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>High retention & repeat orders</span>
                    </div>
                </div>
            </div>

            {/* Live MCX Bullion Rate Board */}
            <div className="p-5 rounded-lg bg-[#1E0613]/90 border border-brand-gold/30 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-gold/20 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h2 className="text-sm uppercase font-bold text-brand-gold tracking-widest flex items-center gap-2">
                            <Coins className="w-4 h-4" />
                            <span>Live MCX Bullion Rates & Hallmark Valuation Benchmark</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-brand-silver/60 font-mono">{rates.lastUpdated}</span>
                        <Link
                            href="/admin/settings"
                            className="text-xs font-bold text-brand-gold hover:underline"
                        >
                            Adjust Rates →
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-3 rounded bg-black/40 border border-brand-gold/15">
                        <span className="text-[10px] text-brand-silver/60 uppercase block">24K Pure Gold</span>
                        <span className="text-base font-bold text-white font-mono">₹{rates.gold24k}</span>
                        <span className="text-[9px] text-brand-silver/50 block">per gram</span>
                    </div>
                    <div className="p-3 rounded bg-black/40 border border-brand-gold/30 ring-1 ring-brand-gold/20">
                        <span className="text-[10px] text-brand-gold uppercase font-bold block">22K Hallmark 916</span>
                        <span className="text-base font-bold text-gold-gradient font-mono">₹{rates.gold22k}</span>
                        <span className="text-[9px] text-brand-gold/60 block">per gram (Primary)</span>
                    </div>
                    <div className="p-3 rounded bg-black/40 border border-brand-gold/15">
                        <span className="text-[10px] text-brand-silver/60 uppercase block">18K Luxury Gold</span>
                        <span className="text-base font-bold text-white font-mono">₹{rates.gold18k}</span>
                        <span className="text-[9px] text-brand-silver/50 block">per gram</span>
                    </div>
                    <div className="p-3 rounded bg-black/40 border border-brand-gold/15">
                        <span className="text-[10px] text-brand-silver/60 uppercase block">14K Rose/White</span>
                        <span className="text-base font-bold text-white font-mono">₹{rates.gold14k}</span>
                        <span className="text-[9px] text-brand-silver/50 block">per gram</span>
                    </div>
                    <div className="p-3 rounded bg-black/40 border border-brand-gold/15">
                        <span className="text-[10px] text-brand-silver/60 uppercase block">925 Sterling Silver</span>
                        <span className="text-base font-bold text-white font-mono">₹{rates.silver925}</span>
                        <span className="text-[9px] text-brand-silver/50 block">per gram</span>
                    </div>
                    <div className="p-3 rounded bg-black/40 border border-brand-gold/15">
                        <span className="text-[10px] text-brand-silver/60 uppercase block">Fine 999 Silver</span>
                        <span className="text-base font-bold text-white font-mono">₹{rates.silverFine}</span>
                        <span className="text-[9px] text-brand-silver/50 block">per gram</span>
                    </div>
                </div>
            </div>

            {/* Split Section: Featured Showcase (with Image Click) + Low Stock Alert */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 cols: Top Performing Pieces with Clickable Images */}
                <div className="lg:col-span-7 p-5 rounded-lg bg-[#14050D] border border-brand-gold/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
                        <div>
                            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-brand-gold" />
                                <span>Masterpieces & Signature Creations</span>
                            </h2>
                            <p className="text-xs text-brand-silver/60">
                                Click any photograph to inspect intricate carvings, metal purity and live melt value.
                            </p>
                        </div>
                        <Link
                            href="/admin/products"
                            className="text-xs font-semibold text-brand-gold hover:underline"
                        >
                            All Products ({products.length}) →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {bestSellers.map((item) => (
                            <div
                                key={item.id}
                                className="group relative rounded-lg border border-brand-gold/20 overflow-hidden bg-black/40 hover:border-brand-gold transition-all flex flex-col"
                            >
                                {/* Inspectable Image */}
                                <div className="relative aspect-square w-full">
                                    <InspectableImage
                                        src={item.image}
                                        alt={item.name}
                                        product={item}
                                        fill
                                        className="w-full h-full"
                                    />
                                    <span className="absolute top-2 left-2 z-20 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/70 text-brand-gold border border-brand-gold/30 backdrop-blur-sm pointer-events-none">
                                        {item.category}
                                    </span>
                                </div>

                                {/* Item Info */}
                                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                                    <div>
                                        <h4 className="text-xs font-bold text-white truncate group-hover:text-brand-gold transition">
                                            {item.name}
                                        </h4>
                                        <span className="text-[10px] text-brand-silver/60 block">
                                            {item.purity} • {item.weight}g
                                        </span>
                                    </div>

                                    <div className="flex items-baseline justify-between pt-1 border-t border-brand-gold/10">
                                        <span className="text-xs font-bold text-brand-gold font-sans">
                                            {formatCurrency(item.salePrice)}
                                        </span>
                                        <span
                                            className={`text-[10px] font-bold ${
                                                item.stock > 5 ? 'text-emerald-400' : 'text-amber-400'
                                            }`}
                                        >
                                            {item.stock} in stock
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right 5 cols: Low Stock & Restock Alert Panel */}
                <div className="lg:col-span-5 p-5 rounded-lg bg-[#14050D] border border-brand-gold/20 space-y-4 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
                            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-400" />
                                <span>Low Inventory Watchlist</span>
                            </h2>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                {lowStockItems.length} Urgent
                            </span>
                        </div>
                        <p className="text-xs text-brand-silver/60 mt-1">
                            Items with 5 or fewer pieces in vault. Click image to inspect or restock immediately.
                        </p>

                        <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
                            {lowStockItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-3 rounded-lg bg-black/40 border border-brand-gold/15 hover:border-brand-gold/40 flex items-center gap-3 transition"
                                >
                                    <div className="w-12 h-12 shrink-0 rounded overflow-hidden border border-brand-gold/30">
                                        <InspectableImage
                                            src={item.image}
                                            alt={item.name}
                                            product={item}
                                            fill
                                            className="w-full h-full"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                                        <p className="text-[10px] text-brand-silver/60">
                                            {item.purity} • {formatCurrency(item.salePrice)}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-xs font-bold text-rose-400 block mb-1">
                                            {item.stock} left
                                        </span>
                                        <button
                                            onClick={() => {
                                                adjustStock(item.id, 10)
                                                toast.success(`Restocked +10 units of ${item.name}`)
                                            }}
                                            className="px-2 py-1 rounded bg-brand-gold/15 hover:bg-brand-gold/30 text-brand-gold border border-brand-gold/30 text-[10px] font-bold uppercase transition"
                                        >
                                            +10 Restock
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {lowStockItems.length === 0 && (
                                <div className="p-6 text-center text-xs text-brand-silver/50">
                                    All jewellery pieces are well-stocked! No alerts at present.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-brand-gold/15">
                        <Link
                            href="/admin/products"
                            className="w-full py-2 px-3 rounded bg-black/50 border border-brand-gold/25 hover:border-brand-gold text-brand-gold text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition"
                        >
                            <span>Open Full Inventory Manager</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Patron Orders Table */}
            <div className="p-5 rounded-lg bg-[#14050D] border border-brand-gold/20 space-y-4">
                <div className="flex items-center justify-between border-b border-brand-gold/15 pb-3">
                    <div>
                        <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-brand-gold" />
                            <span>Recent Patron Orders</span>
                        </h2>
                        <p className="text-xs text-brand-silver/60">
                            Real-time order pipeline with courier tracking & invoice preview.
                        </p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="text-xs font-semibold text-brand-gold hover:underline"
                    >
                        View All Orders ({orders.length}) →
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-brand-gold/15 text-[10px] uppercase font-bold text-brand-gold/80 tracking-wider">
                                <th className="py-2.5 px-3">Order Number</th>
                                <th className="py-2.5 px-3">Patron & Destination</th>
                                <th className="py-2.5 px-3">Items Ordered</th>
                                <th className="py-2.5 px-3">Amount</th>
                                <th className="py-2.5 px-3">Status</th>
                                <th className="py-2.5 px-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-gold/10">
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="hover:bg-brand-gold/5 transition">
                                    <td className="py-3 px-3 font-mono font-bold text-brand-gold">
                                        #{order.orderNumber}
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="font-semibold text-white">{order.customerName}</div>
                                        <div className="text-[11px] text-brand-silver/60">
                                            {order.shippingAddress.city}, {order.shippingAddress.state}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2">
                                            {order.items.slice(0, 2).map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 rounded overflow-hidden border border-brand-gold/20 shrink-0"
                                                >
                                                    <InspectableImage
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        width={32}
                                                        height={32}
                                                        showBadge={false}
                                                    />
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <span className="text-[10px] text-brand-gold/80 font-mono">
                                                    +{order.items.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 font-bold text-white font-sans">
                                        {formatCurrency(order.totalAmount)}
                                    </td>
                                    <td className="py-3 px-3">
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
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                        <button
                                            onClick={() => handleViewOrder(order)}
                                            className="px-2.5 py-1 rounded border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:bg-brand-gold/10 text-xs font-semibold transition"
                                        >
                                            Inspect Order
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <ProductEditModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />

            <OrderDetailModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    )
}
