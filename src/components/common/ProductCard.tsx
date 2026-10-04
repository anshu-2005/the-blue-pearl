'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Star, Eye, Sparkles } from 'lucide-react'
import { ProductItem } from '@/lib/data'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatCurrency } from '@/lib/utils'
import ProductQuickViewModal from '@/components/product/ProductQuickViewModal'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface ProductCardProps {
    product: ProductItem
    index?: number
    onQuickView?: (product: ProductItem) => void
}

export default function ProductCard({ product, index = 0, onQuickView }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem)
    const toggleWishlist = useWishlistStore((s) => s.toggle)
    const isWishlisted = useWishlistStore((s) => s.has(product.id))

    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
    const discount = Math.round(((product.mrp - product.salePrice) / product.mrp) * 100)

    const handleOpenDetails = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (onQuickView) {
            onQuickView(product)
        } else {
            setIsQuickViewOpen(true)
        }
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem({
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.salePrice,
            mrp: product.mrp,
            quantity: 1,
            slug: product.slug,
        })
        toast.success(`Added ${product.name} to your Shopping Bag!`)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (index % 4) * 0.05 }}
                className="group relative bg-[#1E0A10] rounded-sm overflow-hidden border border-brand-gold/15 hover:border-brand-gold/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(201,166,107,0.22)] flex flex-col justify-between"
            >
                {/* Image Container with Quick View on Click */}
                <div
                    onClick={handleOpenDetails}
                    className="relative h-60 md:h-64 overflow-hidden bg-[#2A0A14] cursor-pointer"
                    title="Click to view details & specifications"
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        quality={90}
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
                        {discount > 0 && (
                            <span className="bg-brand-gold text-brand-maroon text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider shadow">
                                {discount}% OFF
                            </span>
                        )}
                        {product.bestSeller && (
                            <span className="bg-amber-600/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-xs uppercase tracking-wider backdrop-blur-xs shadow">
                                Best Seller
                            </span>
                        )}
                    </div>

                    {/* Quick View Floating Button on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="py-1.5 px-3.5 rounded-full bg-brand-gold/90 text-brand-maroon font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Quick View Details</span>
                        </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleWishlist(product.id)
                        }}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 z-10 ${
                            isWishlisted
                                ? 'bg-brand-gold text-brand-maroon scale-110 shadow-md'
                                : 'bg-black/50 text-brand-gold/80 hover:text-brand-gold hover:bg-black/75'
                        }`}
                        aria-label="Wishlist"
                    >
                        <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>

                    {/* Add to cart - slides up on hover */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-300 text-brand-maroon text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors duration-200"
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-brand-gold/60 text-[10px] uppercase tracking-[0.2em] font-sans">
                                {product.category}
                            </p>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-brand-gold/10 text-brand-gold border border-brand-gold/20 font-mono">
                                {product.purity}
                            </span>
                        </div>
                        <Link href={`/product/${product.slug}`}>
                            <h3 className="font-display font-semibold text-white text-sm leading-snug hover:text-brand-gold transition-colors duration-200 line-clamp-2 mb-2">
                                {product.name}
                            </h3>
                        </Link>
                    </div>

                    <div>
                        <div className="flex items-center gap-1 mb-2.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                        i < Math.floor(product.rating || 5)
                                            ? 'text-brand-gold fill-brand-gold'
                                            : 'text-brand-silver/20'
                                    }`}
                                />
                            ))}
                            <span className="text-brand-silver/40 text-[10px] ml-1">
                                ({product.reviews || 84})
                            </span>
                        </div>

                        <div className="flex items-baseline justify-between pt-2 border-t border-brand-gold/10">
                            <div>
                                <span className="font-display font-bold text-lg text-white">
                                    {formatCurrency(product.salePrice)}
                                </span>
                                {product.mrp > product.salePrice && (
                                    <span className="text-brand-silver/40 text-xs line-through ml-2">
                                        {formatCurrency(product.mrp)}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleOpenDetails}
                                className="text-brand-gold hover:text-white text-[11px] font-semibold underline flex items-center gap-1"
                            >
                                Details →
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick View Modal */}
            <ProductQuickViewModal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                product={product}
            />
        </>
    )
}
