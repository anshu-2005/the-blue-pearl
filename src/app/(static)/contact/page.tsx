'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Metadata } from 'next'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        toast.success('Message sent! We\'ll get back to you within 24 hours.')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-brand-black">
            <section className="py-20 bg-brand-maroon border-b border-brand-gold/20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-brand-gold/60 text-xs tracking-[0.3em] uppercase mb-3">Get in Touch</p>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-4">Contact Us</h1>
                    <p className="text-brand-silver/60 text-lg">We'd love to hear from you — questions, custom orders, wholesale enquiries.</p>
                </div>
            </section>

            <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Info */}
                    <div>
                        <h2 className="font-display text-2xl font-bold text-brand-gold mb-6">Reach Us</h2>
                        <div className="space-y-5">
                            {[
                                { Icon: Mail, label: 'Email', value: 'hello@thebluepearl.in', href: 'mailto:hello@thebluepearl.in' },
                                { Icon: Phone, label: 'Phone / WhatsApp', value: '+91 98765 43210', href: 'tel:+919876543210' },
                                { Icon: MapPin, label: 'Studio Address', value: '12, Johari Bazaar, Jaipur, Rajasthan 302003', href: '#' },
                                { Icon: Clock, label: 'Working Hours', value: 'Mon–Sat: 10:00 AM – 7:00 PM IST', href: '#' },
                            ].map(({ Icon, label, value, href }) => (
                                <div key={label} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-brand-gold" />
                                    </div>
                                    <div>
                                        <p className="text-brand-silver/40 text-xs uppercase tracking-widest">{label}</p>
                                        <a href={href} className="text-white hover:text-brand-gold transition-colors text-sm">{value}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1">Name *</label>
                                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-gold" placeholder="Your full name" />
                            </div>
                            <div>
                                <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1">Email *</label>
                                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-gold" placeholder="your@email.com" />
                            </div>
                        </div>
                        <div>
                            <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1">Phone</label>
                            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-gold" placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <div>
                            <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1">Subject *</label>
                            <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-gold" placeholder="How can we help?" />
                        </div>
                        <div>
                            <label className="text-brand-silver/60 text-xs uppercase tracking-widest block mb-1">Message *</label>
                            <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-gold resize-none" placeholder="Tell us more..." />
                        </div>
                        <button type="submit" disabled={loading} className="btn-gold w-full">
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}
