'use client'

import { useState } from 'react'
import { Sparkles, Edit3, Check } from 'lucide-react'

interface EngravingCustomizerProps {
    engravingText: string
    onChangeText: (text: string) => void
    fontStyle: string
    onChangeFont: (font: string) => void
}

const FONTS = [
    { id: 'font-serif', label: 'Classic Roman', fontClass: 'font-serif tracking-widest' },
    { id: 'font-script', label: 'Royal Script', fontClass: 'italic font-serif font-light' },
    { id: 'font-sans', label: 'Modern Minimal', fontClass: 'font-sans uppercase tracking-[0.2em]' },
]

export default function EngravingCustomizer({
    engravingText,
    onChangeText,
    fontStyle,
    onChangeFont,
}: EngravingCustomizerProps) {
    const [open, setOpen] = useState(false)

    const activeFontObj = FONTS.find(f => f.id === fontStyle) || FONTS[0]

    return (
        <div className="bg-[#1C0810] border border-brand-gold/25 rounded-sm p-4 my-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-brand-gold" />
                    <span className="text-white text-xs font-semibold uppercase tracking-wider">
                        Personalized Custom Laser Engraving
                    </span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-xs font-semibold">
                    FREE
                </span>
            </div>

            <p className="text-brand-silver/60 text-xs mb-3">
                Engrave initials, a name, or a special date on the inner band / cuff of this jewellery.
            </p>

            <div className="space-y-3">
                {/* Input */}
                <div>
                    <input
                        type="text"
                        maxLength={20}
                        value={engravingText}
                        onChange={e => onChangeText(e.target.value)}
                        placeholder="e.g. Priya & Rohan 24.10.26"
                        className="input-gold text-xs w-full py-2 placeholder:text-brand-silver/30"
                    />
                    <div className="flex justify-between text-[10px] text-brand-silver/40 mt-1">
                        <span>Max 20 Characters</span>
                        <span>{engravingText.length}/20</span>
                    </div>
                </div>

                {/* Font Selector */}
                <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-brand-silver/60">Font Style:</span>
                    <div className="flex gap-1.5 flex-wrap">
                        {FONTS.map(f => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => onChangeFont(f.id)}
                                className={`text-[10px] px-2.5 py-1 rounded-xs border transition-colors ${
                                    fontStyle === f.id
                                        ? 'bg-brand-gold text-brand-maroon border-brand-gold font-bold'
                                        : 'border-brand-gold/30 text-brand-silver/70 hover:border-brand-gold'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Live Preview Ribbon */}
                {engravingText && (
                    <div className="mt-3 pt-3 border-t border-brand-gold/15">
                        <p className="text-[10px] text-brand-gold/70 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Live Laser Engraving Preview
                        </p>
                        <div className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7A1E] text-brand-maroon px-4 py-3 rounded-xs text-center shadow-inner relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/5" />
                            <span className={`text-sm md:text-base font-semibold drop-shadow-sm ${activeFontObj.fontClass}`}>
                                ❖ {engravingText} ❖
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
