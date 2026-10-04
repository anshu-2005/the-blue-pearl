import { db } from './client'
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    QueryConstraint,
    DocumentData,
} from 'firebase/firestore'

// ── Products ──────────────────────────────────────────────────────────────────

export async function getProducts(constraints: QueryConstraint[] = []) {
    const q = query(collection(db, 'products'), ...constraints)
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getProductBySlug(slug: string) {
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1))
    const snap = await getDocs(q)
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

export async function getProductById(id: string) {
    const snap = await getDoc(doc(db, 'products', id))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
}

export async function getFeaturedProducts(count = 8) {
    return getProducts([
        where('isFeatured', '==', true),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(count),
    ])
}

export async function getProductsByCategory(category: string, count = 20) {
    return getProducts([
        where('category', '==', category),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(count),
    ])
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getUserOrders(userId: string) {
    const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getOrderById(orderId: string) {
    const snap = await getDoc(doc(db, 'orders', orderId))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
    const snap = await getDocs(collection(db, 'categories'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Coupons ───────────────────────────────────────────────────────────────────

export async function getCouponByCode(code: string) {
    const q = query(
        collection(db, 'coupons'),
        where('code', '==', code.toUpperCase()),
        where('isActive', '==', true),
        limit(1)
    )
    const snap = await getDocs(q)
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export async function getProductReviews(productId: string) {
    const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string) {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return null
    return { uid: snap.id, ...snap.data() }
}

export async function upsertUserProfile(uid: string, data: DocumentData) {
    await setDoc(doc(db, 'users', uid), data, { merge: true })
}
