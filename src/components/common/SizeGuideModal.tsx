'use client'

import { useState } from 'react'
import { Ruler, Sparkles, X, Check } from 'lucide-react'

const RING_SIZES = [
    { inSize: '8', diameter: '15.3 mm', circ: '48.0 mm' },
    { inSize: '10', diameter: '15.9 mm', circ: '50.0 mm' },
    { inSize: '12', diameter: '16.5 mm', circ: '51.8 mm' },
    { inSize: '14', diameter: '17.2 mm', circ: '54.0 mm' },
    { inSize: '16', diameter: '17.8 mm', circ: '56.0 mm' },
    { inSize: '18', diameter: '18.5 mm', circ: '58.0 mm' },
    { inSize: '20', diameter: '19.1 mm', circ: '60.0 mm' },
    { inSize: '22', diameter: '19.8 mm', circ: '62.2 mm' },
]

const BANGLE_SIZES = [
    { inSize: '2.2 (Extra Small)', diameter: '54.0 mm', circ: '169.6 mm' },
    { inSize: '2.4 (Small)', diameter: '57.2 mm', circ: '179.6 mm' },
    { inSize: '2.6 (Medium)', diameter: '60.3 mm', circ: '189.4 mm' },
    { inSize: '2.8 (Large)', diameter: '63.5 mm', circ: '199.4 mm' },
    { inSize: '2.10 (Extra Large)', diameter: '66.7 mm', circ: '209.5 mm' },
]

export default function SizeGuideModal({
    isOpen,
    onClose,
    defaultType = 'ring',
}: {
    isOpen: boolean
    onClose: () => void
    defaultType?: 'ring' | 'bangle'
}) {
    const [tab, setTab] = useState<'ring' | 'bangle'>(defaultType)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#1C0710] border border-brand-gold/40 rounded-sm p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-brand-gold/60 hover:text-brand-gold p-1"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Heading */}
                <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest mb-1">
                    <Ruler className="w-4 h-4 text-brand-gold" />
                    <span>Royal Fit Assurance</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">Jewellery Size Guide</h2>
                <p className="text-brand-silver/60 text-xs mb-6">
                    Follow our standardized Indian sizing guide to select the perfect comfortable fit.
                </p>

                {/* Tabs */}
                <div className="flex border-b border-brand-gold/20 mb-6">
                    <button
                        onClick={() => setTab('ring')}
                        className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                            tab === 'ring' ? 'text-brand-gold border-brand-gold' : 'text-brand-silver/50 border-transparent hover:text-brand-gold'
                        }`}
                    >
                        💍 Ring Size Chart
                    </button>
                    <button
                        onClick={() => setTab('bangle')}
                        className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                            tab === 'bangle' ? 'text-brand-gold border-brand-gold' : 'text-brand-silver/50 border-transparent hover:text-brand-gold'
                        }`}
                    >
                        ✨ Bangle / Kada Sizer
                    </button>
                </div>

                {/* Content */}
                {tab === 'ring' ? (
                    <div className="space-y-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead>
                                    <tr className="border-b border-brand-gold/20 text-brand-gold/70">
                                        <th className="py-2.5 px-3">Indian Size</th>
                                        <th className="py-2.5 px-3">Inner Diameter</th>
                                        <th className="py-2.5 px-3">Finger Circumference</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-gold/10">
                                    {RING_SIZES.map(row => (
                                        <tr key={row.inSize} className="hover:bg-brand-maroon-300/40">
                                            <td className="py-2.5 px-3 font-semibold text-brand-gold font-mono">Size {row.inSize}</td>
                                            <td className="py-2.5 px-3 text-brand-silver/80">{row.diameter}</td>
                                            <td className="py-2.5 px-3 text-white font-mono">{row.circ}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Measurement Tips */}
                        <div className="bg-brand-maroon-300/40 border border-brand-gold/15 p-4 rounded-sm text-xs text-brand-silver/80 space-y-2">
                            <p className="font-semibold text-brand-gold">How to measure your finger at home:</p>
                            <p>1. Wrap a strip of paper or non-stretchy thread snugly around the base of your intended finger.</p>
                            <p>2. Mark the exact spot where the paper/thread overlaps.</p>
                            <p>3. Measure the length with a ruler in millimeters to get your circumference and match it in the table above.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead>
                                    <tr className="border-b border-brand-gold/20 text-brand-gold/70">
                                        <th className="py-2.5 px-3">Indian Bangle Size</th>
                                        <th className="py-2.5 px-3">Inner Diameter</th>
                                        <th className="py-2.5 px-3">Wrist Circumference</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-gold/10">
                                    {BANGLE_SIZES.map(row => (
                                        <tr key={row.inSize} className="hover:bg-brand-maroon-300/40">
                                            <td className="py-2.5 px-3 font-semibold text-brand-gold font-mono">{row.inSize}</td>
                                            <td className="py-2.5 px-3 text-brand-silver/80">{row.diameter}</td>
                                            <td className="py-2.5 px-3 text-white font-mono">{row.circ}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Bangle Tips */}
                        <div className="bg-brand-maroon-300/40 border border-brand-gold/15 p-4 rounded-sm text-xs text-brand-silver/80 space-y-2">
                            <p className="font-semibold text-brand-gold">How to measure your bangle size:</p>
                            <p>1. Bring your thumb and little finger together as if putting on a bangle.</p>
                            <p>2. Wrap a tape or string around the widest part of your hand (across knuckles).</p>
                            <p>3. Measure the circumference in millimeters and find your closest size above.</p>
                        </div>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-brand-gold/20 flex justify-end">
                    <button onClick={onClose} className="btn-gold py-2 px-6 text-xs uppercase tracking-wider">
                        Got It
                    </button>
                </div>
            </div>
        </div>
    )
}
