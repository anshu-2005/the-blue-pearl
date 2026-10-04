'use client'

import React, { useState } from 'react'
import {
    Settings,
    Coins,
    Save,
    RotateCcw,
    Sparkles,
    ShieldCheck,
    Truck,
    Building2,
    Check,
    Calculator,
    AlertCircle,
} from 'lucide-react'
import { useAdminRatesStore, GoldRates } from '@/store/adminRatesStore'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
    const rates = useAdminRatesStore((s) => s.rates)
    const updateRate = useAdminRatesStore((s) => s.updateRate)
    const updateAllRates = useAdminRatesStore((s) => s.updateAllRates)
    const resetToDefault = useAdminRatesStore((s) => s.resetToDefault)

    // Local form state
    const [gold24k, setGold24k] = useState(rates.gold24k)
    const [gold22k, setGold22k] = useState(rates.gold22k)
    const [gold18k, setGold18k] = useState(rates.gold18k)
    const [gold14k, setGold14k] = useState(rates.gold14k)
    const [silver925, setSilver925] = useState(rates.silver925)
    const [silverFine, setSilverFine] = useState(rates.silverFine)

    // Calculator state
    const [calcMetal, setCalcMetal] = useState<'24K' | '22K' | '18K' | '925 Silver'>('22K')
    const [calcGrams, setCalcGrams] = useState<number>(65)
    const [calcMaking, setCalcMaking] = useState<number>(150)

    // Store settings
    const [storeName, setStoreName] = useState('The Blue Pearl Haute Jewellery')
    const [tagline, setTagline] = useState('Haute Joaillerie Atelier & Royal Rajputana Heritage')
    const [supportPhone, setSupportPhone] = useState('+91 98200 11990')
    const [supportEmail, setSupportEmail] = useState('concierge@thebluepearl.in')
    const [assayCenter, setAssayCenter] = useState('Mumbai Assaying & Hallmarking Centre #402')
    const [bisNumber, setBisNumber] = useState('HM/C-7890123')

    const handleSaveRates = (e: React.FormEvent) => {
        e.preventDefault()
        updateAllRates({
            gold24k: Number(gold24k),
            gold22k: Number(gold22k),
            gold18k: Number(gold18k),
            gold14k: Number(gold14k),
            silver925: Number(silver925),
            silverFine: Number(silverFine),
        })
        toast.success('Live Bullion MCX Rates updated successfully across the entire atelier!')
    }

    const handleReset = () => {
        resetToDefault()
        setGold24k(7480)
        setGold22k(6890)
        setGold18k(5640)
        setGold14k(4420)
        setSilver925(89.5)
        setSilverFine(92.0)
        toast.success('Bullion rates reset to default benchmarks.')
    }

    // Calculator calculation
    const getRatePerGram = () => {
        if (calcMetal === '24K') return gold24k
        if (calcMetal === '22K') return gold22k
        if (calcMetal === '18K') return gold18k
        return silver925
    }
    const rawMetalCost = getRatePerGram() * calcGrams
    const makingCost = calcMaking * calcGrams
    const gstCost = (rawMetalCost + makingCost) * 0.03
    const totalEst = rawMetalCost + makingCost + gstCost

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/15 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-semibold mb-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>Bullion Market & Enterprise Parameters</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                        MCX Gold Rates & Atelier Settings
                    </h1>
                    <p className="text-xs text-brand-silver/70 mt-1">
                        Real-time rate benchmark configurations, automatic melt valuation engine & operational parameters.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Sync Active</span>
                    </span>
                </div>
            </div>

            {/* Bullion Rates Configuration Card */}
            <div className="p-6 rounded-lg bg-[#14050D] border border-brand-gold/30 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-gold/15 pb-4">
                    <div>
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                            <Coins className="w-5 h-5 text-brand-gold" />
                            <span>Live Gold & Silver MCX Benchmarks (per Gram in INR)</span>
                        </h2>
                        <p className="text-xs text-brand-silver/60 mt-0.5">
                            Modifying these rates automatically updates the melt value calculations inside every product image inspector.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-3 py-1.5 rounded border border-brand-gold/25 hover:border-brand-gold text-brand-silver hover:text-white text-xs flex items-center gap-1.5 transition"
                            title="Reset to default MCX values"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Defaults</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSaveRates} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* 24K Gold */}
                        <div className="p-4 rounded-lg bg-black/40 border border-brand-gold/20 space-y-2">
                            <label className="block text-xs uppercase font-bold text-brand-silver/80">
                                24 Karat Pure Gold (999)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold font-bold text-sm">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={gold24k}
                                    onChange={(e) => setGold24k(Number(e.target.value))}
                                    className="w-full bg-black/60 border border-brand-gold/30 rounded pl-7 pr-3 py-2 text-sm text-white font-mono font-bold focus:border-brand-gold outline-none"
                                />
                            </div>
                            <span className="text-[10px] text-brand-silver/50 block">Standard Bullion 99.9% Purity</span>
                        </div>

                        {/* 22K Gold (Primary) */}
                        <div className="p-4 rounded-lg bg-[#220713] border border-brand-gold/40 ring-1 ring-brand-gold/30 space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs uppercase font-bold text-brand-gold">
                                    22 Karat Hallmark 916 (Primary)
                                </label>
                                <span className="text-[9px] bg-brand-gold/20 text-brand-gold px-1.5 py-0.2 rounded font-bold">
                                    DEFAULT
                                </span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold font-bold text-sm">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={gold22k}
                                    onChange={(e) => setGold22k(Number(e.target.value))}
                                    className="w-full bg-black/60 border border-brand-gold rounded pl-7 pr-3 py-2 text-sm text-brand-gold font-mono font-bold focus:border-brand-gold outline-none"
                                />
                            </div>
                            <span className="text-[10px] text-brand-gold/70 block">
                                91.6% Fine Gold used in South & Rajputana Temple Jewels
                            </span>
                        </div>

                        {/* 18K Gold */}
                        <div className="p-4 rounded-lg bg-black/40 border border-brand-gold/20 space-y-2">
                            <label className="block text-xs uppercase font-bold text-brand-silver/80">
                                18 Karat Gold (750)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold font-bold text-sm">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={gold18k}
                                    onChange={(e) => setGold18k(Number(e.target.value))}
                                    className="w-full bg-black/60 border border-brand-gold/30 rounded pl-7 pr-3 py-2 text-sm text-white font-mono font-bold focus:border-brand-gold outline-none"
                                />
                            </div>
                            <span className="text-[10px] text-brand-silver/50 block">75% Purity used in Diamond studding</span>
                        </div>

                        {/* 14K Gold */}
                        <div className="p-4 rounded-lg bg-black/40 border border-brand-gold/20 space-y-2">
                            <label className="block text-xs uppercase font-bold text-brand-silver/80">
                                14 Karat Gold (585)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold font-bold text-sm">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={gold14k}
                                    onChange={(e) => setGold14k(Number(e.target.value))}
                                    className="w-full bg-black/60 border border-brand-gold/30 rounded pl-7 pr-3 py-2 text-sm text-white font-mono font-bold focus:border-brand-gold outline-none"
                                />
                            </div>
                            <span className="text-[10px] text-brand-silver/50 block">58.5% Purity daily wear</span>
                        </div>

                        {/* 925 Sterling Silver */}
                        <div className="p-4 rounded-lg bg-black/40 border border-brand-gold/20 space-y-2">
                            <label className="block text-xs uppercase font-bold text-brand-silver/80">
                                925 Sterling Silver
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold font-bold text-sm">₹</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    min="1"
                                    value={silver925}
                                    onChange={(e) => setSilver925(Number(e.target.value))}
                                    className="w-full bg-black/60 border border-brand-gold/30 rounded pl-7 pr-3 py-2 text-sm text-white font-mono font-bold focus:border-brand-gold outline-none"
                                />
                            </div>
                            <span className="text-[10px] text-brand-silver/50 block">92.5% Fine Silver for Oxidised pieces</span>
                        </div>

                        {/* Fine 999 Silver */}
                        <div className="p-4 rounded-lg bg-black/40 border border-brand-gold/20 space-y-2">
                            <label className="block text-xs uppercase font-bold text-brand-silver/80">
                                Fine 999 Silver
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold font-bold text-sm">₹</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    min="1"
                                    value={silverFine}
                                    onChange={(e) => setSilverFine(Number(e.target.value))}
                                    className="w-full bg-black/60 border border-brand-gold/30 rounded pl-7 pr-3 py-2 text-sm text-white font-mono font-bold focus:border-brand-gold outline-none"
                                />
                            </div>
                            <span className="text-[10px] text-brand-silver/50 block">99.9% Silver bullion bars & coins</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-brand-gold/15">
                        <span className="text-xs text-brand-silver/60">
                            Last Revised: <strong className="text-brand-gold">{rates.lastUpdated}</strong>
                        </span>

                        <button
                            type="submit"
                            className="btn-gold py-2.5 px-6 text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save & Broadcast Rates</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Interactive Valuation Sandbox Calculator */}
            <div className="p-6 rounded-lg bg-[#14050D] border border-brand-gold/20 space-y-4">
                <div className="flex items-center gap-2 border-b border-brand-gold/15 pb-3">
                    <Calculator className="w-5 h-5 text-brand-gold" />
                    <div>
                        <h2 className="text-base font-display font-bold text-white">
                            Atelier Metal Valuation Sandbox
                        </h2>
                        <p className="text-xs text-brand-silver/60">
                            Simulate retail jewel pricing including pure metal weight, artisan making charges, and 3% jewellery GST.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div>
                        <label className="block text-brand-silver/70 mb-1">Select Metal & Purity</label>
                        <select
                            value={calcMetal}
                            onChange={(e) => setCalcMetal(e.target.value as any)}
                            className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white focus:border-brand-gold outline-none"
                        >
                            <option value="22K" className="bg-[#1C060F]">22K Gold (₹{gold22k}/g)</option>
                            <option value="24K" className="bg-[#1C060F]">24K Gold (₹{gold24k}/g)</option>
                            <option value="18K" className="bg-[#1C060F]">18K Gold (₹{gold18k}/g)</option>
                            <option value="925 Silver" className="bg-[#1C060F]">925 Silver (₹{silver925}/g)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-brand-silver/70 mb-1">Net Metal Weight (Grams)</label>
                        <input
                            type="number"
                            min="1"
                            value={calcGrams}
                            onChange={(e) => setCalcGrams(Number(e.target.value))}
                            className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white font-mono focus:border-brand-gold outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-brand-silver/70 mb-1">Artisan Making Charge / g (₹)</label>
                        <input
                            type="number"
                            min="0"
                            value={calcMaking}
                            onChange={(e) => setCalcMaking(Number(e.target.value))}
                            className="w-full bg-black/50 border border-brand-gold/30 rounded px-3 py-2 text-white font-mono focus:border-brand-gold outline-none"
                        />
                    </div>

                    <div className="p-3.5 rounded-lg bg-black/60 border border-brand-gold/30 flex flex-col justify-between">
                        <span className="text-[10px] uppercase font-bold text-brand-gold">Estimated Retail Value</span>
                        <span className="text-xl font-bold text-gold-gradient font-sans">
                            {formatCurrency(Math.round(totalEst))}
                        </span>
                        <span className="text-[10px] text-brand-silver/50">
                            Metal: {formatCurrency(Math.round(rawMetalCost))} + Making + 3% GST
                        </span>
                    </div>
                </div>
            </div>

            {/* Atelier Profile & Hallmarking Credentials */}
            <div className="p-6 rounded-lg bg-[#14050D] border border-brand-gold/20 space-y-5">
                <div className="flex items-center gap-2 border-b border-brand-gold/15 pb-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                        <h2 className="text-base font-display font-bold text-white">
                            Atelier Credentials & Insured Logistics
                        </h2>
                        <p className="text-xs text-brand-silver/60">
                            BIS 916 certification registry, concierge contacts and insured bullion logistics partners.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                        <label className="block text-brand-silver/70 mb-1">Atelier Brand Name</label>
                        <input
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-white focus:border-brand-gold outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-brand-silver/70 mb-1">VIP Concierge Helpline</label>
                        <input
                            type="text"
                            value={supportPhone}
                            onChange={(e) => setSupportPhone(e.target.value)}
                            className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-white focus:border-brand-gold outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-brand-silver/70 mb-1">BIS Hallmarking License ID</label>
                        <input
                            type="text"
                            value={bisNumber}
                            onChange={(e) => setBisNumber(e.target.value)}
                            className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-white font-mono focus:border-brand-gold outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-brand-silver/70 mb-1">Primary Hallmarking Hub</label>
                        <input
                            type="text"
                            value={assayCenter}
                            onChange={(e) => setAssayCenter(e.target.value)}
                            className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-white focus:border-brand-gold outline-none"
                        />
                    </div>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/25 flex items-center gap-3 text-xs text-emerald-300">
                    <Truck className="w-5 h-5 shrink-0 text-emerald-400" />
                    <div>
                        <span className="font-semibold block">Insured Vault-to-Doorstep Logistics Integrated</span>
                        <span className="text-[11px] text-brand-silver/70">
                            Partnered with BlueDart Apex, BVC Logistics Secure, and Sequel 24 Safe for full transit insurance up to ₹25 Lakhs per consignment.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
