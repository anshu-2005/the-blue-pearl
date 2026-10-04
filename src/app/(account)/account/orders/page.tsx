'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { Package, MapPin, User, Heart, LogOut } from 'lucide-react'

const NAV = [
    { label: 'My Orders', href: '/account/orders', Icon: Package },
    { label: 'My Addresses', href: '/account/addresses', Icon: MapPin },
    { label: 'My Profile', href: '/account/profile', Icon: User },
    { label: 'Wishlist', href: '/wishlist', Icon: Heart },
]

export default function AccountOrders() {
    const { user, signOut } = useAuth()

    const MOCK_ORDERS = [
        { id: 'TBP20240001', date: 1720000000000, items: 2, total: 1899, status: 'delivered' },
        { id: 'TBP20240002', date: 1722000000000, items: 1, total: 3499, status: 'shipped' },
        { id: 'TBP20240003', date: 1723000000000, items: 3, total: 2748, status: 'placed' },
    ]

    return (
        <div className="min-h-screen bg-brand-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="hidden md:block w-56 flex-shrink-0">
                        <div className="bg-[#1E0A10] border border-brand-gold/20 rounded-sm p-4">
                            <div className="mb-6 pb-4 border-b border-brand-gold/10">
                                <p className="text-brand-gold font-display font-semibold">{user?.displayName || 'My Account'}</p>
                                <p className="text-brand-silver/40 text-xs truncate">{user?.email}</p>
                            </div>
                            <nav className="space-y-1">
                                {NAV.map(({ label, href, Icon }) => (
                                    <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-brand-silver/60 hover:text-brand-gold hover:bg-brand-maroon-300 transition-all">
                                        <Icon className="w-4 h-4" /> {label}
                                    </Link>
                                ))}
                                <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-brand-silver/60 hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-left mt-4">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h1 className="font-display text-2xl font-bold text-gold-gradient mb-6">My Orders</h1>
                        <div className="space-y-3">
                            {MOCK_ORDERS.map(order => (
                                <div key={order.id} className="bg-[#1E0A10] border border-brand-gold/10 rounded-sm p-5 hover:border-brand-gold/30 transition-all">
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div>
                                            <p className="text-white font-semibold text-sm font-mono">{order.id}</p>
                                            <p className="text-brand-silver/40 text-xs mt-0.5">{new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · {order.items} items</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-brand-gold font-bold">₹{order.total.toLocaleString('en-IN')}</p>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                    order.status === 'shipped' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <Link href={`/account/orders/${order.id}`} className="text-brand-gold text-xs hover:underline">View →</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
