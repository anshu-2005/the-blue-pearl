'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Heart,
    ShoppingBag,
    Star,
    Minus,
    Plus,
    Package,
    RotateCcw,
    Shield,
    ChevronRight,
    Award,
    Ruler,
    Sparkles,
    Scale,
    Camera,
    Calendar,
    Check,
    HelpCircle,
} from 'lucide-react'
import { ProductItem, LIVE_GOLD_RATES } from '@/lib/data'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useComparisonStore } from '@/store/comparisonStore'
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

// New Subcomponents
import ImageZoomViewer from '@/components/product/ImageZoomViewer'
import DynamicPriceBreakdown from '@/components/product/DynamicPriceBreakdown'
import EngravingCustomizer from '@/components/product/EngravingCustomizer'
import CompleteTheLookBundle from '@/components/product/CompleteTheLookBundle'
import ProductReviewsSection from '@/components/product/ProductReviewsSection'
import RecentlyViewedSection from '@/components/product/RecentlyViewedSection'
import SizeGuideModal from '@/components/common/SizeGuideModal'
import CertificateVerifyModal from '@/components/common/CertificateVerifyModal'
import VirtualTryOnModal from '@/components/common/VirtualTryOnModal'
import AppointmentModal from '@/components/common/AppointmentModal'

interface ProductDetailClientProps {
    product: ProductItem
    related: ProductItem[]
}

const TABS = ['Description & Artistry', 'Product Specifications', 'Care & Maintenance', 'Shipping & Returns']

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
    const [qty, setQty] = useState(1)
    const [tab, setTab] = useState('Description & Artistry')
    const [pincode, setPincode] = useState('')

    // Jewellery specific selections
    const purityOptions = product.purityOptions || ['22K', '18K', '925 Silver']
    const [selectedPurity, setSelectedPurity] = useState<'18K' | '22K' | '24K' | '925 Silver'>(
        (product.purity as any) || '22K'
    )
    const [selectedSize, setSelectedSize] = useState(
        product.availableSizes ? product.availableSizes[0] : 'Standard'
    )
    const [engravingText, setEngravingText] = useState('')
    const [fontStyle, setFontStyle] = useState('font-serif')

    // Modals
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
    const [certModalOpen, setCertModalOpen] = useState(false)
    const [tryOnOpen, setTryOnOpen] = useState(false)
    const [appointModalOpen, setAppointModalOpen] = useState(false)

    // Global Stores
    const addItem = useCartStore(s => s.addItem)
    const toggleWishlist = useWishlistStore(s => s.toggle)
    const isWishlisted = useWishlistStore(s => s.has(product.id))
    const addToCompare = useComparisonStore(s => s.addToCompare)
    const removeFromCompare = useComparisonStore(s => s.removeFromCompare)
    const isCompared = useComparisonStore(s => s.has(product.id))
    const addRecentlyViewed = useRecentlyViewedStore(s => s.addSlug)

    // Track recently viewed
    useEffect(() => {
        if (product.slug) {
            addRecentlyViewed(product.slug)
        }
    }, [product.slug, addRecentlyViewed])

    // Dynamic price recalculation based on selected purity
    let priceMultiplier = 1
    if (selectedPurity === '24K') priceMultiplier = 1.15
    if (selectedPurity === '18K') priceMultiplier = 0.88
    if (selectedPurity === '925 Silver') priceMultiplier = product.purity.includes('Silver') ? 1 : 0.65

    const dynamicSalePrice = Math.round(product.salePrice * priceMultiplier)
    const dynamicMrp = Math.round(product.mrp * priceMultiplier)
    const discount = Math.round(((dynamicMrp - dynamicSalePrice) / dynamicMrp) * 100)

    const handleAddToCart = () => {
        addItem({
            productId: `${product.id}-${selectedPurity}-${selectedSize}`,
            name: `${product.name} (${selectedPurity}${product.hasSizeSelector ? `, ${selectedSize}` : ''}${engravingText ? ` · Engraved "${engravingText}"` : ''})`,
            image: product.image,
            price: dynamicSalePrice,
            mrp: dynamicMrp,
            quantity: qty,
            slug: product.slug,
        })
        toast.success(`${product.name} added to cart!`)
    }

    const handleToggleCompare = () => {
        if (isCompared) {
            removeFromCompare(product.id)
            toast.success('Removed from comparison')
        } else {
            addToCompare(product.id)
            toast.success('Added to comparison bar')
        }
    }

    return (
        <div className="min-h-screen bg-brand-black">
            {/* Breadcrumbs */}
            <div className="bg-brand-maroon/90 border-b border-brand-gold/20 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-xs text-brand-silver/60">
                        <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-brand-gold transition-colors">
                            {product.category}
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-brand-gold/80 truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column: Image Zoom Viewer & Interactive Tools */}
                    <div>
                        <ImageZoomViewer
                            images={product.images && product.images.length > 0 ? product.images : [product.image]}
                            name={product.name}
                            discount={discount}
                            isWishlisted={isWishlisted}
                            onToggleWishlist={() => toggleWishlist(product.id)}
                        />

                        {/* Interactive Feature Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
                            <button
                                type="button"
                                onClick={() => setTryOnOpen(true)}
                                className="bg-brand-maroon-300/50 border border-brand-gold/30 hover:border-brand-gold text-brand-gold py-2 px-3 rounded-xs text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <Camera className="w-3.5 h-3.5" /> Virtual Try-On
                            </button>
                            <button
                                type="button"
                                onClick={() => setCertModalOpen(true)}
                                className="bg-brand-maroon-300/50 border border-brand-gold/30 hover:border-brand-gold text-brand-gold py-2 px-3 rounded-xs text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                            >
                                <Award className="w-3.5 h-3.5" /> Verify Hallmark
                            </button>
                            <button
                                type="button"
                                onClick={() => setAppointModalOpen(true)}
                                className="bg-brand-maroon-300/50 border border-brand-gold/30 hover:border-brand-gold text-brand-gold py-2 px-3 rounded-xs text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors col-span-2 sm:col-span-1"
                            >
                                <Calendar className="w-3.5 h-3.5" /> Video Consult
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Details & Customizers */}
                    <div>
                        {/* Category & Hallmark Badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-brand-gold/60 text-xs uppercase tracking-[0.25em] font-sans">
                                {product.category}
                            </span>
                            {product.certificateType && (
                                <button
                                    onClick={() => setCertModalOpen(true)}
                                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full hover:bg-emerald-500/20 transition-colors"
                                >
                                    <Award className="w-3 h-3" />
                                    <span>{product.certificateType}</span>
                                </button>
                            )}
                        </div>

                        <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 leading-snug">
                            {product.name}
                        </h1>

                        {/* Ratings & Comparison Toggle */}
                        <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-brand-gold/15">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4"
                                            fill={i < Math.floor(product.rating) ? '#C9A66B' : 'none'}
                                            stroke="#C9A66B"
                                        />
                                    ))}
                                </div>
                                <span className="text-brand-gold font-semibold text-sm">{product.rating}</span>
                                <span className="text-brand-silver/40 text-xs">({product.reviews} reviews)</span>
                            </div>

                            <button
                                onClick={handleToggleCompare}
                                className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                                    isCompared
                                        ? 'bg-brand-gold text-brand-maroon border-brand-gold font-bold'
                                        : 'border-brand-gold/30 text-brand-silver/70 hover:border-brand-gold'
                                }`}
                            >
                                <Scale className="w-3.5 h-3.5" />
                                <span>{isCompared ? 'Compared ✓' : 'Add to Compare'}</span>
                            </button>
                        </div>

                        {/* Price Section */}
                        <div className="flex items-baseline gap-3 mb-4">
                            <span className="font-display text-3xl md:text-4xl font-bold text-brand-gold">
                                {formatCurrency(dynamicSalePrice)}
                            </span>
                            {dynamicMrp > dynamicSalePrice && (
                                <>
                                    <span className="text-brand-silver/40 text-lg line-through">
                                        {formatCurrency(dynamicMrp)}
                                    </span>
                                    <span className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                                        Save {formatCurrency(dynamicMrp - dynamicSalePrice)} ({discount}% OFF)
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="text-brand-silver/50 text-xs -mt-2 mb-5">
                            Price inclusive of 3% GST · Insured Doorstep Delivery
                        </p>

                        {/* 1. Metal & Purity Selector */}
                        <div className="mb-5 pb-5 border-b border-brand-gold/15">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-brand-silver/80 text-xs font-semibold uppercase tracking-wider">
                                    Select Gold / Silver Purity:
                                </span>
                                <button
                                    onClick={() => setCertModalOpen(true)}
                                    className="text-brand-gold/70 hover:text-brand-gold text-[11px] underline"
                                >
                                    Purity Guide
                                </button>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {purityOptions.map(purity => (
                                    <button
                                        key={purity}
                                        type="button"
                                        onClick={() => setSelectedPurity(purity as any)}
                                        className={`text-xs px-3.5 py-2 rounded-xs font-semibold border transition-all flex items-center gap-1.5 ${
                                            selectedPurity === purity
                                                ? 'bg-brand-gold text-brand-maroon border-brand-gold shadow-md font-bold'
                                                : 'border-brand-gold/25 text-brand-silver/80 hover:border-brand-gold/60'
                                        }`}
                                    >
                                        <span>{purity}</span>
                                        {selectedPurity === purity && <Check className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Ring / Bangle Size Selector (if applicable) */}
                        {product.availableSizes && (
                            <div className="mb-5 pb-5 border-b border-brand-gold/15">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-brand-silver/80 text-xs font-semibold uppercase tracking-wider">
                                        Select Size:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setSizeGuideOpen(true)}
                                        className="text-brand-gold text-[11px] flex items-center gap-1 hover:underline"
                                    >
                                        <Ruler className="w-3 h-3" /> Size Guide
                                    </button>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {product.availableSizes.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`text-xs px-3 py-1.5 rounded-xs border transition-colors ${
                                                selectedSize === size
                                                    ? 'bg-brand-maroon-300 text-brand-gold border-brand-gold font-bold ring-1 ring-brand-gold'
                                                    : 'border-brand-gold/20 text-brand-silver/70 hover:border-brand-gold'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 3. Custom Engraving */}
                        {product.hasEngraving && (
                            <EngravingCustomizer
                                engravingText={engravingText}
                                onChangeText={setEngravingText}
                                fontStyle={fontStyle}
                                onChangeFont={setFontStyle}
                            />
                        )}

                        {/* 4. Dynamic Price Breakdown Component */}
                        <DynamicPriceBreakdown product={product} selectedPurity={selectedPurity} />

                        {/* 5. Quantity & Purchase Buttons */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex items-center border border-brand-gold/30 rounded-xs bg-[#1A050E]">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="px-3 py-2.5 text-brand-gold hover:bg-brand-maroon-300"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 text-white font-semibold font-mono text-sm">{qty}</span>
                                <button
                                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                                    className="px-3 py-2.5 text-brand-gold hover:bg-brand-maroon-300"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn-gold flex-1 py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                            >
                                <ShoppingBag className="w-4 h-4" /> Add to Cart
                            </button>
                        </div>

                        {/* Buy Now & WhatsApp Chat */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            <Link
                                href="/checkout"
                                onClick={handleAddToCart}
                                className="btn-outline-gold text-center py-3 flex items-center justify-center font-bold text-xs uppercase tracking-wider"
                            >
                                Instant Buy Now
                            </Link>
                            <a
                                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                                    `Hi! I am interested in "${product.name}" (${selectedPurity}, Price: ₹${dynamicSalePrice.toLocaleString('en-IN')}). Could you please share a video preview or more details?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366]/15 border border-[#25D366]/40 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-semibold py-3 px-4 rounded-xs flex items-center justify-center gap-2 transition-colors"
                            >
                                💬 Enquire on WhatsApp
                            </a>
                        </div>

                        {/* 3D Configurator Link */}
                        <Link
                            href={`/design/${product.slug}`}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-brand-gold/40 text-brand-gold rounded hover:bg-brand-gold/10 hover:text-white transition-all duration-300 mb-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-maroon-300 via-brand-maroon to-brand-black shadow-inner text-xs font-semibold uppercase tracking-wider"
                        >
                            <Sparkles className="w-4 h-4" /> Open 3D Customizer & Diamond Builder
                        </Link>

                        {/* Delivery Pincode Check */}
                        <div className="bg-brand-maroon-300/40 rounded-sm p-4 border border-brand-gold/15">
                            <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-2">
                                Check Estimated Delivery
                            </p>
                            <div className="flex gap-2">
                                <input
                                    value={pincode}
                                    onChange={e => setPincode(e.target.value.replace(/\D/, '').slice(0, 6))}
                                    placeholder="Enter 6-digit pincode"
                                    className="input-gold flex-1 text-xs py-2 font-mono"
                                />
                                <button
                                    onClick={() => pincode.length === 6 && toast.success('Express Delivery available: Arrives in 3-4 days!')}
                                    className="btn-gold py-2 px-4 text-xs font-bold uppercase"
                                >
                                    Check
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coordinated "Complete the Look" Bundles */}
                <CompleteTheLookBundle currentProduct={product} />

                {/* Tabs (Specifications, Artistry, Care, Shipping) */}
                <div className="mt-12 border-t border-brand-gold/20 pt-8">
                    <div className="flex gap-2 border-b border-brand-gold/20 mb-6 overflow-x-auto no-scrollbar">
                        {TABS.map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                                    tab === t
                                        ? 'text-brand-gold border-brand-gold font-bold'
                                        : 'text-brand-silver/50 border-transparent hover:text-brand-gold'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl text-sm leading-relaxed text-brand-silver/80">
                        {tab === 'Description & Artistry' && (
                            <div className="space-y-4">
                                <p>{product.description}</p>
                                <p className="text-brand-silver/60">
                                    Each piece from The Blue Pearl is cast in certified pure metal alloys and hand-chiseled by generational goldsmiths. Every curve, filigree wire, and gemstone setting is tested for structural integrity and timeless luster.
                                </p>
                            </div>
                        )}

                        {tab === 'Product Specifications' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1C0810] border border-brand-gold/15 p-5 rounded-sm">
                                <div>
                                    <span className="text-brand-silver/40 text-[10px] uppercase block">Gross Weight</span>
                                    <span className="text-white font-mono font-semibold">{product.weight} g approx.</span>
                                </div>
                                <div>
                                    <span className="text-brand-silver/40 text-[10px] uppercase block">Net Metal Weight</span>
                                    <span className="text-white font-mono font-semibold">{product.netMetalWeight || product.weight} g</span>
                                </div>
                                <div>
                                    <span className="text-brand-silver/40 text-[10px] uppercase block">Purity Standard</span>
                                    <span className="text-brand-gold font-semibold">{selectedPurity} ({product.material})</span>
                                </div>
                                <div>
                                    <span className="text-brand-silver/40 text-[10px] uppercase block">Hallmark Certificate ID</span>
                                    <span className="text-white font-mono">{product.bisHallmarkNumber || 'BIS-916-TBP-01'}</span>
                                </div>
                                {product.diamondSpecs && (
                                    <>
                                        <div>
                                            <span className="text-brand-silver/40 text-[10px] uppercase block">Diamond 4Cs (Cut / Clarity)</span>
                                            <span className="text-white font-semibold">{product.diamondSpecs.cut} · {product.diamondSpecs.clarity}</span>
                                        </div>
                                        <div>
                                            <span className="text-brand-silver/40 text-[10px] uppercase block">Diamond Color & Carat</span>
                                            <span className="text-white font-semibold">Color {product.diamondSpecs.color} · {product.diamondSpecs.carat} ct</span>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <span className="text-brand-silver/40 text-[10px] uppercase block">Dimensions & Fit</span>
                                    <span className="text-white">{product.dimensions || 'Standard Indian Ergonomic Contour'}</span>
                                </div>
                            </div>
                        )}

                        {tab === 'Care & Maintenance' && (
                            <div className="space-y-3">
                                <p>✦ {product.careInstructions}</p>
                                <p>✦ Clean gently with a lint-free microfiber cloth after every wear before storing.</p>
                                <p>✦ Store each jewellery piece separately in airtight zip-lock covers or soft velvet boxes to prevent chemical oxidation or abrasions.</p>
                            </div>
                        )}

                        {tab === 'Shipping & Returns' && (
                            <div className="space-y-3">
                                <p>✦ <strong>Complimentary Insured Shipping:</strong> Free shipping across India on orders above ₹2,999.</p>
                                <p>✦ <strong>Hassle-Free 7-Day Returns:</strong> Return or exchange unworn pieces in original packaging within 7 days of delivery.</p>
                                <p>✦ <strong>Lifetime Plating & Polish Warranty:</strong> Contact our support concierge for complimentary re-polishing servicing.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer Reviews & Photo Ratings Section */}
                <ProductReviewsSection product={product} />

                {/* Recently Viewed Products Section */}
                <RecentlyViewedSection currentSlug={product.slug} />

                {/* Modals */}
                <SizeGuideModal
                    isOpen={sizeGuideOpen}
                    onClose={() => setSizeGuideOpen(false)}
                    defaultType={product.category.toLowerCase().includes('ring') ? 'ring' : 'bangle'}
                />

                <CertificateVerifyModal
                    isOpen={certModalOpen}
                    onClose={() => setCertModalOpen(false)}
                    initialCertId={product.bisHallmarkNumber || 'BIS-916-TBP-01'}
                />

                <VirtualTryOnModal
                    isOpen={tryOnOpen}
                    onClose={() => setTryOnOpen(false)}
                    product={product}
                />

                <AppointmentModal
                    isOpen={appointModalOpen}
                    onClose={() => setAppointModalOpen(false)}
                />
            </div>
        </div>
    )
}
