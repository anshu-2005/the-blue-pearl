'use client'

import { useState } from 'react'
import { Calendar, Video, MapPin, X, CheckCircle2, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AppointmentModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const [type, setType] = useState<'video' | 'store'>('video')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('11:00 AM')
    const [notes, setNotes] = useState('')
    const [submitted, setSubmitted] = useState(false)

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !phone || !date) {
            toast.error('Please complete all required fields')
            return
        }
        setSubmitted(true)
        toast.success(`Consultation booked successfully for ${date} at ${time}!`)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#1C0710] border border-brand-gold/40 rounded-sm p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-brand-gold/60 hover:text-brand-gold p-1"
                >
                    <X className="w-5 h-5" />
                </button>

                {!submitted ? (
                    <>
                        <div className="flex items-center gap-1.5 text-brand-gold text-[11px] uppercase tracking-widest font-semibold mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>Private Concierge</span>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-white mb-2">Book a Jewellery Consultation</h2>
                        <p className="text-brand-silver/60 text-xs mb-6">
                            Schedule a personalized 1-on-1 virtual walkthrough or private showroom visit with our master jewellery stylists.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Consultation Type */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setType('video')}
                                    className={`p-3 rounded-sm border text-left flex items-start gap-2.5 transition-colors ${
                                        type === 'video'
                                            ? 'border-brand-gold bg-brand-maroon-300 text-brand-gold'
                                            : 'border-brand-gold/20 text-brand-silver/60 hover:border-brand-gold/50'
                                    }`}
                                >
                                    <Video className="w-4 h-4 mt-0.5 text-brand-gold" />
                                    <div>
                                        <p className="font-semibold text-xs text-white">Live Video Call</p>
                                        <p className="text-[10px] text-brand-silver/50">HD WhatsApp / Zoom</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('store')}
                                    className={`p-3 rounded-sm border text-left flex items-start gap-2.5 transition-colors ${
                                        type === 'store'
                                            ? 'border-brand-gold bg-brand-maroon-300 text-brand-gold'
                                            : 'border-brand-gold/20 text-brand-silver/60 hover:border-brand-gold/50'
                                    }`}
                                >
                                    <MapPin className="w-4 h-4 mt-0.5 text-brand-gold" />
                                    <div>
                                        <p className="font-semibold text-xs text-white">Boutique Visit</p>
                                        <p className="text-[10px] text-brand-silver/50">Zaveri Bazaar, Mumbai</p>
                                    </div>
                                </button>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-3">
                                <div>
                                    <label className="text-brand-silver/70 text-xs block mb-1">Your Name *</label>
                                    <input
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Radhika Kapoor"
                                        className="input-gold text-xs w-full py-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-brand-silver/70 text-xs block mb-1">WhatsApp / Phone *</label>
                                    <input
                                        required
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        className="input-gold text-xs w-full py-2"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-brand-silver/70 text-xs block mb-1">Preferred Date *</label>
                                        <input
                                            required
                                            type="date"
                                            value={date}
                                            onChange={e => setDate(e.target.value)}
                                            className="input-gold text-xs w-full py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-brand-silver/70 text-xs block mb-1">Time Slot *</label>
                                        <select
                                            value={time}
                                            onChange={e => setTime(e.target.value)}
                                            className="input-gold text-xs w-full py-2 cursor-pointer"
                                        >
                                            <option>11:00 AM – 12:00 PM</option>
                                            <option>02:00 PM – 03:00 PM</option>
                                            <option>04:30 PM – 05:30 PM</option>
                                            <option>06:30 PM – 07:30 PM</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-brand-silver/70 text-xs block mb-1">Specific requirements or budget notes</label>
                                    <textarea
                                        rows={2}
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        placeholder="Looking for Bridal necklace set, budget around ₹50,000..."
                                        className="input-gold text-xs w-full py-2"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-gold w-full py-3 text-xs font-bold uppercase tracking-widest mt-2"
                            >
                                Confirm Appointment
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-white mb-2">Appointment Reserved</h3>
                        <p className="text-brand-silver/70 text-xs max-w-sm mx-auto mb-6 leading-relaxed">
                            Thank you, <span className="text-brand-gold font-semibold">{name}</span>. Our concierge team has booked your {type === 'video' ? 'Live Video Consultation' : 'Showroom Visit'} on <span className="text-white font-semibold">{date}</span> at <span className="text-white font-semibold">{time}</span>.
                        </p>
                        <button
                            onClick={() => {
                                setSubmitted(false)
                                onClose()
                            }}
                            className="btn-gold py-2 px-6 text-xs uppercase tracking-wider"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
