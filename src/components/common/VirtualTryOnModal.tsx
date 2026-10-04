'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Camera, X, Upload, Sparkles, Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { ProductItem } from '@/lib/data'

interface VirtualTryOnModalProps {
    isOpen: boolean
    onClose: () => void
    product: ProductItem
}

const MODEL_PRESETS = [
    { label: 'Bridal Portrait 1', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80' },
    { label: 'Traditional Saree 2', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80' },
]

export default function VirtualTryOnModal({ isOpen, onClose, product }: VirtualTryOnModalProps) {
    const [mode, setMode] = useState<'preset' | 'upload' | 'camera'>('preset')
    const [selectedPreset, setSelectedPreset] = useState(MODEL_PRESETS[0].url)
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [cameraActive, setCameraActive] = useState(false)
    const [scale, setScale] = useState(1)
    const [pos, setPos] = useState({ x: 0, y: 40 })

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (mode === 'camera' && isOpen) {
            navigator.mediaDevices?.getUserMedia({ video: true })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream
                        videoRef.current.play()
                        setCameraActive(true)
                    }
                })
                .catch(() => {
                    setMode('preset')
                })
        } else {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream
                stream.getTracks().forEach(t => t.stop())
                setCameraActive(false)
            }
        }
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream
                stream.getTracks().forEach(t => t.stop())
            }
        }
    }, [mode, isOpen])

    if (!isOpen) return null

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setUploadedImage(url)
            setMode('upload')
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#1C0710] border border-brand-gold/40 rounded-sm p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative flex flex-col justify-between">
                {/* Topbar */}
                <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4 mb-4">
                    <div>
                        <div className="flex items-center gap-1.5 text-brand-gold text-[11px] uppercase tracking-widest font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AR Augmented Preview</span>
                        </div>
                        <h2 className="font-display text-xl font-bold text-white">Virtual Try-On Simulation</h2>
                    </div>
                    <button onClick={onClose} className="text-brand-gold/70 hover:text-brand-gold p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mode Selector */}
                <div className="flex gap-2 mb-4 overflow-x-auto">
                    <button
                        onClick={() => setMode('preset')}
                        className={`text-xs px-3.5 py-1.5 rounded-xs font-semibold border transition-colors ${
                            mode === 'preset'
                                ? 'bg-brand-gold text-brand-maroon border-brand-gold'
                                : 'border-brand-gold/25 text-brand-silver/70 hover:border-brand-gold'
                        }`}
                    >
                        Model Presets
                    </button>
                    <label className={`text-xs px-3.5 py-1.5 rounded-xs font-semibold border cursor-pointer transition-colors flex items-center gap-1 ${
                        mode === 'upload'
                            ? 'bg-brand-gold text-brand-maroon border-brand-gold'
                            : 'border-brand-gold/25 text-brand-silver/70 hover:border-brand-gold'
                    }`}>
                        <Upload className="w-3.5 h-3.5" /> Upload Photo
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <button
                        onClick={() => setMode('camera')}
                        className={`text-xs px-3.5 py-1.5 rounded-xs font-semibold border transition-colors flex items-center gap-1 ${
                            mode === 'camera'
                                ? 'bg-brand-gold text-brand-maroon border-brand-gold'
                                : 'border-brand-gold/25 text-brand-silver/70 hover:border-brand-gold'
                        }`}
                    >
                        <Camera className="w-3.5 h-3.5" /> Live Camera
                    </button>
                </div>

                {/* Viewport Canvas Area */}
                <div className="relative h-80 sm:h-96 w-full rounded-sm overflow-hidden bg-black border-2 border-brand-gold/30 flex items-center justify-center">
                    {/* Background Target */}
                    {mode === 'camera' ? (
                        <video ref={videoRef} className="w-full h-full object-cover -scale-x-100" />
                    ) : mode === 'upload' && uploadedImage ? (
                        <Image src={uploadedImage} alt="Uploaded portrait" fill unoptimized className="object-cover" />
                    ) : (
                        <Image src={selectedPreset} alt="Model preset" fill unoptimized className="object-cover" />
                    )}

                    {/* Draggable/Resizable Jewellery Overlay */}
                    <div
                        className="absolute z-20 cursor-move pointer-events-auto select-none"
                        style={{
                            transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                        }}
                    >
                        <div className="relative w-44 h-44 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Position Adjuster Controls */}
                    <div className="absolute bottom-3 right-3 z-30 bg-black/70 border border-brand-gold/30 backdrop-blur-sm p-1.5 rounded flex items-center gap-2">
                        <button
                            onClick={() => setScale(s => Math.max(0.6, s - 0.1))}
                            className="p-1 text-white hover:text-brand-gold"
                            title="Zoom Out Jewellery"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setScale(s => Math.min(1.6, s + 0.1))}
                            className="p-1 text-white hover:text-brand-gold"
                            title="Zoom In Jewellery"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                setScale(1)
                                setPos({ x: 0, y: 40 })
                            }}
                            className="p-1 text-white hover:text-brand-gold"
                            title="Reset Position"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Preset Switcher (if preset mode) */}
                {mode === 'preset' && (
                    <div className="flex gap-2 mt-4">
                        {MODEL_PRESETS.map((m, i) => (
                            <button
                                key={m.label}
                                onClick={() => setSelectedPreset(m.url)}
                                className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                                    selectedPreset === m.url
                                        ? 'border-brand-gold text-brand-gold font-semibold bg-brand-maroon-300'
                                        : 'border-white/20 text-brand-silver/60'
                                }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-4 pt-3 border-t border-brand-gold/15 flex items-center justify-between text-xs text-brand-silver/60">
                    <p>✦ Use controls or drag jewellery to adjust neckline positioning.</p>
                    <button onClick={onClose} className="btn-gold py-1.5 px-4 text-xs font-bold uppercase">
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
