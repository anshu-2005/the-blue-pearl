'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Package, MapPin, User, Heart, LogOut, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

const NAV = [
    { label: 'My Orders', href: '/account/orders', Icon: Package },
    { label: 'My Addresses', href: '/account/addresses', Icon: MapPin, active: true },
    { label: 'My Profile', href: '/account/profile', Icon: User },
    { label: 'Wishlist', href: '/wishlist', Icon: Heart },
]

interface Address {
    id: string
    name: string
    street: string
    city: string
    state: string
    pincode: string
    phone: string
    isDefault: boolean
}

export default function AddressesPage() {
    const { user, signOut } = useAuth()
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: 'addr-1',
            name: user?.displayName || 'Primary Residence',
            street: '402, Royal Palms, Link Road, Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400053',
            phone: '+91 98765 43210',
            isDefault: true,
        },
    ])
    const [showAddModal, setShowAddModal] = useState(false)
    const [newAddr, setNewAddr] = useState({
        name: '',
        street: '',
        city: '',
        state: 'Maharashtra',
        pincode: '',
        phone: '',
    })

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newAddr.name || !newAddr.street || !newAddr.pincode || !newAddr.city) {
            toast.error('Please fill in all required fields')
            return
        }
        const created: Address = {
            id: `addr-${Date.now()}`,
            ...newAddr,
            isDefault: addresses.length === 0,
        }
        setAddresses(prev => [...prev, created])
        setShowAddModal(false)
        setNewAddr({ name: '', street: '', city: '', state: 'Maharashtra', pincode: '', phone: '' })
        toast.success('New address added successfully!')
    }

    const handleDelete = (id: string) => {
        setAddresses(prev => prev.filter(a => a.id !== id))
        toast.success('Address removed')
    }

    const handleSetDefault = (id: string) => {
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })))
        toast.success('Default address updated')
    }

    return (
        <div className="min-h-screen bg-brand-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-60 flex-shrink-0">
                        <div className="bg-[#1E0A10] border border-brand-gold/20 rounded-sm p-4">
                            <div className="mb-6 pb-4 border-b border-brand-gold/10">
                                <p className="text-brand-gold font-display font-semibold text-base">{user?.displayName || 'My Account'}</p>
                                <p className="text-brand-silver/40 text-xs truncate">{user?.email}</p>
                            </div>
                            <nav className="space-y-1">
                                {NAV.map(({ label, href, Icon, active }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all ${
                                            active
                                                ? 'text-brand-gold bg-brand-maroon-300 font-semibold border-l-2 border-brand-gold'
                                                : 'text-brand-silver/60 hover:text-brand-gold hover:bg-brand-maroon-300'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" /> {label}
                                    </Link>
                                ))}
                                <button
                                    onClick={signOut}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-brand-silver/60 hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-left mt-4"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="font-display text-2xl font-bold text-gold-gradient">Saved Addresses</h1>
                                <p className="text-brand-silver/60 text-xs mt-1">Manage delivery destinations for rapid checkout</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="btn-gold flex items-center gap-1.5 text-xs py-2 px-3.5"
                            >
                                <Plus className="w-4 h-4" /> Add Address
                            </button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="text-center py-16 bg-[#1E0A10] border border-brand-gold/10 rounded-sm">
                                <MapPin className="w-10 h-10 text-brand-gold/40 mx-auto mb-3" />
                                <p className="text-white font-semibold">No saved addresses</p>
                                <p className="text-brand-silver/50 text-xs mt-1 mb-4">Add your shipping addresses for seamless delivery</p>
                                <button onClick={() => setShowAddModal(true)} className="btn-outline-gold text-xs py-2 px-4">
                                    + Add New Address
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {addresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        className={`bg-[#1E0A10] border rounded-sm p-5 relative transition-all ${
                                            addr.isDefault ? 'border-brand-gold shadow-[0_0_20px_rgba(201,166,107,0.1)]' : 'border-brand-gold/15'
                                        }`}
                                    >
                                        {addr.isDefault && (
                                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded-full mb-2">
                                                <CheckCircle2 className="w-3 h-3" /> Default Address
                                            </span>
                                        )}
                                        <h3 className="font-semibold text-white text-sm">{addr.name}</h3>
                                        <p className="text-brand-silver/70 text-xs mt-1.5 leading-relaxed">
                                            {addr.street},<br />
                                            {addr.city}, {addr.state} - <span className="font-mono text-brand-gold/90">{addr.pincode}</span>
                                        </p>
                                        <p className="text-brand-silver/50 text-xs mt-2">Phone: {addr.phone}</p>

                                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-brand-gold/10">
                                            {!addr.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefault(addr.id)}
                                                    className="text-brand-gold/70 hover:text-brand-gold text-xs font-semibold"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(addr.id)}
                                                className="text-red-400/70 hover:text-red-400 text-xs flex items-center gap-1 ml-auto"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Modal to add address */}
                        {showAddModal && (
                            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
                                <div className="bg-[#1C0810] border border-brand-gold/30 rounded-sm p-6 w-full max-w-md animate-fade-in shadow-2xl">
                                    <h2 className="font-display text-lg font-bold text-brand-gold mb-4">Add New Delivery Address</h2>
                                    <form onSubmit={handleAdd} className="space-y-3.5">
                                        <div>
                                            <label className="text-brand-silver/70 text-xs block mb-1">Full Name / Label *</label>
                                            <input
                                                required
                                                value={newAddr.name}
                                                onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}
                                                placeholder="e.g. Home, Office, Priya Sharma"
                                                className="input-gold text-xs w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-brand-silver/70 text-xs block mb-1">Street Address *</label>
                                            <input
                                                required
                                                value={newAddr.street}
                                                onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                                                placeholder="Flat/House No, Building, Street"
                                                className="input-gold text-xs w-full"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-brand-silver/70 text-xs block mb-1">City *</label>
                                                <input
                                                    required
                                                    value={newAddr.city}
                                                    onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                                                    placeholder="Mumbai"
                                                    className="input-gold text-xs w-full"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-brand-silver/70 text-xs block mb-1">Pincode *</label>
                                                <input
                                                    required
                                                    value={newAddr.pincode}
                                                    onChange={e => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/, '').slice(0, 6) })}
                                                    placeholder="400001"
                                                    className="input-gold text-xs w-full font-mono"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-brand-silver/70 text-xs block mb-1">Phone Number *</label>
                                            <input
                                                required
                                                value={newAddr.phone}
                                                onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                                                placeholder="+91 98765 43210"
                                                className="input-gold text-xs w-full"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowAddModal(false)}
                                                className="btn-outline-gold text-xs flex-1 py-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn-gold text-xs flex-1 py-2"
                                            >
                                                Save Address
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
