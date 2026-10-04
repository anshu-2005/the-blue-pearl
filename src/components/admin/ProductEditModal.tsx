'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
    X,
    Sparkles,
    Save,
    Image as ImageIcon,
    Check,
    Coins,
    Package,
    Tag,
    Scale,
    ShieldCheck,
    HelpCircle,
} from 'lucide-react'
import { ProductItem } from '@/lib/data'
import { useAdminProductStore } from '@/store/adminProductStore'
import { useAdminRatesStore } from '@/store/adminRatesStore'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

// 28 curated project images available for quick selection
const QUICK_IMAGES = [
    { label: 'Antique Oxidised Bangle', src: '/images/products/antique-oxidised-bangle-set.jpeg' },
    { label: 'Temple Gold Bangle Pair', src: '/images/products/temple-gold-bangle-pair.jpeg' },
    { label: 'Tribal Silver Cuff', src: '/images/products/tribal-silver-cuff-bangle.jpeg' },
    { label: 'Filigree Broad Bangle', src: '/images/products/filigree-broad-bangle.jpeg' },
    { label: 'Oxidised Kundan Bangles', src: '/images/products/oxidised-kundan-bangle-set-6.jpeg' },
    { label: 'Antique Brass Bangle', src: '/images/products/antique-brass-bangle-pair.jpeg' },
    { label: 'Temple Choker Necklace', src: '/images/products/temple-choker-necklace.jpeg' },
    { label: 'Layered Silver Necklace', src: '/images/products/layered-oxidised-silver-necklace.jpeg' },
    { label: 'Kundan Gold Choker', src: '/images/products/kundan-gold-choker.jpeg' },
    { label: 'Filigree Pendant Chain', src: '/images/products/filigree-pendant-chain.jpeg' },
    { label: 'Antique Coin Necklace', src: '/images/products/antique-coin-necklace.jpeg' },
    { label: 'Temple Lakshmi Necklace', src: '/images/products/temple-lakshmi-necklace.jpeg' },
    { label: 'Oxidised Jhumka Earrings', src: '/images/products/oxidised-jhumka-earrings.jpeg' },
    { label: 'Gold Filigree Studs', src: '/images/products/gold-filigree-studs.jpeg' },
    { label: 'Temple Chandelier Earrings', src: '/images/products/temple-chandelier-earrings.jpeg' },
    { label: 'Silver Tassel Earrings', src: '/images/products/silver-tassel-earrings.jpeg' },
    { label: 'Kundan Drop Earrings', src: '/images/products/kundan-drop-earrings.jpeg' },
    { label: 'Antique Peacock Earrings', src: '/images/products/antique-peacock-earrings.jpeg' },
    { label: 'Oxidised Adjustable Ring', src: '/images/products/oxidised-adjustable-ring.jpeg' },
    { label: 'Gold Filigree Statement Ring', src: '/images/products/gold-filigree-statement-ring.jpeg' },
    { label: 'Temple Toe Ring Pair', src: '/images/products/temple-toe-ring-pair.jpeg' },
    { label: 'Antique Silver Ring Set', src: '/images/products/antique-silver-ring-set.jpeg' },
    { label: 'Bridal Bangle Set of 12', src: '/images/products/bridal-gold-plated-bangle-set-12.jpeg' },
    { label: 'Bridal Necklace & Earring Set', src: '/images/products/bridal-necklace-earring-set.jpeg' },
    { label: 'Bridal Maangtikka & Jhumka', src: '/images/products/bridal-maangtikka-jhumka-combo.jpeg' },
    { label: 'Temple Anklet Pair', src: '/images/products/temple-anklet-pair.jpeg' },
    { label: 'Silver Bells Anklet', src: '/images/products/silver-bells-anklet-pair.jpeg' },
    { label: 'Oxidised Maangtikka', src: '/images/products/oxidised-maangtikka.jpeg' },
]

const CATEGORIES = ['Bangles', 'Necklaces', 'Earrings', 'Rings', 'Bridal', 'Anklets', 'Maangtikka', 'Combos']
const PURITIES: ProductItem['purity'][] = ['22K', '18K', '24K', '925 Silver', 'Antique Brass']

interface ProductEditModalProps {
    isOpen: boolean
    onClose: () => void
    productToEdit?: ProductItem | null
}

export default function ProductEditModal({ isOpen, onClose, productToEdit }: ProductEditModalProps) {
    const addProduct = useAdminProductStore((s) => s.addProduct)
    const updateProduct = useAdminProductStore((s) => s.updateProduct)
    const rates = useAdminRatesStore((s) => s.rates)

    // Form fields
    const [name, setName] = useState('')
    const [category, setCategory] = useState('Bangles')
    const [purity, setPurity] = useState<ProductItem['purity']>('22K')
    const [material, setMaterial] = useState('22K Gold Plated Brass')
    const [mrp, setMrp] = useState<number>(2499)
    const [salePrice, setSalePrice] = useState<number>(1899)
    const [stock, setStock] = useState<number>(12)
    const [weight, setWeight] = useState<number>(45)
    const [netMetalWeight, setNetMetalWeight] = useState<number>(40)
    const [makingChargePerGram, setMakingChargePerGram] = useState<number>(150)
    const [stoneCharges, setStoneCharges] = useState<number>(0)
    const [image, setImage] = useState<string>('/images/products/temple-gold-bangle-pair.jpeg')
    const [dimensions, setDimensions] = useState('Standard Atelier Fit')
    const [bisHallmarkNumber, setBisHallmarkNumber] = useState('BIS-916-TBP-NEW')
    const [certificateType, setCertificateType] = useState<ProductItem['certificateType']>('BIS Hallmark 916')
    const [featured, setFeatured] = useState(false)
    const [bestSeller, setBestSeller] = useState(false)
    const [description, setDescription] = useState('')
    const [careInstructions, setCareInstructions] = useState('')
    const [tagsInput, setTagsInput] = useState('Traditional, Handcrafted, Royal')

    const [showImagePicker, setShowImagePicker] = useState(false)

    // Populate form if editing
    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name)
            setCategory(productToEdit.category)
            setPurity(productToEdit.purity)
            setMaterial(productToEdit.material)
            setMrp(productToEdit.mrp)
            setSalePrice(productToEdit.salePrice)
            setStock(productToEdit.stock)
            setWeight(productToEdit.weight)
            setNetMetalWeight(productToEdit.netMetalWeight)
            setMakingChargePerGram(productToEdit.makingChargePerGram || 120)
            setStoneCharges(productToEdit.stoneCharges || 0)
            setImage(productToEdit.image)
            setDimensions(productToEdit.dimensions || '')
            setBisHallmarkNumber(productToEdit.bisHallmarkNumber || '')
            setCertificateType(productToEdit.certificateType || 'BIS Hallmark 916')
            setFeatured(!!productToEdit.featured)
            setBestSeller(!!productToEdit.bestSeller)
            setDescription(productToEdit.description || '')
            setCareInstructions(productToEdit.careInstructions || '')
            setTagsInput((productToEdit.tags || []).join(', '))
        } else {
            // Defaults for new product
            setName('')
            setCategory('Bangles')
            setPurity('22K')
            setMaterial('22K Micro Gold Plated Brass')
            setMrp(2999)
            setSalePrice(1999)
            setStock(15)
            setWeight(50)
            setNetMetalWeight(45)
            setMakingChargePerGram(150)
            setStoneCharges(0)
            setImage('/images/products/temple-gold-bangle-pair.jpeg')
            setDimensions('Inner Diameter: 60mm | Standard Fit')
            setBisHallmarkNumber(`BIS-916-TBP-${Math.floor(100 + Math.random() * 900)}`)
            setCertificateType('BIS Hallmark 916')
            setFeatured(false)
            setBestSeller(false)
            setDescription('Exquisitely handcrafted jewellery inspired by royal heritage motifs.')
            setCareInstructions('Store in velvet pouch. Avoid direct moisture, sprays and harsh detergents.')
            setTagsInput('Royal, Festive, 22K Plated, Heritage')
        }
    }, [productToEdit, isOpen])

    if (!isOpen) return null

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Please enter product name')
            return
        }

        const tags = tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)

        const productPayload: Omit<ProductItem, 'id'> = {
            name: name.trim(),
            slug: name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, ''),
            category,
            purity,
            purityOptions: (purity === 'Antique Brass' ? ['18K', '22K'] : [purity]) as ('18K' | '22K' | '24K' | '925 Silver')[],
            material,
            mrp: Number(mrp),
            salePrice: Number(salePrice),
            stock: Number(stock),
            weight: Number(weight),
            netMetalWeight: Number(netMetalWeight),
            makingChargePerGram: Number(makingChargePerGram),
            stoneCharges: Number(stoneCharges),
            image,
            images: [image],
            dimensions,
            bisHallmarkNumber,
            certificateType,
            featured,
            bestSeller,
            description,
            careInstructions,
            tags,
            rating: productToEdit ? productToEdit.rating : 5.0,
            reviews: productToEdit ? productToEdit.reviews : 1,
        }

        if (productToEdit) {
            updateProduct(productToEdit.id, productPayload)
            toast.success(`Updated "${name}" successfully!`)
        } else {
            addProduct(productPayload)
            toast.success(`Added "${name}" to catalogue!`)
        }

        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#14050D] border border-brand-gold/30 rounded-lg shadow-2xl flex flex-col overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gold/20 bg-[#1A0711]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-white font-display text-lg font-bold">
                                {productToEdit ? `Edit: ${productToEdit.name}` : 'Add New Atelier Jewel'}
                            </h2>
                            <p className="text-xs text-brand-silver/60">
                                {productToEdit ? 'Modify specifications, prices, images and stock levels' : 'Register a new piece into the catalogue'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-brand-silver/60 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-brand-gold tracking-widest border-b border-brand-gold/15 pb-1">
                            1. Product Identity
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Jewellery Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Royal Kundan Jadau Choker"
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c} className="bg-[#1C060F]">
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                        Metal Purity *
                                    </label>
                                    <select
                                        value={purity}
                                        onChange={(e) => setPurity(e.target.value as ProductItem['purity'])}
                                        className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none"
                                    >
                                        {PURITIES.map((p) => (
                                            <option key={p} value={p} className="bg-[#1C060F]">
                                                {p}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                Material Composition Description
                            </label>
                            <input
                                type="text"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                placeholder="e.g. 22K Gold Plated Solid Brass with Red Jadau Enamel"
                                className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none"
                            />
                        </div>
                    </div>

                    {/* Image Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-brand-gold/15 pb-1">
                            <h3 className="text-xs uppercase font-bold text-brand-gold tracking-widest">
                                2. Product Image
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowImagePicker(!showImagePicker)}
                                className="text-xs text-brand-gold hover:underline flex items-center gap-1 font-semibold"
                            >
                                <ImageIcon className="w-3.5 h-3.5" />
                                <span>{showImagePicker ? 'Hide Gallery' : 'Select from 28 Curated Images'}</span>
                            </button>
                        </div>

                        {/* Image Preview & URL field */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden border border-brand-gold/40 shrink-0 bg-black/60">
                                <Image
                                    src={image || '/images/products/temple-gold-bangle-pair.jpeg'}
                                    alt="Preview"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Primary Image Path / URL
                                </label>
                                <input
                                    type="text"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="/images/products/..."
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                        </div>

                        {/* Quick Image Picker Palette */}
                        {showImagePicker && (
                            <div className="p-3 bg-black/60 border border-brand-gold/20 rounded-lg max-h-48 overflow-y-auto">
                                <p className="text-[11px] text-brand-silver/60 mb-2 font-medium">
                                    Click any image below to use as this jewel's primary photograph:
                                </p>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                    {QUICK_IMAGES.map((item, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setImage(item.src)
                                                toast.success(`Selected ${item.label}`)
                                            }}
                                            className={`relative aspect-square rounded overflow-hidden border transition ${
                                                image === item.src
                                                    ? 'border-brand-gold ring-2 ring-brand-gold/60 scale-95'
                                                    : 'border-brand-gold/20 hover:border-brand-gold/60 opacity-80 hover:opacity-100'
                                            }`}
                                            title={item.label}
                                        >
                                            <Image src={item.src} alt={item.label} fill unoptimized className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pricing & Valuation */}
                    <div className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-brand-gold tracking-widest border-b border-brand-gold/15 pb-1">
                            3. Pricing, Valuation & Inventory
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Maximum Retail (MRP) ₹
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={mrp}
                                    onChange={(e) => setMrp(Number(e.target.value))}
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Sale Price (Patron Price) ₹ *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(Number(e.target.value))}
                                    className="w-full bg-black/50 border border-brand-gold/40 rounded px-3 py-2 text-xs text-brand-gold font-bold focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Available Stock (Units) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={stock}
                                    onChange={(e) => setStock(Number(e.target.value))}
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Gross Weight (g)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={weight}
                                    onChange={(e) => setWeight(Number(e.target.value))}
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Net Metal Weight (g)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={netMetalWeight}
                                    onChange={(e) => setNetMetalWeight(Number(e.target.value))}
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Making Charge / Gram (₹)
                                </label>
                                <input
                                    type="number"
                                    value={makingChargePerGram}
                                    onChange={(e) => setMakingChargePerGram(Number(e.target.value))}
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Stone Charges (₹)
                                </label>
                                <input
                                    type="number"
                                    value={stoneCharges}
                                    onChange={(e) => setStoneCharges(Number(e.target.value))}
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Certifications & Badges */}
                    <div className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-brand-gold tracking-widest border-b border-brand-gold/15 pb-1">
                            4. Certifications & Badges
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    BIS Hallmark / Assay Certificate ID
                                </label>
                                <input
                                    type="text"
                                    value={bisHallmarkNumber}
                                    onChange={(e) => setBisHallmarkNumber(e.target.value)}
                                    placeholder="e.g. BIS-916-TBP-01"
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                    Certificate Type
                                </label>
                                <select
                                    value={certificateType}
                                    onChange={(e) => setCertificateType(e.target.value as ProductItem['certificateType'])}
                                    className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none"
                                >
                                    <option value="BIS Hallmark 916" className="bg-[#1C060F]">BIS Hallmark 916</option>
                                    <option value="IGI Certified" className="bg-[#1C060F]">IGI Certified</option>
                                    <option value="Govt Assayed 925" className="bg-[#1C060F]">Govt Assayed 925</option>
                                    <option value="GIA Certified" className="bg-[#1C060F]">GIA Certified</option>
                                </select>
                            </div>
                        </div>

                        {/* Visibility Toggles */}
                        <div className="flex flex-wrap items-center gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                    className="rounded border-brand-gold/40 text-brand-gold accent-brand-gold w-4 h-4"
                                />
                                <span className="text-xs text-white font-medium">Show in "Featured Collection"</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={bestSeller}
                                    onChange={(e) => setBestSeller(e.target.checked)}
                                    className="rounded border-brand-gold/40 text-brand-gold accent-brand-gold w-4 h-4"
                                />
                                <span className="text-xs text-white font-medium">Mark as "Best Seller"</span>
                            </label>
                        </div>
                    </div>

                    {/* Descriptive Details */}
                    <div className="space-y-4">
                        <h3 className="text-xs uppercase font-bold text-brand-gold tracking-widest border-b border-brand-gold/15 pb-1">
                            5. Curatorial Description & Tags
                        </h3>

                        <div>
                            <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                Story & Description
                            </label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the royal heritage, craftsmanship, motifs and finishing..."
                                className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-brand-silver/80 font-medium mb-1">
                                Search Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="e.g. Bangles, Antique, Temple, Gold, Navratri"
                                className="w-full bg-black/50 border border-brand-gold/25 rounded px-3 py-2 text-xs text-white focus:border-brand-gold outline-none"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded border border-brand-gold/30 hover:border-brand-gold text-brand-silver hover:text-white text-xs uppercase font-bold tracking-wider transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-gold py-2.5 px-6 text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg"
                        >
                            <Save className="w-4 h-4" />
                            <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
