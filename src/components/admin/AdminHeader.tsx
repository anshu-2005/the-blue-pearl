'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
    Search,
    Bell,
    Plus,
    Menu,
    Coins,
    Sparkles,
    Image as ImageIcon,
    ExternalLink,
    AlertTriangle,
    ShoppingBag,
    Check,
} from 'lucide-react'
import { useAdminProductStore } from '@/store/adminProductStore'
import { useAdminOrderStore } from '@/store/adminOrderStore'
import { useAdminRatesStore } from '@/store/adminRatesStore'
import { useAdminImageModal } from './AdminImageModalContext'
import ProductEditModal from './ProductEditModal'
import { formatCurrency } from '@/lib/utils'

interface AdminHeaderProps {
    setMobileOpen: (open: boolean) => void
}

export default function AdminHeader({ setMobileOpen }: AdminHeaderProps) {
    const products = useAdminProductStore((s) => s.products)
    const orders = useAdminOrderStore((s) => s.orders)
    const rates = useAdminRatesStore((s) => s.rates)
    const { openImageModal } = useAdminImageModal()

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)

    const searchRef = useRef<HTMLDivElement>(null)
    const notifRef = useRef<HTMLDivElement>(null)

    // Filter products and orders based on search
    const matchingProducts = searchQuery.trim()
        ? products.filter(
              (p) =>
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.purity.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 5)
        : []

    const matchingOrders = searchQuery.trim()
        ? orders.filter(
              (o) =>
                  o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  o.customerPhone.includes(searchQuery)
          ).slice(0, 3)
        : []

    const lowStockItems = products.filter((p) => p.stock <= 5)
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing')

    // Close popups on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSearchResults(false)
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotifications(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <>
            <header className="sticky top-0 z-20 h-16 bg-[#16050E]/90 backdrop-blur-md border-b border-brand-gold/20 flex items-center justify-between px-4 sm:px-6">
                {/* Left section: Mobile menu + Search Bar */}
                <div className="flex items-center gap-3 flex-1 max-w-xl">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden p-2 rounded text-brand-silver/70 hover:text-brand-gold hover:bg-brand-gold/10 transition"
                        title="Open Menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Instant Search Bar */}
                    <div ref={searchRef} className="relative flex-1">
                        <div className="relative flex items-center">
                            <Search className="w-4 h-4 text-brand-gold/60 absolute left-3 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onFocus={() => setShowSearchResults(true)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setShowSearchResults(true)
                                }}
                                placeholder="Search jewels, orders, patrons, SKUs..."
                                className="w-full bg-black/40 border border-brand-gold/20 focus:border-brand-gold/70 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-brand-silver/40 outline-none transition"
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {showSearchResults && searchQuery.trim() && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A0612] border border-brand-gold/30 rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-brand-gold/15">
                                {/* Matching Products */}
                                {matchingProducts.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-[10px] uppercase font-bold text-brand-gold/70 px-2 py-1 tracking-wider">
                                            Jewellery Pieces ({matchingProducts.length})
                                        </div>
                                        {matchingProducts.map((p) => (
                                            <div
                                                key={p.id}
                                                onClick={() => {
                                                    openImageModal({
                                                        src: p.image,
                                                        title: p.name,
                                                        product: p,
                                                        category: p.category,
                                                    })
                                                    setShowSearchResults(false)
                                                }}
                                                className="flex items-center justify-between p-2 rounded hover:bg-brand-gold/10 cursor-pointer transition text-xs"
                                            >
                                                <div className="flex items-center gap-2.5 truncate">
                                                    <span className="w-2 h-2 rounded-full bg-brand-gold shrink-0" />
                                                    <span className="text-white font-medium truncate">{p.name}</span>
                                                    <span className="text-[10px] text-brand-gold/70 px-1.5 py-0.2 rounded bg-brand-gold/10">
                                                        {p.category}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-brand-gold ml-2 shrink-0 font-sans">
                                                    {formatCurrency(p.salePrice)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Matching Orders */}
                                {matchingOrders.length > 0 && (
                                    <div className="p-2">
                                        <div className="text-[10px] uppercase font-bold text-brand-gold/70 px-2 py-1 tracking-wider">
                                            Orders ({matchingOrders.length})
                                        </div>
                                        {matchingOrders.map((o) => (
                                            <Link
                                                key={o.id}
                                                href="/admin/orders"
                                                onClick={() => setShowSearchResults(false)}
                                                className="flex items-center justify-between p-2 rounded hover:bg-brand-gold/10 transition text-xs"
                                            >
                                                <div>
                                                    <span className="text-brand-gold font-mono font-semibold">#{o.orderNumber}</span>
                                                    <span className="text-brand-silver/70 ml-2">{o.customerName}</span>
                                                </div>
                                                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                                    {o.orderStatus}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {matchingProducts.length === 0 && matchingOrders.length === 0 && (
                                    <div className="p-4 text-center text-xs text-brand-silver/50">
                                        No jewellery or orders found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right section: Live MCX Ticker + Quick Add + Notifications + Profile */}
                <div className="flex items-center gap-3">
                    {/* Live Gold Ticker Pill */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-brand-gold font-bold">22K Gold:</span>
                        <span className="font-mono text-white">₹{rates.gold22k}/g</span>
                    </div>

                    {/* Quick Add Product Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="btn-gold py-1.5 px-3.5 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 shadow"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Add Jewel</span>
                    </button>

                    {/* Notifications Button & Dropdown */}
                    <div ref={notifRef} className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-full text-brand-silver/70 hover:text-brand-gold hover:bg-brand-gold/10 relative transition"
                            title="Notifications & Alerts"
                        >
                            <Bell className="w-4 h-4" />
                            {(lowStockItems.length > 0 || pendingOrders.length > 0) && (
                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#16050E]" />
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-[#1A0612] border border-brand-gold/30 rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-brand-gold/15 animate-fade-in">
                                <div className="p-3 bg-[#240816] flex items-center justify-between">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                        Atelier Alerts
                                    </span>
                                    <span className="text-[10px] text-brand-gold font-mono">
                                        {lowStockItems.length + pendingOrders.length} New
                                    </span>
                                </div>

                                <div className="max-h-72 overflow-y-auto divide-y divide-brand-gold/10">
                                    {/* Low Stock Alerts */}
                                    {lowStockItems.slice(0, 3).map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                openImageModal({
                                                    src: item.image,
                                                    title: item.name,
                                                    product: item,
                                                    category: item.category,
                                                })
                                                setShowNotifications(false)
                                            }}
                                            className="p-3 flex items-start gap-2.5 hover:bg-brand-gold/10 cursor-pointer transition text-xs"
                                        >
                                            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-white font-medium">Low Stock Warning: {item.name}</p>
                                                <p className="text-[11px] text-brand-silver/60">
                                                    Only {item.stock} unit(s) remaining in stock. Click to restock.
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pending Orders */}
                                    {pendingOrders.slice(0, 2).map((order) => (
                                        <Link
                                            key={order.id}
                                            href="/admin/orders"
                                            onClick={() => setShowNotifications(false)}
                                            className="p-3 flex items-start gap-2.5 hover:bg-brand-gold/10 transition text-xs"
                                        >
                                            <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-white font-medium">Order #{order.orderNumber} Pending</p>
                                                <p className="text-[11px] text-brand-silver/60">
                                                    {order.customerName} • {formatCurrency(order.totalAmount)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}

                                    {lowStockItems.length === 0 && pendingOrders.length === 0 && (
                                        <div className="p-4 text-center text-xs text-brand-silver/50">
                                            All systems operational. No critical alerts.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Admin Avatar */}
                    <div className="flex items-center gap-2 pl-2 border-l border-brand-gold/20">
                        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-brand-gold to-amber-700 p-0.5">
                            <div className="w-full h-full rounded-full bg-[#18040F] flex items-center justify-center font-bold text-xs text-brand-gold">
                                BP
                            </div>
                            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#16050E]" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick Add Product Modal */}
            <ProductEditModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </>
    )
}
