'use client'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function ProfilePage() {
    const { user } = useAuth()
    const [name, setName] = useState(user?.displayName || '')
    const [phone, setPhone] = useState('')

    return (
        <div className="min-h-screen bg-brand-black py-10">
            <div className="max-w-lg mx-auto px-4">
                <h1 className="font-display text-3xl font-bold text-gold-gradient mb-8">My Profile</h1>
                <div className="bg-[#1E0A10] border border-brand-gold/20 rounded-sm p-8 space-y-5">
                    <div>
                        <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1.5">Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="input-gold" />
                    </div>
                    <div>
                        <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1.5">Email</label>
                        <input value={user?.email || ''} disabled className="input-gold opacity-50" />
                    </div>
                    <div>
                        <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1.5">Phone</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)} className="input-gold" placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <button onClick={() => toast.success('Profile updated!')} className="btn-gold w-full">Save Changes</button>
                </div>
            </div>
        </div>
    )
}
