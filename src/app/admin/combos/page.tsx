'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Package,
    Plus,
    Edit2,
    Trash2,
    Eye,
    Check,
    X,
    Sparkles,
    Tag,
    Layers,
    ArrowLeft,
    TrendingUp,
    ShoppingBag,
    CheckCircle2,
} from 'lucide-react'
import { useComboStore } from '@/store/comboStore'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { ComboItem } from '@/lib/comboData'
import { formatCurrency } from '@/lib/utils'
import InspectableImage from '@/components/admin/InspectableImage'
import toast from 'react-hot-toast'

export default function AdminCombosPage() {
    const combos = useComboStore(s => s.combos)
    const addCombo = useComboStore(s => s.addCombo)
    const updateCombo = useComboStore(s => s.updateCombo)
    const deleteCombo = useComboStore(s => s.deleteCombo)
    const toggleActive = useComboStore(s => s.toggleActive)
    const resetToDefault = useComboStore(s => s.resetToDefault)

    const [mounted, setMounted] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingCombo, setEditingCombo] = useState<ComboItem | null>(null)

    // Form state
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [badge, setBadge] = useState('MEGA VALUE COMBO')
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
    const [customPrice, setCustomPrice] = useState<number>(0)
    const [productSearch, setProductSearch] = useState('')

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="min-h-screen bg-brand-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const openCreateModal = () => {
        setEditingCombo(null)
        setTitle('')
        setDescription('')
        setBadge('EXCLUSIVE COMBO')
        setSelectedProductIds([])
        setCustomPrice(0)
        setModalOpen(true)
    }

    const openEditModal = (combo: ComboItem) => {
        setEditingCombo(combo)
        setTitle(combo.title)
        setDescription(combo.description)
        setBadge(combo.badge)
        setSelectedProductIds(combo.productIds)
        setCustomPrice(combo.customPrice)
        setModalOpen(true)
    }

    const toggleSelectProduct = (id: string) => {
        setSelectedProductIds(prev => {
            const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            // Auto calculate suggested discount if creating fresh
            const products = next.map(pid => ALL_PRODUCTS.find(p => p.id === pid)).filter(Boolean) as ProductItem[]
            const stdTotal = products.reduce((sum, p) => sum + p.salePrice, 0)
            if (customPrice === 0 || !editingCombo) {
                setCustomPrice(Math.round(stdTotal * 0.85)) // Default 15% combo discount
            }
            return next
        })
    }

    // Selected product objects
    const selectedProducts = selectedProductIds
        .map(id => ALL_PRODUCTS.find(p => p.id === id))
        .filter((p): p is ProductItem => p !== undefined)

    const standardTotalSale = selectedProducts.reduce((sum, p) => sum + p.salePrice, 0)
    const standardTotalMrp = selectedProducts.reduce((sum, p) => sum + p.mrp, 0)
    const comboSavings = Math.max(0, standardTotalSale - customPrice)
    const savingsPercent = standardTotalSale > 0 ? Math.round((comboSavings / standardTotalSale) * 100) : 0

    const handleSaveCombo = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || selectedProductIds.length < 2 || customPrice <= 0) {
            toast.error('Please add a title, select at least 2 products, and set a valid combo price.')
            return
        }

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')

        if (editingCombo) {
            updateCombo(editingCombo.id, {
                title,
                slug,
                description,
                badge,
                productIds: selectedProductIds,
                customPrice,
            })
            toast.success(`Combo "${title}" updated successfully!`)
        } else {
            addCombo({
                title,
                slug,
                description,
                badge,
                productIds: selectedProductIds,
                customPrice,
                isActive: true,
                sortOrder: combos.length + 1,
            })
            toast.success(`New Combo "${title}" created successfully!`)
        }

        setModalOpen(false)
    }

    const filteredCatalog = ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.material.toLowerCase().includes(productSearch.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#110308] text-white">
            {/* Topbar */}
            <div className="bg-[#1C0710] border-b border-brand-gold/25 py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/shop"
                            className="w-9 h-9 rounded-full bg-brand-maroon-300 border border-brand-gold/30 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-maroon transition-colors"
                            title="Back to Shop"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-brand-gold text-[10px] tracking-widest uppercase font-semibold">
                                <Sparkles className="w-3 h-3" />
                                <span>Admin Power Center</span>
                            </div>
                            <h1 className="font-display text-2xl font-bold text-gold-gradient">
                                Jewellery Combo & Bundle Manager
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/combos"
                            className="btn-outline-gold text-xs py-2.5 px-4 flex items-center gap-1.5"
                            target="_blank"
                        >
                            <Eye className="w-4 h-4" /> View Live Combos Page
                        </Link>
                        <button
                            onClick={openCreateModal}
                            className="btn-gold text-xs py-2.5 px-5 font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
                        >
                            <Plus className="w-4 h-4" /> Create New Combo
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Metrics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#1C0810] border border-brand-gold/20 p-5 rounded-sm flex items-center justify-between">
                        <div>
                            <p className="text-brand-silver/60 text-xs uppercase tracking-wider">Active Combos</p>
                            <p className="font-display text-2xl font-bold text-brand-gold mt-1">
                                {combos.filter(c => c.isActive).length} / {combos.length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                            <Layers className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-[#1C0810] border border-brand-gold/20 p-5 rounded-sm flex items-center justify-between">
                        <div>
                            <p className="text-brand-silver/60 text-xs uppercase tracking-wider">Avg. Combo Savings</p>
                            <p className="font-display text-2xl font-bold text-emerald-400 mt-1">
                                ~18% OFF
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-[#1C0810] border border-brand-gold/20 p-5 rounded-sm flex items-center justify-between">
                        <div>
                            <p className="text-brand-silver/60 text-xs uppercase tracking-wider">Catalogue Items</p>
                            <p className="font-display text-2xl font-bold text-white mt-1">
                                {ALL_PRODUCTS.length} Royal Pieces
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-brand-maroon-300 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Combos Table / Cards */}
                <div className="bg-[#1C0810] border border-brand-gold/20 rounded-sm overflow-hidden">
                    <div className="p-5 border-b border-brand-gold/15 flex items-center justify-between">
                        <div>
                            <h2 className="font-display text-lg font-bold text-white">Live Custom Combos</h2>
                            <p className="text-brand-silver/50 text-xs mt-0.5">
                                Any changes made here are instantly reflected on the customer-facing website.
                            </p>
                        </div>
                        <button
                            onClick={resetToDefault}
                            className="text-brand-silver/50 hover:text-brand-gold text-xs underline"
                        >
                            Reset to Defaults
                        </button>
                    </div>

                    <div className="divide-y divide-brand-gold/10">
                        {combos.map(combo => {
                            const products = combo.productIds
                                .map(id => ALL_PRODUCTS.find(p => p.id === id))
                                .filter((p): p is ProductItem => p !== undefined)

                            const stdPrice = products.reduce((sum, p) => sum + p.salePrice, 0)
                            const savings = Math.max(0, stdPrice - combo.customPrice)

                            return (
                                <div
                                    key={combo.id}
                                    className={`p-6 transition-colors ${
                                        combo.isActive ? 'hover:bg-brand-maroon-300/30' : 'opacity-60 bg-black/30'
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        {/* Info & Products Strip */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="bg-brand-gold text-brand-maroon text-[10px] font-bold px-2.5 py-0.5 rounded-xs uppercase tracking-wider">
                                                    {combo.badge}
                                                </span>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                    combo.isActive
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                }`}>
                                                    {combo.isActive ? 'Active on Store' : 'Inactive / Hidden'}
                                                </span>
                                            </div>

                                            <h3 className="font-display text-xl font-bold text-white mb-1">
                                                {combo.title}
                                            </h3>
                                            <p className="text-brand-silver/70 text-xs leading-relaxed max-w-2xl mb-4">
                                                {combo.description}
                                            </p>

                                            {/* Products in this combo */}
                                            <div className="flex items-center gap-3 overflow-x-auto pb-1">
                                                {products.map((p, i) => (
                                                    <div key={p.id} className="flex items-center gap-3 flex-shrink-0">
                                                        <div className="flex items-center gap-2 bg-[#120308] border border-brand-gold/20 rounded p-1.5 pr-3">
                                                            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-brand-gold/30">
                                                                <InspectableImage
                                                                    src={p.image}
                                                                    alt={p.name}
                                                                    product={p}
                                                                    fill
                                                                    showBadge={false}
                                                                />
                                                            </div>
                                                            <div className="text-[11px]">
                                                                <p className="text-white font-medium truncate max-w-[130px]">{p.name}</p>
                                                                <p className="text-brand-gold font-bold">{formatCurrency(p.salePrice)}</p>
                                                            </div>
                                                        </div>
                                                        {i < products.length - 1 && (
                                                            <span className="text-brand-gold text-sm font-bold">+</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price & Action Controls */}
                                        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 flex-shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-brand-gold/15">
                                            <div className="text-left lg:text-right">
                                                <p className="text-brand-silver/50 text-xs line-through">
                                                    Individual Price: {formatCurrency(stdPrice)}
                                                </p>
                                                <div className="flex items-baseline gap-2 mt-0.5">
                                                    <span className="font-display text-2xl font-bold text-brand-gold">
                                                        {formatCurrency(combo.customPrice)}
                                                    </span>
                                                    <span className="text-emerald-400 text-xs font-semibold">
                                                        (Save {formatCurrency(savings)})
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleActive(combo.id)}
                                                    className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                                                        combo.isActive
                                                            ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                                                            : 'border-white/20 text-brand-silver/60 hover:text-white'
                                                    }`}
                                                >
                                                    {combo.isActive ? 'Active' : 'Draft / Enable'}
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(combo)}
                                                    className="btn-outline-gold text-xs py-1.5 px-3 flex items-center gap-1"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        deleteCombo(combo.id)
                                                        toast.success('Combo deleted')
                                                    }}
                                                    className="text-red-400/80 hover:text-red-400 p-2 border border-red-500/20 hover:border-red-500/40 rounded transition-colors"
                                                    title="Delete combo"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#1C0710] border-2 border-brand-gold/50 rounded-sm p-6 w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl animate-fade-in relative flex flex-col justify-between">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-brand-gold/20 pb-4 mb-5">
                            <div>
                                <h2 className="font-display text-xl font-bold text-gold-gradient">
                                    {editingCombo ? 'Edit Jewellery Combo' : 'Create Custom Jewellery Combo'}
                                </h2>
                                <p className="text-brand-silver/60 text-xs mt-0.5">
                                    Bundle 2 or more jewellery pieces and assign an exclusive combo price.
                                </p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-brand-gold/60 hover:text-brand-gold p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCombo} className="space-y-5 flex-1">
                            {/* Title & Badge */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="text-brand-silver/70 text-xs block mb-1">Combo Title *</label>
                                    <input
                                        required
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Navratri Rajputana 3-Piece Stack"
                                        className="input-gold text-xs w-full py-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="text-brand-silver/70 text-xs block mb-1">Badge Tag</label>
                                    <input
                                        value={badge}
                                        onChange={e => setBadge(e.target.value)}
                                        placeholder="e.g. MEGA SAVER (25% OFF)"
                                        className="input-gold text-xs w-full py-2.5 uppercase font-mono"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-brand-silver/70 text-xs block mb-1">Combo Story & Description</label>
                                <textarea
                                    rows={2}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Explain why these pieces match, occasions to wear, and value proposition..."
                                    className="input-gold text-xs w-full py-2"
                                />
                            </div>

                            {/* Product Selector with Search */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-brand-silver/70 text-xs block font-semibold">
                                        Select Products for this Combo ({selectedProductIds.length} Selected) *
                                    </label>
                                    <input
                                        type="text"
                                        value={productSearch}
                                        onChange={e => setProductSearch(e.target.value)}
                                        placeholder="Filter products..."
                                        className="input-gold text-xs py-1 px-3 w-48"
                                    />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-2 bg-[#120308] border border-brand-gold/15 rounded-sm">
                                    {filteredCatalog.map(p => {
                                        const isSelected = selectedProductIds.includes(p.id)
                                        return (
                                            <div
                                                key={p.id}
                                                onClick={() => toggleSelectProduct(p.id)}
                                                className={`p-2 rounded border cursor-pointer flex items-center gap-2 transition-all ${
                                                    isSelected
                                                        ? 'bg-brand-maroon-300 border-brand-gold ring-1 ring-brand-gold'
                                                        : 'bg-black/40 border-brand-gold/10 hover:border-brand-gold/40'
                                                }`}
                                            >
                                                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-brand-maroon-400">
                                                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-[11px] font-medium truncate">{p.name}</p>
                                                    <p className="text-brand-gold font-bold text-[10px]">{formatCurrency(p.salePrice)}</p>
                                                </div>
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                                                    isSelected ? 'bg-brand-gold text-brand-maroon' : 'border border-white/20'
                                                }`}>
                                                    {isSelected && <Check className="w-3 h-3" />}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Pricing & Savings Breakdown */}
                            <div className="bg-[#240A14] border border-brand-gold/25 p-4 rounded-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                    <div>
                                        <span className="text-brand-silver/50 text-[11px] block">Sum of Individual Prices:</span>
                                        <span className="text-white font-mono font-bold text-base">
                                            {formatCurrency(standardTotalSale)}
                                        </span>
                                        <span className="text-brand-silver/40 text-[10px] block line-through">
                                            MRP: {formatCurrency(standardTotalMrp)}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="text-brand-gold text-xs block font-bold mb-1">
                                            Set Custom Combo Price (₹) *
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            value={customPrice || ''}
                                            onChange={e => setCustomPrice(Number(e.target.value))}
                                            placeholder="Enter combo price"
                                            className="input-gold text-sm font-mono font-bold w-full py-2"
                                        />
                                    </div>

                                    <div className="text-right">
                                        <span className="text-brand-silver/50 text-[11px] block">Customer Savings:</span>
                                        <span className="text-emerald-400 font-bold text-base font-mono">
                                            {formatCurrency(comboSavings)} ({savingsPercent}% OFF)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-3 border-t border-brand-gold/20">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn-outline-gold text-xs flex-1 py-3"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-gold text-xs flex-1 py-3 font-bold uppercase tracking-widest"
                                >
                                    {editingCombo ? 'Save Changes' : 'Publish Live Combo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
