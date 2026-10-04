'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, Star } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function WishlistPage() {
    const items = useWishlistStore(s => s.items)
    const removeItem = useWishlistStore(s => s.removeItem)
    const addItem = useCartStore(s => s.addItem)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="min-h-[70vh] bg-brand-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    // Map item IDs to real product objects
    const productMap = new Map<string, ProductItem>(ALL_PRODUCTS.map(p => [p.id, p]))
    const wishlistedProducts = items
        .map(id => productMap.get(id))
        .filter((p): p is ProductItem => p !== undefined)

    const handleAddToCart = (product: ProductItem) => {
        addItem({
            productId: product.id,
            name: product.name,
            image: product.image,
            price: product.salePrice,
            mrp: product.mrp,
            quantity: 1,
            slug: product.slug,
        })
        toast.success(`${product.name} added to cart!`)
    }

    const handleMoveAllToCart = () => {
        if (wishlistedProducts.length === 0) return
        wishlistedProducts.forEach(p => {
            addItem({
                productId: p.id,
                name: p.name,
                image: p.image,
                price: p.salePrice,
                mrp: p.mrp,
                quantity: 1,
                slug: p.slug,
            })
        })
        toast.success(`Moved ${wishlistedProducts.length} items to cart!`)
    }

    if (wishlistedProducts.length === 0) {
        return (
            <div className="min-h-[75vh] bg-brand-black flex flex-col items-center justify-center text-center px-4 py-16">
                <div className="w-20 h-20 rounded-full bg-brand-maroon-300/40 border border-brand-gold/20 flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-brand-gold/40" />
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Your Wishlist is Empty</h1>
                <p className="text-brand-silver/60 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    Explore our handcrafted collection of royal jewellery and save your favourite pieces to view or purchase later.
                </p>
                <Link
                    href="/shop"
                    className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest"
                >
                    Explore Royal Collection <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-brand-black py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-brand-gold/20">
                    <div>
                        <div className="inline-flex items-center gap-2 text-brand-gold/70 text-xs tracking-widest uppercase mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                            <span>Curated Selection</span>
                        </div>
                        <h1 className="font-display text-3xl font-bold text-gold-gradient">
                            My Wishlist ({wishlistedProducts.length})
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleMoveAllToCart}
                            className="btn-gold flex items-center gap-2 text-xs py-2.5 px-4"
                        >
                            <ShoppingBag className="w-3.5 h-3.5" /> Move All to Cart
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    <AnimatePresence>
                        {wishlistedProducts.map(product => {
                            const discount = Math.round(((product.mrp - product.salePrice) / product.mrp) * 100)
                            return (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.25 }}
                                    className="bg-[#1E0A10] border border-brand-gold/15 hover:border-brand-gold/40 rounded-sm overflow-hidden flex flex-col justify-between group transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative h-52 md:h-60 overflow-hidden bg-[#2A0A14]">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            quality={90}
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {discount > 0 && (
                                            <span className="absolute top-2.5 left-2.5 bg-brand-gold text-brand-maroon text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-wider">
                                                {discount}% OFF
                                            </span>
                                        )}
                                        <button
                                            onClick={() => {
                                                removeItem(product.id)
                                                toast.success('Removed from wishlist')
                                            }}
                                            className="absolute top-2.5 right-2.5 w-8 h-8 bg-black/60 hover:bg-red-500/80 text-white rounded-full flex items-center justify-center transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <p className="text-brand-gold/50 text-[10px] uppercase tracking-widest mb-1">
                                                {product.category}
                                            </p>
                                            <Link href={`/product/${product.slug}`}>
                                                <h3 className="text-white text-sm font-display font-semibold hover:text-brand-gold transition-colors line-clamp-2 leading-snug mb-2">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-1 mb-2.5">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-3 h-3"
                                                            fill={i < Math.floor(product.rating) ? '#C9A66B' : 'none'}
                                                            stroke="#C9A66B"
                                                            strokeWidth={1.5}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-brand-gold/40 text-[10px] ml-1">({product.reviews})</span>
                                            </div>

                                            <div className="flex items-baseline gap-2 mb-3">
                                                <span className="font-display font-bold text-brand-gold text-base">
                                                    {formatCurrency(product.salePrice)}
                                                </span>
                                                {product.mrp > product.salePrice && (
                                                    <span className="text-brand-silver/40 text-xs line-through">
                                                        {formatCurrency(product.mrp)}
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full btn-gold py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
