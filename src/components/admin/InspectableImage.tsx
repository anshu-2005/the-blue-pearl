'use client'

import React from 'react'
import Image from 'next/image'
import { Eye, Sparkles } from 'lucide-react'
import { useAdminImageModal } from './AdminImageModalContext'
import { ProductItem } from '@/lib/data'

interface InspectableImageProps {
    src: string
    alt: string
    product?: ProductItem
    category?: string
    width?: number
    height?: number
    fill?: boolean
    className?: string
    imageClassName?: string
    rounded?: string
    showBadge?: boolean
}

export default function InspectableImage({
    src,
    alt,
    product,
    category,
    width,
    height,
    fill = false,
    className = '',
    imageClassName = '',
    rounded = 'rounded-md',
    showBadge = true,
}: InspectableImageProps) {
    const { openImageModal } = useAdminImageModal()

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        openImageModal({
            src,
            title: product?.name || alt,
            product,
            category: category || product?.category,
        })
    }

    return (
        <div
            onClick={handleClick}
            className={`group relative overflow-hidden cursor-zoom-in ${rounded} ${className}`}
            title="Click to view full details and zoom image"
        >
            {fill ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    unoptimized
                    className={`transition-transform duration-500 group-hover:scale-110 object-cover ${imageClassName}`}
                />
            ) : (
                <Image
                    src={src}
                    alt={alt}
                    width={width || 64}
                    height={height || 64}
                    unoptimized
                    className={`transition-transform duration-500 group-hover:scale-110 object-cover ${imageClassName}`}
                />
            )}

            {/* Hover Overlay with Luxury Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-1.5 z-10">
                <div className="w-8 h-8 rounded-full bg-brand-gold/90 text-brand-maroon flex items-center justify-center shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <Eye className="w-4 h-4 stroke-[2.5]" />
                </div>
                {showBadge && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-brand-gold mt-1.5 opacity-90 drop-shadow">
                        Inspect
                    </span>
                )}
            </div>

            {/* Subtle Gold Corner Accent */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <Sparkles className="w-3 h-3 text-brand-gold drop-shadow" />
            </div>
        </div>
    )
}
