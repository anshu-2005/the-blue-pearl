'use client'

import { useState } from 'react'
import { TrendingUp, Sparkles, ShieldCheck, Info, X } from 'lucide-react'
import { LIVE_GOLD_RATES } from '@/lib/data'

export default function GoldRateTicker() {
    const [openModal, setOpenModal] = useState(false)

    return (
        <>
            {/* Single Streamlined Ultra-Luxury Top Bar */}
            <div className="bg-[#0C0205] border-b border-brand-gold/15 text-brand-gold py-1.5 px-4 text-xs select-none">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
                    {/* Announcement & Craft origin */}
                    <div className="flex items-center gap-4 text-[11px] whitespace-nowrap text-brand-silver/70">
                        <span className="flex items-center gap-1.5 text-white font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Jaipur Haute Atelier</span>
                        </span>
                        <span className="text-brand-gold/40">·</span>
                        <span className="hidden sm:inline">✦ Complimentary Insured Delivery Across India</span>
                    </div>

                    {/* Live Bullion Ticker */}
                    <div className="flex items-center gap-5 whitespace-nowrap text-[11px]">
                        <div className="flex items-center gap-1.5">
                            <span className="text-brand-silver/50">22K Gold:</span>
                            <span className="font-bold text-brand-gold font-mono">₹{LIVE_GOLD_RATES.gold22k}/g</span>
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                        </div>

                        <div className="flex items-center gap-1.5 hidden md:flex">
                            <span className="text-brand-silver/50">Silver 925:</span>
                            <span className="font-bold text-white/90 font-mono">₹{LIVE_GOLD_RATES.silver925}/g</span>
                        </div>

                        <button
                            onClick={() => setOpenModal(true)}
                            className="text-[10px] text-brand-gold/80 hover:text-brand-gold underline uppercase tracking-wider font-semibold transition-colors flex items-center gap-1 pl-2 border-l border-brand-gold/20"
                        >
                            <Info className="w-3 h-3" /> Rate Card
                        </button>
                    </div>
                </div>
            </div>

            {/* Rate Card Modal */}
            {openModal && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#1C0710] border-2 border-brand-gold/40 rounded-sm p-6 w-full max-w-lg shadow-2xl animate-fade-in relative">
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-4 right-4 text-brand-gold/60 hover:text-brand-gold p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest mb-1">
                            <Sparkles className="w-4 h-4 text-brand-gold" />
                            <span>Transparent Pricing Guarantee</span>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-white mb-1">Daily Precious Metal Rates</h2>
                        <p className="text-brand-silver/60 text-xs mb-5">
                            {LIVE_GOLD_RATES.lastUpdated} · Regulated by Bullion Market & BIS Standards
                        </p>

                        <div className="space-y-3 mb-6">
                            {[
                                { title: '24 Karat Pure Gold (99.9%)', purity: '999 Fine Gold', rate: LIVE_GOLD_RATES.gold24k, desc: 'Used for gold coins, bars and pure gold bullion' },
                                { title: '22 Karat Standard Gold (91.6%)', purity: 'BIS Hallmark 916', rate: LIVE_GOLD_RATES.gold22k, desc: 'Standard for royal Indian bridal and temple jewellery' },
                                { title: '18 Karat Gold (75.0%)', purity: 'BIS Hallmark 750', rate: LIVE_GOLD_RATES.gold18k, desc: 'Ideal for daily diamond-studded & cocktail rings' },
                                { title: '925 Sterling Silver (92.5%)', purity: 'Govt Assayed 925', rate: LIVE_GOLD_RATES.silver925, desc: 'Finest silver grade used for oxidised & filigree jewels' },
                            ].map(item => (
                                <div key={item.title} className="bg-brand-maroon-300/60 border border-brand-gold/15 p-3.5 rounded-sm flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-white text-xs font-semibold">{item.title}</p>
                                            <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-1.5 py-0.2 rounded">{item.purity}</span>
                                        </div>
                                        <p className="text-brand-silver/50 text-[11px] mt-0.5">{item.desc}</p>
                                    </div>
                                    <div className="text-right pl-3">
                                        <p className="font-display font-bold text-brand-gold text-base">₹{item.rate}/g</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-brand-gold/10 border border-brand-gold/20 p-3 rounded-sm flex items-center gap-2.5 text-xs text-brand-silver/80">
                            <ShieldCheck className="w-5 h-5 text-brand-gold flex-shrink-0" />
                            <span>Every piece from The Blue Pearl carries a laser-engraved BIS Hallmark / 925 Authenticity seal.</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
