'use client'

import React, { useState, useMemo } from 'react'
import {
    Users,
    Search,
    Crown,
    Award,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Coins,
    Sparkles,
    Plus,
    X,
    Filter,
} from 'lucide-react'
import { useAdminCustomerStore, AdminCustomer, PatronTier } from '@/store/adminCustomerStore'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const TIERS: PatronTier[] = [
    'Royal Patron (Solitaire)',
    'Heritage Diamond VIP',
    'Gold Tier Patron',
    'Silver Patron',
]

export default function AdminCustomersPage() {
    const customers = useAdminCustomerStore((s) => s.customers)
    const addCustomer = useAdminCustomerStore((s) => s.addCustomer)

    const [searchQuery, setSearchQuery] = useState('')
    const [tierFilter, setTierFilter] = useState('All Tiers')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    // Form fields for new patron
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [tier, setTier] = useState<PatronTier>('Gold Tier Patron')
    const [notes, setNotes] = useState('')

    const filteredCustomers = useMemo(() => {
        return customers.filter((c) => {
            if (tierFilter !== 'All Tiers' && c.tier !== tierFilter) return false
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchName = c.name.toLowerCase().includes(q)
                const matchEmail = c.email.toLowerCase().includes(q)
                const matchCity = c.city.toLowerCase().includes(q)
                const matchPhone = c.phone.includes(q)
                if (!matchName && !matchEmail && !matchCity && !matchPhone) return false
            }
            return true
        })
    }, [customers, tierFilter, searchQuery])

    const handleCreateCustomer = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !phone.trim()) {
            toast.error('Name and phone are required')
            return
        }

        const newCust: AdminCustomer = {
            id: `cust-${Date.now()}`,
            name: name.trim(),
            email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@patron.in`,
            phone: phone.trim(),
            city: city.trim() || 'Mumbai',
            tier,
            totalOrders: 1,
            lifetimeSpend: 0,
            joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
            lastOrderDate: 'Just Joined',
            loyaltyPoints: 100,
            notes,
        }

        addCustomer(newCust)
        toast.success(`Patron ${name} registered successfully!`)
        setIsAddModalOpen(false)
        setName('')
        setEmail('')
        setPhone('')
        setCity('')
        setNotes('')
    }

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/15 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-semibold mb-1">
                        <Crown className="w-3.5 h-3.5" />
                        <span>VIP Patronage & Haute Client Relations</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                        Patron Directory & VIP Loyalty
                    </h1>
                    <p className="text-xs text-brand-silver/70 mt-1">
                        Exclusive records of collectors, royal patrons, and bespoke jewelry clients.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-gold py-2.5 px-5 text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Register New Patron</span>
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-lg bg-[#16050E] border border-brand-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-brand-gold/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search patron by name, email, phone or city..."
                        className="w-full bg-black/40 border border-brand-gold/25 focus:border-brand-gold rounded pl-9 pr-4 py-2 text-xs text-white placeholder-brand-silver/40 outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                        value={tierFilter}
                        onChange={(e) => setTierFilter(e.target.value)}
                        className="w-full sm:w-auto bg-black/40 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none"
                    >
                        <option value="All Tiers" className="bg-[#1C060F]">All Loyalty Tiers</option>
                        {TIERS.map((t) => (
                            <option key={t} value={t} className="bg-[#1C060F]">
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Patron Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((cust) => (
                    <div
                        key={cust.id}
                        className="p-5 rounded-lg bg-[#14050D] border border-brand-gold/20 hover:border-brand-gold transition shadow-lg flex flex-col justify-between space-y-4"
                    >
                        <div>
                            {/* Tier Badge */}
                            <div className="flex items-center justify-between mb-3">
                                <span
                                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                                        cust.tier.includes('Solitaire')
                                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                            : cust.tier.includes('Diamond')
                                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                            : cust.tier.includes('Gold')
                                            ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/40'
                                            : 'bg-neutral-500/20 text-neutral-300 border-neutral-500/40'
                                    }`}
                                >
                                    {cust.tier}
                                </span>
                                <span className="text-[10px] text-brand-gold/60 font-mono">
                                    {cust.loyaltyPoints} Pts
                                </span>
                            </div>

                            <h3 className="text-base font-display font-bold text-white tracking-wide">
                                {cust.name}
                            </h3>

                            <div className="mt-2 space-y-1.5 text-xs text-brand-silver/70">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-brand-gold/60 shrink-0" />
                                    <span className="truncate">{cust.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-brand-gold/60 shrink-0" />
                                    <span>{cust.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-brand-gold/60 shrink-0" />
                                    <span>{cust.city}</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial History */}
                        <div className="pt-3 border-t border-brand-gold/15 grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-brand-silver/50 block text-[10px] uppercase">Lifetime Spend</span>
                                <span className="font-bold text-gold-gradient font-sans text-sm">
                                    {formatCurrency(cust.lifetimeSpend)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-brand-silver/50 block text-[10px] uppercase">Total Orders</span>
                                <span className="font-bold text-white text-sm">
                                    {cust.totalOrders} order(s)
                                </span>
                            </div>
                        </div>

                        {cust.notes && (
                            <p className="text-[11px] text-brand-silver/60 italic bg-black/30 p-2 rounded border border-brand-gold/10">
                                "{cust.notes}"
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal: Register Patron */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
                    <div className="relative w-full max-w-lg bg-[#14050D] border border-brand-gold/30 rounded-lg shadow-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-brand-gold/20 pb-3">
                            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                                <Crown className="w-4 h-4 text-brand-gold" />
                                <span>Register Patron</span>
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-brand-silver/60 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
                            <div>
                                <label className="block text-brand-silver/80 mb-1">Patron Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Princess Gayatri Devi"
                                    className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-brand-silver/80 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 98..."
                                        className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-brand-silver/80 mb-1">City / Region</label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="e.g. Jaipur"
                                        className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-brand-silver/80 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@heritage.in"
                                    className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold"
                                />
                            </div>

                            <div>
                                <label className="block text-brand-silver/80 mb-1">Loyalty Tier</label>
                                <select
                                    value={tier}
                                    onChange={(e) => setTier(e.target.value as PatronTier)}
                                    className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white outline-none focus:border-brand-gold"
                                >
                                    {TIERS.map((t) => (
                                        <option key={t} value={t} className="bg-[#1C060F]">
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-brand-silver/80 mb-1">Personal Jewellery Preferences & Notes</label>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="e.g. Prefers uncut Polki diamonds and South Sea pearls."
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
                                    Save Patron
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
