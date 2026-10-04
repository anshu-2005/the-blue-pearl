'use client'

import { useState } from 'react'
import { ShieldCheck, Search, Award, CheckCircle2, QrCode, X, Sparkles } from 'lucide-react'
import { CERTIFICATES_DATABASE } from '@/lib/data'

export default function CertificateVerifyModal({
    isOpen,
    onClose,
    initialCertId = '',
}: {
    isOpen: boolean
    onClose: () => void
    initialCertId?: string
}) {
    const [certInput, setCertInput] = useState(initialCertId || 'BIS-916-TBP-01')
    const [result, setResult] = useState<typeof CERTIFICATES_DATABASE[string] | null>(
        CERTIFICATES_DATABASE[initialCertId] || CERTIFICATES_DATABASE['BIS-916-TBP-01'] || null
    )
    const [searched, setSearched] = useState(true)

    if (!isOpen) return null

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const query = certInput.trim().toUpperCase()
        const found = Object.values(CERTIFICATES_DATABASE).find(
            c => c.certificateNumber.toUpperCase() === query
        )
        setResult(found || null)
        setSearched(true)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#1C0710] border border-brand-gold/40 rounded-sm p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-brand-gold/60 hover:text-brand-gold p-1"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest mb-1">
                    <Award className="w-4 h-4 text-brand-gold" />
                    <span>Govt. Regulated Verification</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">BIS Hallmark & Certificate Verifier</h2>
                <p className="text-brand-silver/60 text-xs mb-5">
                    Verify the official hallmarking registration, purity assay, and authenticity record of your jewellery.
                </p>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-brand-gold/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={certInput}
                            onChange={e => setCertInput(e.target.value)}
                            placeholder="Enter Certificate or Hallmark ID (e.g. BIS-916-TBP-01)"
                            className="input-gold text-xs w-full pl-9 py-2.5 font-mono uppercase"
                        />
                    </div>
                    <button type="submit" className="btn-gold py-2.5 px-5 text-xs font-bold uppercase tracking-wider">
                        Verify
                    </button>
                </form>

                {/* Certificate Card */}
                {result ? (
                    <div className="bg-gradient-to-b from-[#2A0E18] to-[#17050B] border-2 border-brand-gold/50 rounded-sm p-6 relative overflow-hidden shadow-2xl">
                        {/* Gold watermark pattern */}
                        <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
                            <Award className="w-36 h-36 text-brand-gold" />
                        </div>

                        {/* Top Ribbon */}
                        <div className="flex items-center justify-between border-b border-brand-gold/30 pb-4 mb-4">
                            <div>
                                <span className="font-display text-lg font-bold text-gold-gradient block">The Blue Pearl</span>
                                <span className="text-[10px] text-brand-silver/50 tracking-widest uppercase">Certificate of Authenticity</span>
                            </div>
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Pure
                            </span>
                        </div>

                        {/* Data Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                            <div>
                                <span className="text-brand-silver/50 text-[10px] uppercase block">Certificate No.</span>
                                <span className="text-brand-gold font-mono font-bold text-sm">{result.certificateNumber}</span>
                            </div>
                            <div>
                                <span className="text-brand-silver/50 text-[10px] uppercase block">Purity & Standard</span>
                                <span className="text-white font-semibold">{result.purity}</span>
                            </div>
                            <div>
                                <span className="text-brand-silver/50 text-[10px] uppercase block">Jewellery Item</span>
                                <span className="text-white font-medium">{result.itemTitle}</span>
                            </div>
                            <div>
                                <span className="text-brand-silver/50 text-[10px] uppercase block">Metal Composition</span>
                                <span className="text-brand-silver/90">{result.metalType}</span>
                            </div>
                            <div>
                                <span className="text-brand-silver/50 text-[10px] uppercase block">Gross Weight</span>
                                <span className="text-white font-mono">{result.grossWeight}</span>
                            </div>
                            <div>
                                <span className="text-brand-silver/50 text-[10px] uppercase block">Net Metal Weight</span>
                                <span className="text-white font-mono">{result.netWeight}</span>
                            </div>
                        </div>

                        {/* Footer Assaying info */}
                        <div className="border-t border-brand-gold/20 pt-3 flex items-center justify-between text-[11px] text-brand-silver/60">
                            <div>
                                <p className="text-brand-gold font-semibold text-[10px]">Assaying Center:</p>
                                <p className="text-[10px]">{result.hallmarkCenter}</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-brand-gold">
                                <QrCode className="w-6 h-6" />
                                <span className="text-[9px] font-mono leading-tight">Digital Seal<br />Verified</span>
                            </div>
                        </div>
                    </div>
                ) : searched ? (
                    <div className="text-center py-10 bg-brand-maroon-300/30 rounded border border-brand-gold/15">
                        <p className="text-brand-gold text-sm font-semibold mb-1">No Record Found</p>
                        <p className="text-brand-silver/50 text-xs max-w-xs mx-auto">
                            Please check your certificate number or contact our concierge for manual lookup.
                        </p>
                        <p className="text-[11px] text-brand-gold/70 mt-3 font-mono">
                            Sample codes: BIS-916-TBP-01, IGI-IND-78491, BIS-925-SLV-19
                        </p>
                    </div>
                ) : null}

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="btn-outline-gold text-xs py-2 px-5">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
