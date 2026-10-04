import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'

interface AdminProductState {
    products: ProductItem[]
    addProduct: (product: Omit<ProductItem, 'id'> & { id?: string }) => void
    updateProduct: (id: string, updates: Partial<ProductItem>) => void
    deleteProduct: (id: string) => void
    duplicateProduct: (id: string) => void
    adjustStock: (id: string, delta: number) => void
    setStock: (id: string, stock: number) => void
    toggleFeatured: (id: string) => void
    toggleBestSeller: (id: string) => void
    toggleNewArrival: (id: string) => void
    bulkDelete: (ids: string[]) => void
    bulkUpdateStock: (ids: string[], stock: number) => void
    resetToDefault: () => void
}

export const useAdminProductStore = create<AdminProductState>()(
    persist(
        (set) => ({
            products: ALL_PRODUCTS,

            addProduct: (newProd) =>
                set((state) => {
                    const id = newProd.id || `p_${Date.now()}`
                    const slug = newProd.slug || newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                    const productWithDefaults: ProductItem = {
                        ...newProd,
                        id,
                        slug,
                        images: newProd.images?.length ? newProd.images : [newProd.image || '/images/products/antique-oxidised-bangle-set.jpeg'],
                        rating: newProd.rating ?? 5.0,
                        reviews: newProd.reviews ?? 0,
                    }
                    return { products: [productWithDefaults, ...state.products] }
                }),

            updateProduct: (id, updates) =>
                set((state) => ({
                    products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
                })),

            deleteProduct: (id) =>
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                })),

            duplicateProduct: (id) =>
                set((state) => {
                    const existing = state.products.find((p) => p.id === id)
                    if (!existing) return state
                    const newId = `p_${Date.now()}`
                    const copy: ProductItem = {
                        ...existing,
                        id: newId,
                        name: `${existing.name} (Copy)`,
                        slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
                    }
                    return { products: [copy, ...state.products] }
                }),

            adjustStock: (id, delta) =>
                set((state) => ({
                    products: state.products.map((p) => {
                        if (p.id !== id) return p
                        const nextStock = Math.max(0, (p.stock || 0) + delta)
                        return { ...p, stock: nextStock }
                    }),
                })),

            setStock: (id, stock) =>
                set((state) => ({
                    products: state.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)),
                })),

            toggleFeatured: (id) =>
                set((state) => ({
                    products: state.products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)),
                })),

            toggleBestSeller: (id) =>
                set((state) => ({
                    products: state.products.map((p) => (p.id === id ? { ...p, bestSeller: !p.bestSeller } : p)),
                })),

            toggleNewArrival: (id) =>
                set((state) => ({
                    products: state.products.map((p) => (p.id === id ? { ...p, newArrival: !p.newArrival } : p)),
                })),

            bulkDelete: (ids) =>
                set((state) => ({
                    products: state.products.filter((p) => !ids.includes(p.id)),
                })),

            bulkUpdateStock: (ids, stock) =>
                set((state) => ({
                    products: state.products.map((p) => (ids.includes(p.id) ? { ...p, stock: Math.max(0, stock) } : p)),
                })),

            resetToDefault: () => set({ products: ALL_PRODUCTS }),
        }),
        {
            name: 'tbp_admin_products_v2',
        }
    )
)
