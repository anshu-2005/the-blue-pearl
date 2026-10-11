import { DocumentData } from 'firebase/firestore'
import { ALL_PRODUCTS, CATEGORIES } from '@/lib/data'

// ── Products ──────────────────────────────────────────────────────────────────

export async function getProducts(constraints: any[] = []) {
    try {
        const res = await fetch('/api/products')
        if (res.ok) {
            const json = await res.json()
            if (json.success && json.data) return json.data
        }
    } catch {
        // Fallback to in-memory
    }
    return ALL_PRODUCTS
}

export async function getProductBySlug(slug: string) {
    try {
        const res = await fetch(`/api/products/${slug}`)
        if (res.ok) {
            const json = await res.json()
            if (json.success && json.data) return json.data
        }
    } catch {
        // Fallback to in-memory
    }
    return ALL_PRODUCTS.find(p => p.slug === slug) || null
}

export async function getProductById(id: string) {
    try {
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
            const json = await res.json()
            if (json.success && json.data) return json.data
        }
    } catch {
        // Fallback to in-memory
    }
    return ALL_PRODUCTS.find(p => p.id === id) || null
}

export async function getFeaturedProducts(count = 8) {
    const products = await getProducts()
    return products.filter((p: any) => p.featured || p.bestSeller).slice(0, count)
}

export async function getProductsByCategory(category: string, count = 20) {
    const products = await getProducts()
    return products.filter((p: any) => p.category.toLowerCase() === category.toLowerCase()).slice(0, count)
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getUserOrders(userId: string) {
    try {
        const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`)
        if (res.ok) {
            const json = await res.json()
            if (json.success && json.data) return json.data
        }
    } catch {
        // Ignore
    }
    return []
}

export async function getOrderById(orderId: string) {
    try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) {
            const json = await res.json()
            if (json.success && json.data) return json.data
        }
    } catch {
        // Ignore
    }
    return null
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
    return CATEGORIES
}

// ── Coupons ───────────────────────────────────────────────────────────────────

export async function getCouponByCode(code: string) {
    try {
        const res = await fetch(`/api/coupons?code=${encodeURIComponent(code)}`)
        if (res.ok) {
            const json = await res.json()
            if (json.success && json.data) return json.data
        }
    } catch {
        // Ignore
    }
    return null
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export async function getProductReviews(productId: string) {
    const product = await getProductById(productId)
    return product?.customerReviews || []
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string) {
    try {
        const res = await fetch(`/api/users?uid=${encodeURIComponent(uid)}`)
        if (res.ok) {
            const json = await res.json()
            if (json.success && json.data) return json.data
        }
    } catch {
        // Ignore
    }
    return null
}

export async function upsertUserProfile(uid: string, data: DocumentData) {
    try {
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid, ...data }),
        })
    } catch {
        // Ignore in offline mode
    }
}
