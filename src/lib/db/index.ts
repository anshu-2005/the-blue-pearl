import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import fs from 'node:fs'

// Singleton connection to local SQLite database
let dbInstance: DatabaseSync | null = null

export function getDb(): DatabaseSync {
    if (!dbInstance) {
        const isVercel = Boolean(process.env.VERCEL)
        const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data')
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true })
        }
        const dbPath = path.join(dataDir, 'the_blue_pearl.db')

        // On Vercel, copy the bundled SQLite database to /tmp if not already copied
        if (isVercel && !fs.existsSync(dbPath)) {
            const bundledDbPath = path.join(process.cwd(), 'data', 'the_blue_pearl.db')
            if (fs.existsSync(bundledDbPath)) {
                fs.copyFileSync(bundledDbPath, dbPath)
            }
        }

        dbInstance = new DatabaseSync(dbPath)
        dbInstance.exec('PRAGMA journal_mode = WAL;')
        dbInstance.exec('PRAGMA foreign_keys = ON;')
    }
    return dbInstance
}

function parseJsonField<T>(fieldVal: any, defaultValue: T): T {
    if (!fieldVal) return defaultValue
    if (typeof fieldVal !== 'string') return fieldVal as T
    try {
        return JSON.parse(fieldVal) as T
    } catch {
        return defaultValue
    }
}

// ── Products ──────────────────────────────────────────────────────────────────

export function dbGetProducts(filters?: { category?: string; featured?: boolean }) {
    const db = getDb()
    let query = 'SELECT * FROM products WHERE 1=1'
    const params: any[] = []

    if (filters?.category) {
        query += ' AND LOWER(category) = LOWER(?)'
        params.push(filters.category)
    }
    if (filters?.featured !== undefined) {
        query += ' AND featured = ?'
        params.push(filters.featured ? 1 : 0)
    }

    query += ' ORDER BY createdAt DESC'
    const rows = db.prepare(query).all(...params) as any[]

    return rows.map(r => ({
        ...r,
        images: parseJsonField(r.images, [r.image]),
        tags: parseJsonField(r.tags, []),
        availableSizes: parseJsonField(r.availableSizes, []),
        bundleSlugs: parseJsonField(r.bundleSlugs, []),
        bestSeller: Boolean(r.bestSeller),
        featured: Boolean(r.featured),
        newArrival: Boolean(r.newArrival),
        hasSizeSelector: Boolean(r.hasSizeSelector),
    }))
}

export function dbGetProductBySlug(slug: string) {
    const db = getDb()
    const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug) as any
    if (!row) return null

    return {
        ...row,
        images: parseJsonField(row.images, [row.image]),
        tags: parseJsonField(row.tags, []),
        availableSizes: parseJsonField(row.availableSizes, []),
        bundleSlugs: parseJsonField(row.bundleSlugs, []),
        bestSeller: Boolean(row.bestSeller),
        featured: Boolean(row.featured),
        newArrival: Boolean(row.newArrival),
        hasSizeSelector: Boolean(row.hasSizeSelector),
    }
}

export function dbGetProductById(id: string) {
    const db = getDb()
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any
    if (!row) return null

    return {
        ...row,
        images: parseJsonField(row.images, [row.image]),
        tags: parseJsonField(row.tags, []),
        availableSizes: parseJsonField(row.availableSizes, []),
        bundleSlugs: parseJsonField(row.bundleSlugs, []),
        bestSeller: Boolean(row.bestSeller),
        featured: Boolean(row.featured),
        newArrival: Boolean(row.newArrival),
        hasSizeSelector: Boolean(row.hasSizeSelector),
    }
}

export function dbCreateProduct(data: any) {
    const db = getDb()
    const id = data.id || `p_${Date.now()}`
    const stmt = db.prepare(`
        INSERT INTO products (
            id, slug, name, image, images, mrp, salePrice, category,
            rating, reviews, material, weight, netMetalWeight, purity,
            makingChargePerGram, stoneCharges, stock, hasSizeSelector,
            availableSizes, description, careInstructions, tags,
            bestSeller, featured, newArrival, bundleSlugs, createdAt
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?
        )
    `)

    stmt.run(
        id,
        data.slug,
        data.name,
        data.image,
        JSON.stringify(data.images || [data.image]),
        Number(data.mrp),
        Number(data.salePrice),
        data.category,
        Number(data.rating || 5.0),
        Number(data.reviews || 0),
        data.material || '',
        Number(data.weight || 0),
        Number(data.netMetalWeight || 0),
        data.purity || '22K',
        Number(data.makingChargePerGram || 0),
        Number(data.stoneCharges || 0),
        Number(data.stock ?? 10),
        data.hasSizeSelector ? 1 : 0,
        JSON.stringify(data.availableSizes || []),
        data.description || '',
        data.careInstructions || '',
        JSON.stringify(data.tags || []),
        data.bestSeller ? 1 : 0,
        data.featured ? 1 : 0,
        data.newArrival ? 1 : 0,
        JSON.stringify(data.bundleSlugs || []),
        Date.now()
    )

    return dbGetProductById(id)
}

export function dbUpdateProduct(id: string, updates: any) {
    const db = getDb()
    const current = dbGetProductById(id)
    if (!current) return null

    const updated = { ...current, ...updates }
    const stmt = db.prepare(`
        UPDATE products SET
            slug = ?, name = ?, image = ?, images = ?, mrp = ?, salePrice = ?,
            category = ?, material = ?, weight = ?, netMetalWeight = ?, purity = ?,
            makingChargePerGram = ?, stoneCharges = ?, stock = ?, hasSizeSelector = ?,
            availableSizes = ?, description = ?, careInstructions = ?, tags = ?,
            bestSeller = ?, featured = ?, newArrival = ?, bundleSlugs = ?
        WHERE id = ?
    `)

    stmt.run(
        updated.slug,
        updated.name,
        updated.image,
        JSON.stringify(updated.images || [updated.image]),
        Number(updated.mrp),
        Number(updated.salePrice),
        updated.category,
        updated.material || '',
        Number(updated.weight || 0),
        Number(updated.netMetalWeight || 0),
        updated.purity || '22K',
        Number(updated.makingChargePerGram || 0),
        Number(updated.stoneCharges || 0),
        Number(updated.stock ?? 10),
        updated.hasSizeSelector ? 1 : 0,
        JSON.stringify(updated.availableSizes || []),
        updated.description || '',
        updated.careInstructions || '',
        JSON.stringify(updated.tags || []),
        updated.bestSeller ? 1 : 0,
        updated.featured ? 1 : 0,
        updated.newArrival ? 1 : 0,
        JSON.stringify(updated.bundleSlugs || []),
        id
    )

    return dbGetProductById(id)
}

export function dbDeleteProduct(id: string) {
    const db = getDb()
    db.prepare('DELETE FROM products WHERE id = ?').run(id)
    return { success: true, id }
}

// ── Orders ────────────────────────────────────────────────────────────────────

export function dbGetOrders(userId?: string) {
    const db = getDb()
    let query = 'SELECT * FROM orders'
    const params: any[] = []

    if (userId) {
        query += ' WHERE userId = ?'
        params.push(userId)
    }

    query += ' ORDER BY createdAt DESC'
    const rows = db.prepare(query).all(...params) as any[]

    return rows.map(r => ({
        ...r,
        shippingAddress: parseJsonField(r.shippingAddress, {}),
        items: parseJsonField(r.items, []),
    }))
}

export function dbGetOrderById(id: string) {
    const db = getDb()
    const row = db.prepare('SELECT * FROM orders WHERE id = ? OR orderNumber = ?').get(id, id) as any
    if (!row) return null

    return {
        ...row,
        shippingAddress: parseJsonField(row.shippingAddress, {}),
        items: parseJsonField(row.items, []),
    }
}

export function dbCreateOrder(orderData: any) {
    const db = getDb()
    const id = orderData.id || `ord_${Date.now()}`
    const orderNumber = orderData.orderNumber || `TBP-${Date.now().toString().slice(-6)}`

    const stmt = db.prepare(`
        INSERT INTO orders (
            id, orderNumber, userId, customerName, customerEmail, customerPhone,
            shippingAddress, items, subtotal, discount, couponCode, totalAmount,
            paymentMethod, paymentStatus, orderStatus, trackingNumber, courierPartner,
            createdAt, updatedAt
        ) VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?
        )
    `)

    stmt.run(
        id,
        orderNumber,
        orderData.userId || null,
        orderData.customerName,
        orderData.customerEmail,
        orderData.customerPhone,
        JSON.stringify(orderData.shippingAddress || {}),
        JSON.stringify(orderData.items || []),
        Number(orderData.subtotal || 0),
        Number(orderData.discount || 0),
        orderData.couponCode || null,
        Number(orderData.totalAmount || 0),
        orderData.paymentMethod || 'Razorpay',
        orderData.paymentStatus || 'Paid',
        orderData.orderStatus || 'Processing',
        orderData.trackingNumber || null,
        orderData.courierPartner || null,
        Date.now(),
        Date.now()
    )

    return dbGetOrderById(id)
}

export function dbUpdateOrderStatus(id: string, status: string, trackingNumber?: string, courierPartner?: string) {
    const db = getDb()
    const stmt = db.prepare(`
        UPDATE orders SET
            orderStatus = ?,
            trackingNumber = COALESCE(?, trackingNumber),
            courierPartner = COALESCE(?, courierPartner),
            updatedAt = ?
        WHERE id = ? OR orderNumber = ?
    `)
    stmt.run(status, trackingNumber || null, courierPartner || null, Date.now(), id, id)
    return dbGetOrderById(id)
}

// ── Coupons ───────────────────────────────────────────────────────────────────

export function dbGetCoupons() {
    const db = getDb()
    const rows = db.prepare('SELECT * FROM coupons ORDER BY createdAt DESC').all() as any[]
    return rows.map(r => ({
        ...r,
        isActive: Boolean(r.isActive),
    }))
}

export function dbGetCouponByCode(code: string) {
    const db = getDb()
    const row = db.prepare(`
        SELECT * FROM coupons
        WHERE UPPER(code) = UPPER(?) AND isActive = 1
    `).get(code) as any

    if (!row) return null
    return {
        ...row,
        isActive: Boolean(row.isActive),
    }
}

export function dbCreateCoupon(coupon: any) {
    const db = getDb()
    const id = coupon.id || `c_${Date.now()}`
    const stmt = db.prepare(`
        INSERT INTO coupons (
            id, code, discountType, discountValue, minOrderValue, maxDiscount, isActive, usageCount, expiresAt, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
        id,
        coupon.code.toUpperCase(),
        coupon.discountType || 'percentage',
        Number(coupon.discountValue),
        Number(coupon.minOrderValue || 0),
        coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
        coupon.isActive !== false ? 1 : 0,
        0,
        coupon.expiresAt || null,
        Date.now()
    )

    return dbGetCouponByCode(coupon.code)
}

export function dbDeleteCoupon(id: string) {
    const db = getDb()
    db.prepare('DELETE FROM coupons WHERE id = ?').run(id)
    return { success: true, id }
}

// ── Live Rates ────────────────────────────────────────────────────────────────

export function dbGetRates() {
    const db = getDb()
    const row = db.prepare("SELECT * FROM rates WHERE id = 'current'").get() as any
    if (!row) return null
    return row
}

export function dbUpdateRates(rates: any) {
    const db = getDb()
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO rates (
            id, gold24k, gold22k, gold18k, gold14k, silver925, silverFine, currency, lastUpdated, updatedAt
        ) VALUES ('current', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    stmt.run(
        Number(rates.gold24k),
        Number(rates.gold22k),
        Number(rates.gold18k),
        Number(rates.gold14k),
        Number(rates.silver925),
        Number(rates.silverFine),
        rates.currency || 'INR',
        rates.lastUpdated || 'Live Database Update',
        Date.now()
    )
    return dbGetRates()
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function dbGetUserProfile(uid: string) {
    const db = getDb()
    const row = db.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(uid, uid) as any
    if (!row) return null
    return {
        ...row,
        addresses: parseJsonField(row.addresses, []),
    }
}

export function dbUpsertUserProfile(uid: string, data: any) {
    const db = getDb()
    const existing = dbGetUserProfile(uid)
    if (existing) {
        const updated = { ...existing, ...data }
        const stmt = db.prepare(`
            UPDATE users SET
                name = ?, phone = ?, role = ?, addresses = ?
            WHERE id = ?
        `)
        stmt.run(
            updated.name,
            updated.phone || '',
            updated.role || 'customer',
            JSON.stringify(updated.addresses || []),
            uid
        )
        return dbGetUserProfile(uid)
    } else {
        const stmt = db.prepare(`
            INSERT INTO users (id, name, email, phone, role, addresses, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        stmt.run(
            uid,
            data.name || 'Valued Patron',
            data.email,
            data.phone || '',
            data.role || 'customer',
            JSON.stringify(data.addresses || []),
            Date.now()
        )
        return dbGetUserProfile(uid)
    }
}
