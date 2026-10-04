'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    Download,
    Trash2,
    Edit2,
    Copy,
    Eye,
    Package,
    Sparkles,
    Check,
    X,
    ChevronDown,
    SlidersHorizontal,
    Grid,
    List,
    AlertTriangle,
    Coins,
    ShieldCheck,
    CheckSquare,
    Square,
    ExternalLink,
} from 'lucide-react'
import { ProductItem } from '@/lib/data'
import { useAdminProductStore } from '@/store/adminProductStore'
import { useAdminRatesStore } from '@/store/adminRatesStore'
import { useAdminImageModal } from '@/components/admin/AdminImageModalContext'
import InspectableImage from '@/components/admin/InspectableImage'
import ProductEditModal from '@/components/admin/ProductEditModal'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const CATEGORIES = ['All Categories', 'Bangles', 'Necklaces', 'Earrings', 'Rings', 'Bridal', 'Anklets', 'Maangtikka']
const PURITIES = ['All Purities', '22K', '18K', '24K', '925 Silver', 'Antique Brass']
const STOCK_STATUSES = ['All Stock Levels', 'In Stock (>5)', 'Low Stock (1-5)', 'Out of Stock (0)']

export default function AdminProductsPage() {
    const products = useAdminProductStore((s) => s.products)
    const deleteProduct = useAdminProductStore((s) => s.deleteProduct)
    const duplicateProduct = useAdminProductStore((s) => s.duplicateProduct)
    const adjustStock = useAdminProductStore((s) => s.adjustStock)
    const toggleFeatured = useAdminProductStore((s) => s.toggleFeatured)
    const toggleBestSeller = useAdminProductStore((s) => s.toggleBestSeller)
    const bulkDelete = useAdminProductStore((s) => s.bulkDelete)
    const bulkUpdateStock = useAdminProductStore((s) => s.bulkUpdateStock)
    const resetToDefault = useAdminProductStore((s) => s.resetToDefault)
    const rates = useAdminRatesStore((s) => s.rates)
    const { openImageModal } = useAdminImageModal()

    // View state
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All Categories')
    const [purityFilter, setPurityFilter] = useState('All Purities')
    const [stockFilter, setStockFilter] = useState('All Stock Levels')
    const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock' | 'weight'>('name')

    // Selected products for bulk actions
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Modals
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [productBeingEdited, setProductBeingEdited] = useState<ProductItem | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    // Filter & sort logic
    const filteredProducts = useMemo(() => {
        return products
            .filter((p) => {
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase()
                    const matchName = p.name.toLowerCase().includes(q)
                    const matchCategory = p.category.toLowerCase().includes(q)
                    const matchMaterial = p.material.toLowerCase().includes(q)
                    const matchPurity = p.purity.toLowerCase().includes(q)
                    const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q))
                    if (!matchName && !matchCategory && !matchMaterial && !matchPurity && !matchTags) return false
                }

                if (categoryFilter !== 'All Categories' && p.category !== categoryFilter) {
                    return false
                }

                if (purityFilter !== 'All Purities' && p.purity !== purityFilter) {
                    return false
                }

                if (stockFilter === 'In Stock (>5)' && p.stock <= 5) return false
                if (stockFilter === 'Low Stock (1-5)' && (p.stock < 1 || p.stock > 5)) return false
                if (stockFilter === 'Out of Stock (0)' && p.stock !== 0) return false

                return true
            })
            .sort((a, b) => {
                if (sortBy === 'price-asc') return a.salePrice - b.salePrice
                if (sortBy === 'price-desc') return b.salePrice - a.salePrice
                if (sortBy === 'stock') return a.stock - b.stock
                if (sortBy === 'weight') return b.weight - a.weight
                return a.name.localeCompare(b.name)
            })
    }, [products, searchQuery, categoryFilter, purityFilter, stockFilter, sortBy])

    // Bulk selection handlers
    const isAllSelected = filteredProducts.length > 0 && selectedIds.length === filteredProducts.length
    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredProducts.map((p) => p.id))
        }
    }

    const toggleSelectOne = (id: string) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} selected pieces?`)) {
            bulkDelete(selectedIds)
            setSelectedIds([])
            toast.success(`Deleted ${selectedIds.length} pieces`)
        }
    }

    const handleBulkRestock = (amount: number) => {
        bulkUpdateStock(selectedIds, amount)
        toast.success(`Updated stock to ${amount} for ${selectedIds.length} pieces`)
        setSelectedIds([])
    }

    // Export CSV
    const exportToCSV = () => {
        const headers = ['ID', 'Name', 'Category', 'Purity', 'Material', 'MRP', 'SalePrice', 'Stock', 'GrossWeight', 'NetWeight', 'BIS_Hallmark']
        const rows = filteredProducts.map((p) => [
            p.id,
            `"${p.name.replace(/"/g, '""')}"`,
            p.category,
            p.purity,
            `"${p.material}"`,
            p.mrp,
            p.salePrice,
            p.stock,
            p.weight,
            p.netMetalWeight,
            p.bisHallmarkNumber || '',
        ])

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `the_blue_pearl_catalogue_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Downloaded catalogue CSV file!')
    }

    // Summary calculations
    const totalInventoryValue = products.reduce((sum, p) => sum + p.salePrice * p.stock, 0)
    const totalVaultPieces = products.reduce((sum, p) => sum + p.stock, 0)
    const lowStockTotal = products.filter((p) => p.stock <= 5).length

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header & Main Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gold/15 pb-5">
                <div>
                    <div className="flex items-center gap-2 text-brand-gold text-xs uppercase tracking-widest font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>High Jewellery Inventory & Vault Records</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
                        Products & Stock Management
                    </h1>
                    <p className="text-xs text-brand-silver/70 mt-1">
                        Total {products.length} masterworks in catalogue. Click on any jewel photograph to inspect full specifications & zoom.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={exportToCSV}
                        className="py-2.5 px-3.5 rounded border border-brand-gold/30 hover:border-brand-gold text-brand-gold hover:bg-brand-gold/10 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 transition"
                        title="Export current catalogue to CSV"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                    <button
                        onClick={() => {
                            setProductBeingEdited(null)
                            setEditModalOpen(true)
                        }}
                        className="btn-gold py-2.5 px-5 text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Jewel</span>
                    </button>
                </div>
            </div>

            {/* Inventory Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-[#18050F] border border-brand-gold/20">
                    <span className="text-[10px] text-brand-silver/60 uppercase block">Active Designs</span>
                    <span className="text-xl font-bold text-white font-sans">{products.length}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#18050F] border border-brand-gold/20">
                    <span className="text-[10px] text-brand-silver/60 uppercase block">Vault Total Pieces</span>
                    <span className="text-xl font-bold text-white font-sans">{totalVaultPieces} units</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#18050F] border border-brand-gold/20">
                    <span className="text-[10px] text-brand-silver/60 uppercase block">Low Stock Alert</span>
                    <span className={`text-xl font-bold font-sans ${lowStockTotal > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {lowStockTotal} items
                    </span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#18050F] border border-brand-gold/20">
                    <span className="text-[10px] text-brand-silver/60 uppercase block">Inventory Valuation</span>
                    <span className="text-xl font-bold text-gold-gradient font-sans">
                        {formatCurrency(totalInventoryValue)}
                    </span>
                </div>
            </div>

            {/* Filters, Search & Bulk Actions Bar */}
            <div className="p-4 rounded-lg bg-[#16050E] border border-brand-gold/20 space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-brand-gold/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter by name, material, tags, SKU..."
                            className="w-full bg-black/40 border border-brand-gold/25 focus:border-brand-gold rounded pl-9 pr-8 py-2 text-xs text-white placeholder-brand-silver/40 outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-silver/40 hover:text-white"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Selects */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-black/40 border border-brand-gold/25 rounded px-2.5 py-2 text-xs text-white focus:border-brand-gold outline-none"
                        >
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c} className="bg-[#1C060F]">
                                    {c}
                                </option>
                            ))}
                        </select>

                        <select
                            value={purityFilter}
                            onChange={(e) => setPurityFilter(e.target.value)}
                            className="bg-black/40 border border-brand-gold/25 rounded px-2.5 py-2 text-xs text-white focus:border-brand-gold outline-none"
                        >
                            {PURITIES.map((p) => (
                                <option key={p} value={p} className="bg-[#1C060F]">
                                    {p}
                                </option>
                            ))}
                        </select>

                        <select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="bg-black/40 border border-brand-gold/25 rounded px-2.5 py-2 text-xs text-white focus:border-brand-gold outline-none"
                        >
                            {STOCK_STATUSES.map((s) => (
                                <option key={s} value={s} className="bg-[#1C060F]">
                                    {s}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-black/40 border border-brand-gold/25 rounded px-2.5 py-2 text-xs text-white focus:border-brand-gold outline-none"
                        >
                            <option value="name" className="bg-[#1C060F]">Sort: Name (A-Z)</option>
                            <option value="price-asc" className="bg-[#1C060F]">Sort: Price Low → High</option>
                            <option value="price-desc" className="bg-[#1C060F]">Sort: Price High → Low</option>
                            <option value="stock" className="bg-[#1C060F]">Sort: Lowest Stock First</option>
                            <option value="weight" className="bg-[#1C060F]">Sort: Gross Weight</option>
                        </select>

                        {/* View Switcher */}
                        <div className="flex items-center rounded border border-brand-gold/25 overflow-hidden ml-auto md:ml-0">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 transition ${
                                    viewMode === 'table' ? 'bg-brand-gold text-brand-maroon' : 'text-brand-silver hover:text-white'
                                }`}
                                title="Table View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition ${
                                    viewMode === 'grid' ? 'bg-brand-gold text-brand-maroon' : 'text-brand-silver hover:text-white'
                                }`}
                                title="Visual Cards View"
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Action Toolbar (Appears when items are selected) */}
                {selectedIds.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded bg-brand-maroon/60 border border-brand-gold/30 text-xs animate-fade-in">
                        <div className="flex items-center gap-2 text-brand-gold font-semibold">
                            <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                            <span>{selectedIds.length} jewel(s) selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBulkRestock(15)}
                                className="px-2.5 py-1 rounded bg-black/40 border border-brand-gold/30 hover:border-brand-gold text-brand-silver hover:text-white transition"
                            >
                                Set Stock to 15
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition flex items-center gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Selected</span>
                            </button>
                            <button
                                onClick={() => setSelectedIds([])}
                                className="text-brand-silver/60 hover:text-white underline ml-2"
                            >
                                Deselect
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Instruction Banner highlighting the requested feature */}
            <div className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-maroon/80 to-[#12040B] border border-brand-gold/30 flex items-center justify-between text-xs text-brand-gold">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                        <strong>Click any Jewel Image:</strong> Instantly opens high-definition zoom, bullion metal valuation, BIS hallmark verification and stock controls.
                    </span>
                </div>
                <span className="text-[10px] text-brand-silver/50 hidden sm:inline">
                    Showing {filteredProducts.length} of {products.length} designs
                </span>
            </div>

            {/* PRODUCTS DISPLAY: Table View */}
            {viewMode === 'table' ? (
                <div className="rounded-lg bg-[#14050D] border border-brand-gold/20 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-brand-gold/20 bg-[#1A0612] text-[10px] uppercase font-bold text-brand-gold/80 tracking-wider">
                                    <th className="py-3 px-4 w-10 text-center">
                                        <button onClick={toggleSelectAll} className="p-1 text-brand-gold">
                                            {isAllSelected ? (
                                                <CheckSquare className="w-4 h-4 text-brand-gold" />
                                            ) : (
                                                <Square className="w-4 h-4 text-brand-silver/40" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="py-3 px-3">Jewel Photograph</th>
                                    <th className="py-3 px-4">Title & Specifications</th>
                                    <th className="py-3 px-3">Purity / Metal</th>
                                    <th className="py-3 px-3">Gross Weight</th>
                                    <th className="py-3 px-3">Pricing (₹)</th>
                                    <th className="py-3 px-3">Inventory Stock</th>
                                    <th className="py-3 px-3 text-center">Badges</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-gold/10">
                                {filteredProducts.map((p) => {
                                    const isSelected = selectedIds.includes(p.id)
                                    return (
                                        <tr
                                            key={p.id}
                                            className={`hover:bg-brand-gold/5 transition ${
                                                isSelected ? 'bg-brand-gold/10' : ''
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => toggleSelectOne(p.id)}
                                                    className="p-1 text-brand-gold"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="w-4 h-4 text-brand-gold" />
                                                    ) : (
                                                        <Square className="w-4 h-4 text-brand-silver/40" />
                                                    )}
                                                </button>
                                            </td>

                                            {/* Clickable Image with Inspect Lens */}
                                            <td className="py-3 px-3">
                                                <div className="w-14 h-14 rounded-md overflow-hidden border border-brand-gold/30 bg-black/40 shrink-0">
                                                    <InspectableImage
                                                        src={p.image}
                                                        alt={p.name}
                                                        product={p}
                                                        fill
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            </td>

                                            {/* Name & Category */}
                                            <td className="py-3 px-4">
                                                <div
                                                    onClick={() =>
                                                        openImageModal({
                                                            src: p.image,
                                                            title: p.name,
                                                            product: p,
                                                            category: p.category,
                                                        })
                                                    }
                                                    className="font-bold text-white hover:text-brand-gold cursor-pointer transition text-sm flex items-center gap-1.5"
                                                >
                                                    <span>{p.name}</span>
                                                    <Eye className="w-3.5 h-3.5 text-brand-gold/40 hover:text-brand-gold" />
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-brand-silver/60">
                                                    <span className="text-brand-gold/80 uppercase tracking-wider font-semibold">
                                                        {p.category}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-mono text-brand-silver/40">{p.id}</span>
                                                </div>
                                            </td>

                                            {/* Purity */}
                                            <td className="py-3 px-3">
                                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-gold/15 text-brand-gold border border-brand-gold/25 inline-block">
                                                    {p.purity}
                                                </span>
                                            </td>

                                            {/* Weight */}
                                            <td className="py-3 px-3 text-brand-silver/80 font-mono">
                                                <div>{p.weight}g Gross</div>
                                                <div className="text-[10px] text-brand-silver/50">
                                                    {p.netMetalWeight}g Net
                                                </div>
                                            </td>

                                            {/* Pricing */}
                                            <td className="py-3 px-3 font-sans">
                                                <div className="font-bold text-white text-sm">
                                                    {formatCurrency(p.salePrice)}
                                                </div>
                                                {p.mrp > p.salePrice && (
                                                    <div className="text-[10px] text-brand-silver/50 line-through">
                                                        {formatCurrency(p.mrp)}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Stock Counter with inline +/- */}
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => adjustStock(p.id, -1)}
                                                        className="w-5 h-5 rounded bg-black/50 border border-brand-gold/20 hover:border-brand-gold text-brand-silver hover:text-brand-gold flex items-center justify-center font-bold text-xs transition"
                                                        title="Decrease Stock"
                                                    >
                                                        -
                                                    </button>
                                                    <span
                                                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                                                            p.stock > 5
                                                                ? 'text-emerald-400 bg-emerald-500/10'
                                                                : p.stock > 0
                                                                ? 'text-amber-400 bg-amber-500/10'
                                                                : 'text-rose-400 bg-rose-500/10'
                                                        }`}
                                                    >
                                                        {p.stock}
                                                    </span>
                                                    <button
                                                        onClick={() => adjustStock(p.id, 1)}
                                                        className="w-5 h-5 rounded bg-black/50 border border-brand-gold/20 hover:border-brand-gold text-brand-silver hover:text-brand-gold flex items-center justify-center font-bold text-xs transition"
                                                        title="Increase Stock"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Featured / Best Seller Toggles */}
                                            <td className="py-3 px-3 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => toggleFeatured(p.id)}
                                                        className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border transition ${
                                                            p.featured
                                                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                                                : 'bg-black/30 text-brand-silver/40 border-brand-gold/10 hover:text-white'
                                                        }`}
                                                        title="Toggle Featured"
                                                    >
                                                        Feat
                                                    </button>
                                                    <button
                                                        onClick={() => toggleBestSeller(p.id)}
                                                        className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border transition ${
                                                            p.bestSeller
                                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                                                : 'bg-black/30 text-brand-silver/40 border-brand-gold/10 hover:text-white'
                                                        }`}
                                                        title="Toggle Best Seller"
                                                    >
                                                        Best
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => {
                                                            setProductBeingEdited(p)
                                                            setEditModalOpen(true)
                                                        }}
                                                        className="p-1.5 rounded hover:bg-brand-gold/15 text-brand-silver hover:text-brand-gold transition"
                                                        title="Edit Piece"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            duplicateProduct(p.id)
                                                            toast.success(`Duplicated "${p.name}"`)
                                                        }}
                                                        className="p-1.5 rounded hover:bg-brand-gold/15 text-brand-silver hover:text-brand-gold transition"
                                                        title="Duplicate Piece"
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </button>

                                                    <Link
                                                        href={`/product/${p.slug}`}
                                                        target="_blank"
                                                        className="p-1.5 rounded hover:bg-brand-gold/15 text-brand-silver hover:text-brand-gold transition"
                                                        title="View on Live Store"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </Link>

                                                    <button
                                                        onClick={() => {
                                                            if (confirm(`Delete "${p.name}" permanently?`)) {
                                                                deleteProduct(p.id)
                                                                toast.success(`Deleted ${p.name}`)
                                                            }
                                                        }}
                                                        className="p-1.5 rounded hover:bg-rose-500/20 text-brand-silver hover:text-rose-400 transition"
                                                        title="Delete Piece"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}

                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-brand-silver/50">
                                            No jewellery designs matched your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* PRODUCTS DISPLAY: Visual Cards Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map((p) => (
                        <div
                            key={p.id}
                            className="group rounded-lg bg-[#14050D] border border-brand-gold/20 hover:border-brand-gold transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg"
                        >
                            {/* Inspectable Image Top */}
                            <div className="relative aspect-square w-full">
                                <InspectableImage
                                    src={p.image}
                                    alt={p.name}
                                    product={p}
                                    fill
                                    className="w-full h-full"
                                />

                                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 pointer-events-none">
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/75 text-brand-gold border border-brand-gold/30 backdrop-blur-sm">
                                        {p.category}
                                    </span>
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#240816]/85 text-white border border-brand-gold/20 backdrop-blur-sm">
                                        {p.purity}
                                    </span>
                                </div>

                                <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
                                    <button
                                        onClick={() => toggleSelectOne(p.id)}
                                        className="p-1 rounded bg-black/60 text-brand-gold backdrop-blur-sm hover:scale-110 transition"
                                    >
                                        {selectedIds.includes(p.id) ? (
                                            <CheckSquare className="w-4 h-4 text-brand-gold" />
                                        ) : (
                                            <Square className="w-4 h-4 text-brand-silver/60" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3
                                        onClick={() =>
                                            openImageModal({
                                                src: p.image,
                                                title: p.name,
                                                product: p,
                                                category: p.category,
                                            })
                                        }
                                        className="font-display font-bold text-white text-base group-hover:text-brand-gold cursor-pointer transition truncate"
                                        title={p.name}
                                    >
                                        {p.name}
                                    </h3>
                                    <p className="text-[11px] text-brand-silver/60 line-clamp-1 mt-0.5">
                                        {p.material}
                                    </p>
                                </div>

                                {/* Price and Stock */}
                                <div className="pt-2 border-t border-brand-gold/15 flex items-baseline justify-between">
                                    <div>
                                        <span className="text-base font-bold text-gold-gradient font-sans">
                                            {formatCurrency(p.salePrice)}
                                        </span>
                                        {p.mrp > p.salePrice && (
                                            <span className="text-xs text-brand-silver/50 line-through ml-2">
                                                {formatCurrency(p.mrp)}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                            p.stock > 5
                                                ? 'bg-emerald-500/10 text-emerald-300'
                                                : p.stock > 0
                                                ? 'bg-amber-500/10 text-amber-300'
                                                : 'bg-rose-500/10 text-rose-300'
                                        }`}
                                    >
                                        {p.stock} in stock
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-brand-gold/10">
                                    <button
                                        onClick={() =>
                                            openImageModal({
                                                src: p.image,
                                                title: p.name,
                                                product: p,
                                                category: p.category,
                                            })
                                        }
                                        className="py-1.5 px-2 rounded bg-black/40 border border-brand-gold/25 hover:border-brand-gold text-brand-gold text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                                    >
                                        <Eye className="w-3 h-3" />
                                        <span>Inspect</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setProductBeingEdited(p)
                                            setEditModalOpen(true)
                                        }}
                                        className="py-1.5 px-2 rounded bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/30 text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                        <span>Edit Piece</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <ProductEditModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setProductBeingEdited(null)
                }}
                productToEdit={productBeingEdited}
            />
        </div>
    )
}
