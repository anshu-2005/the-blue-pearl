'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Diamond,
    ShoppingBag,
    Layers,
    Users,
    Tag,
    Image as ImageIcon,
    Settings,
    ExternalLink,
    Coins,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Store,
    Menu,
    X,
} from 'lucide-react'
import { useAdminProductStore } from '@/store/adminProductStore'
import { useAdminOrderStore } from '@/store/adminOrderStore'
import { useAdminRatesStore } from '@/store/adminRatesStore'
import { formatCurrency } from '@/lib/utils'

interface AdminSidebarProps {
    mobileOpen: boolean
    setMobileOpen: (open: boolean) => void
}

export default function AdminSidebar({ mobileOpen, setMobileOpen }: AdminSidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const products = useAdminProductStore((s) => s.products)
    const orders = useAdminOrderStore((s) => s.orders)
    const rates = useAdminRatesStore((s) => s.rates)

    const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length
    const lowStockCount = products.filter((p) => p.stock <= 5).length

    const navItems = [
        {
            href: '/admin',
            label: 'Overview',
            icon: LayoutDashboard,
            exact: true,
        },
        {
            href: '/admin/products',
            label: 'Products & Stock',
            icon: Diamond,
            badge: products.length,
            alertBadge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
        },
        {
            href: '/admin/orders',
            label: 'Orders & Shipments',
            icon: ShoppingBag,
            badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
            badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        },
        {
            href: '/admin/combos',
            label: 'Combos & Bundles',
            icon: Layers,
        },
        {
            href: '/admin/media',
            label: 'Media & Gallery',
            icon: ImageIcon,
            badge: '50+ Photos',
            badgeColor: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30',
        },
        {
            href: '/admin/customers',
            label: 'Patron Directory',
            icon: Users,
        },
        {
            href: '/admin/coupons',
            label: 'Coupons & Promos',
            icon: Tag,
        },
        {
            href: '/admin/settings',
            label: 'MCX Rates & Settings',
            icon: Settings,
        },
    ]

    const sidebarContent = (
        <div className="flex flex-col h-full bg-[#12040B] border-r border-brand-gold/20 select-none">
            {/* Top Brand Identity */}
            <div className="p-4 sm:p-5 border-b border-brand-gold/15 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-gold to-amber-700 p-0.5 shadow-gold shrink-0">
                        <div className="w-full h-full rounded-full bg-[#1A050F] flex items-center justify-center text-brand-gold">
                            <Sparkles className="w-4 h-4" />
                        </div>
                    </div>
                    {!collapsed && (
                        <div>
                            <span className="font-display text-base font-bold text-gold-gradient tracking-wide block leading-tight">
                                The Blue Pearl
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.25em] text-brand-gold/60 font-sans font-semibold">
                                Atelier Management
                            </span>
                        </div>
                    )}
                </Link>

                {/* Collapse button on desktop */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex p-1.5 rounded text-brand-silver/50 hover:text-brand-gold hover:bg-brand-gold/10 transition"
                    title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Live MCX Ticker Card in Sidebar */}
            {!collapsed && (
                <div className="p-3 mx-3 mt-3 rounded-lg bg-[#220713]/80 border border-brand-gold/25 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-brand-gold/80 uppercase tracking-widest font-bold mb-1.5">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Live MCX Rates
                        </span>
                        <Link href="/admin/settings" className="hover:underline text-brand-gold">
                            Edit
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                            <span className="text-brand-silver/60 block text-[9px]">Gold 22K (916)</span>
                            <span className="font-bold text-white font-mono">₹{rates.gold22k}/g</span>
                        </div>
                        <div>
                            <span className="text-brand-silver/60 block text-[9px]">Silver 925</span>
                            <span className="font-bold text-white font-mono">₹{rates.silver925}/g</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation links */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all group relative ${
                                isActive
                                    ? 'bg-gradient-to-r from-brand-gold/20 via-brand-gold/10 to-transparent text-brand-gold border-l-2 border-brand-gold font-bold shadow-sm'
                                    : 'text-brand-silver/80 hover:text-white hover:bg-brand-gold/5'
                            }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <item.icon
                                className={`w-4 h-4 shrink-0 transition-colors ${
                                    isActive ? 'text-brand-gold' : 'text-brand-silver/60 group-hover:text-brand-gold'
                                }`}
                            />

                            {!collapsed && (
                                <span className="flex-1 truncate tracking-wide">{item.label}</span>
                            )}

                            {!collapsed && item.alertBadge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    {item.alertBadge}
                                </span>
                            )}

                            {!collapsed && item.badge && !item.alertBadge && (
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                        item.badgeColor || 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                                    }`}
                                >
                                    {item.badge}
                                </span>
                            )}

                            {/* Active glow dot */}
                            {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_#C9A66B]" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-brand-gold/15 space-y-2">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs text-brand-silver/80 hover:text-brand-gold hover:bg-brand-gold/10 transition border border-brand-gold/20 font-medium"
                >
                    <Store className="w-4 h-4 text-brand-gold shrink-0" />
                    {!collapsed && <span className="flex-1 truncate">View Live Atelier</span>}
                    {!collapsed && <ExternalLink className="w-3 h-3 text-brand-gold/70" />}
                </Link>

                {!collapsed && (
                    <div className="px-3 py-2 rounded bg-black/40 border border-brand-gold/10 flex items-center justify-between text-[11px] text-brand-silver/60">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>Patron Admin Mode</span>
                        </div>
                        <span className="text-[10px] font-mono text-brand-gold/60">v2.4</span>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:block fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 ${
                    collapsed ? 'w-18' : 'w-64'
                }`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Drawer Overlay */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-fade-in"
                />
            )}

            {/* Mobile Drawer */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#12040B] transition-transform duration-300 lg:hidden ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {sidebarContent}
            </aside>
        </>
    )
}
