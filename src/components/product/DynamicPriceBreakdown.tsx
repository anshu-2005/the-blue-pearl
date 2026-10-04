'use client'

import { useState } from 'react'
import { Calculator, ShieldCheck, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { ProductItem, LIVE_GOLD_RATES } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

interface DynamicPriceBreakdownProps {
    product: ProductItem
    selectedPurity: '18K' | '22K' | '24K' | '925 Silver'
}

export default function DynamicPriceBreakdown({ product, selectedPurity }: DynamicPriceBreakdownProps) {
    const [expanded, setExpanded] = useState(false)

    // Compute live metal rate per gram based on selected purity
    let ratePerGram = LIVE_GOLD_RATES.gold22k
    if (selectedPurity === '24K') ratePerGram = LIVE_GOLD_RATES.gold24k
    if (selectedPurity === '18K') ratePerGram = LIVE_GOLD_RATES.gold18k
    if (selectedPurity === '925 Silver') ratePerGram = LIVE_GOLD_RATES.silver925

    // Scaled calculations for demonstration
    const netWeight = product.netMetalWeight || (product.weight * 0.9)
    const baseMetalValue = Math.round(product.salePrice * 0.72)
    const makingCharges = Math.round(product.salePrice * 0.18)
    const stoneCharges = product.stoneCharges || Math.round(product.salePrice * 0.07)
    const subtotal = baseMetalValue + makingCharges + stoneCharges
    const gst3Percent = Math.round(subtotal * 0.03)
    const calculatedTotal = subtotal + gst3Percent

    return (
        <div className="bg-[#1C0810] border border-brand-gold/25 rounded-sm p-4 my-4">
            <div
                onClick={() => setExpanded(e => !e)}
                className="flex items-center justify-between cursor-pointer select-none"
            >
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                        <Calculator className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <p className="text-white text-xs font-semibold flex items-center gap-1.5">
                            <span>Transparent Price Breakdown</span>
                            <span className="text-[10px] bg-brand-gold/20 text-brand-gold px-1.5 py-0.2 rounded font-mono">
                                {selectedPurity}
                            </span>
                        </p>
                        <p className="text-brand-silver/50 text-[10px]">
                            Live Bullion Rate + Making Charges + 3% GST
                        </p>
                    </div>
                </div>
                <button className="text-brand-gold/70 hover:text-brand-gold">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {expanded && (
                <div className="mt-4 pt-3 border-t border-brand-gold/15 space-y-2 text-xs animate-fade-in">
                    <div className="flex justify-between text-brand-silver/80">
                        <span>Net Metal Weight ({selectedPurity}):</span>
                        <span className="text-white font-mono">{netWeight.toFixed(2)} g</span>
                    </div>

                    <div className="flex justify-between text-brand-silver/80">
                        <span>Pure Metal Value:</span>
                        <span className="text-white font-mono">{formatCurrency(baseMetalValue)}</span>
                    </div>

                    <div className="flex justify-between text-brand-silver/80">
                        <span>Artisan Making Charges:</span>
                        <span className="text-white font-mono">{formatCurrency(makingCharges)}</span>
                    </div>

                    {stoneCharges > 0 && (
                        <div className="flex justify-between text-brand-silver/80">
                            <span>Stones / Kundan Setting:</span>
                            <span className="text-white font-mono">{formatCurrency(stoneCharges)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-brand-silver/80">
                        <span>Applicable GST (3% on Jewellery):</span>
                        <span className="text-white font-mono">{formatCurrency(gst3Percent)}</span>
                    </div>

                    <div className="pt-2 border-t border-brand-gold/20 flex justify-between font-bold text-brand-gold">
                        <span>Final Price (All Inclusive):</span>
                        <span className="text-base font-display">{formatCurrency(product.salePrice)}</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Zero hidden charges · 100% Certified Buyback Assurance</span>
                    </div>
                </div>
            )}
        </div>
    )
}
