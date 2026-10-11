import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import fs from 'node:fs'
import { ALL_PRODUCTS, CATEGORIES, LIVE_GOLD_RATES } from '../src/lib/data.ts'

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'the_blue_pearl.db')
const db = new DatabaseSync(dbPath)

// Enable WAL mode
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')

console.log('--- Initializing SQLite Database at:', dbPath, '---')

db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        image TEXT NOT NULL,
        images TEXT,
        mrp REAL NOT NULL,
        salePrice REAL NOT NULL,
        category TEXT NOT NULL,
        rating REAL DEFAULT 5.0,
        reviews INTEGER DEFAULT 0,
        material TEXT,
        weight REAL DEFAULT 0,
        netMetalWeight REAL DEFAULT 0,
        purity TEXT,
        makingChargePerGram REAL DEFAULT 0,
        stoneCharges REAL DEFAULT 0,
        stock INTEGER DEFAULT 10,
        hasSizeSelector INTEGER DEFAULT 0,
        availableSizes TEXT,
        description TEXT,
        careInstructions TEXT,
        tags TEXT,
        bestSeller INTEGER DEFAULT 0,
        featured INTEGER DEFAULT 0,
        newArrival INTEGER DEFAULT 0,
        bundleSlugs TEXT,
        createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        image TEXT,
        count INTEGER DEFAULT 0,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        orderNumber TEXT UNIQUE NOT NULL,
        userId TEXT,
        customerName TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        customerPhone TEXT NOT NULL,
        shippingAddress TEXT NOT NULL,
        items TEXT NOT NULL,
        subtotal REAL NOT NULL,
        discount REAL DEFAULT 0,
        couponCode TEXT,
        totalAmount REAL NOT NULL,
        paymentMethod TEXT DEFAULT 'Razorpay',
        paymentStatus TEXT DEFAULT 'Paid',
        orderStatus TEXT DEFAULT 'Processing',
        trackingNumber TEXT,
        courierPartner TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'customer',
        addresses TEXT,
        createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS coupons (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        discountType TEXT NOT NULL,
        discountValue REAL NOT NULL,
        minOrderValue REAL DEFAULT 0,
        maxDiscount REAL,
        isActive INTEGER DEFAULT 1,
        usageCount INTEGER DEFAULT 0,
        expiresAt INTEGER,
        createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        author TEXT NOT NULL,
        city TEXT,
        rating REAL NOT NULL,
        title TEXT,
        comment TEXT NOT NULL,
        verified INTEGER DEFAULT 1,
        image TEXT,
        createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rates (
        id TEXT PRIMARY KEY,
        gold24k REAL NOT NULL,
        gold22k REAL NOT NULL,
        gold18k REAL NOT NULL,
        gold14k REAL NOT NULL,
        silver925 REAL NOT NULL,
        silverFine REAL NOT NULL,
        currency TEXT DEFAULT 'INR',
        lastUpdated TEXT NOT NULL,
        updatedAt INTEGER NOT NULL
    );
`)

// 1. Seed Products
console.log('Seeding products...')
const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (
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

let prodCount = 0
for (const p of ALL_PRODUCTS) {
    insertProduct.run(
        p.id,
        p.slug,
        p.name,
        p.image,
        JSON.stringify(p.images || [p.image]),
        p.mrp,
        p.salePrice,
        p.category,
        p.rating || 5.0,
        p.reviews || 0,
        p.material || '',
        p.weight || 0,
        p.netMetalWeight || 0,
        p.purity || '22K',
        p.makingChargePerGram || 0,
        p.stoneCharges || 0,
        p.stock ?? 10,
        p.hasSizeSelector ? 1 : 0,
        JSON.stringify(p.availableSizes || []),
        p.description || '',
        p.careInstructions || '',
        JSON.stringify(p.tags || []),
        p.bestSeller ? 1 : 0,
        p.featured ? 1 : 0,
        p.newArrival ? 1 : 0,
        JSON.stringify(p.bundleSlugs || []),
        Date.now() - prodCount * 3600000
    )
    prodCount++
}
console.log(`Seeded ${prodCount} products.`)

// 2. Seed Categories
console.log('Seeding categories...')
const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO categories (id, slug, name, image, count, description)
    VALUES (?, ?, ?, ?, ?, ?)
`)
for (const c of CATEGORIES) {
    insertCategory.run(
        c.slug,
        c.slug,
        c.name,
        c.image,
        c.count,
        c.description
    )
}
console.log(`Seeded ${CATEGORIES.length} categories.`)

// 3. Seed Live Gold Rates
console.log('Seeding precious metal rates...')
const insertRate = db.prepare(`
    INSERT OR REPLACE INTO rates (
        id, gold24k, gold22k, gold18k, gold14k, silver925, silverFine, currency, lastUpdated, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
insertRate.run(
    'current',
    LIVE_GOLD_RATES.gold24k,
    LIVE_GOLD_RATES.gold22k,
    LIVE_GOLD_RATES.gold18k,
    LIVE_GOLD_RATES.gold14k,
    LIVE_GOLD_RATES.silver925,
    LIVE_GOLD_RATES.silverFine,
    LIVE_GOLD_RATES.currency,
    LIVE_GOLD_RATES.lastUpdated,
    Date.now()
)
console.log('Seeded live gold rates.')

// 4. Seed Coupons
console.log('Seeding coupons...')
const insertCoupon = db.prepare(`
    INSERT OR REPLACE INTO coupons (
        id, code, discountType, discountValue, minOrderValue, maxDiscount, isActive, usageCount, expiresAt, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
const DEFAULT_COUPONS = [
    { id: 'c1', code: 'ROYAL10', type: 'percentage', value: 10, min: 1999, max: 1500 },
    { id: 'c2', code: 'PEARL500', type: 'flat', value: 500, min: 4999, max: 500 },
    { id: 'c3', code: 'FIRSTROYAL', type: 'percentage', value: 15, min: 999, max: 2000 },
    { id: 'c4', code: 'BRIDAL2026', type: 'percentage', value: 20, min: 9999, max: 5000 },
]
for (const c of DEFAULT_COUPONS) {
    insertCoupon.run(
        c.id,
        c.code,
        c.type,
        c.value,
        c.min,
        c.max,
        1,
        0,
        Date.now() + 30 * 24 * 60 * 60 * 1000,
        Date.now()
    )
}
console.log('Seeded 4 coupons.')

// 5. Seed Default Admin User
console.log('Seeding users...')
const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, phone, role, addresses, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`)
insertUser.run(
    'usr_admin_1',
    'Atelier Master Admin',
    'admin@thebluepearl.in',
    '+91 98765 43210',
    'admin',
    JSON.stringify([{
        id: 'addr_1',
        title: 'Flagship Atelier',
        street: 'Shop 14, Heritage Gold Souk, Zaveri Bazaar',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        isDefault: true
    }]),
    Date.now()
)
insertUser.run(
    'usr_cust_1',
    'Ananya Sharma',
    'ananya.sharma@example.com',
    '+91 98111 22334',
    'customer',
    JSON.stringify([{
        id: 'addr_2',
        title: 'Home Residence',
        street: 'B-402, Royal Palms, Civil Lines',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302006',
        isDefault: true
    }]),
    Date.now()
)
console.log('Seeded users.')

// 6. Seed Sample Orders
console.log('Seeding orders...')
const insertOrder = db.prepare(`
    INSERT OR REPLACE INTO orders (
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
insertOrder.run(
    'ord_1001',
    'TBP-2026-1001',
    'usr_cust_1',
    'Ananya Sharma',
    'ananya.sharma@example.com',
    '+91 98111 22334',
    JSON.stringify({
        street: 'B-402, Royal Palms, Civil Lines',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302006'
    }),
    JSON.stringify([
        {
            productId: 'p1',
            slug: 'antique-oxidised-bangle-set',
            name: 'Antique Oxidised Bangle Set',
            image: '/images/products/antique-oxidised-bangle-set.jpeg',
            price: 999,
            quantity: 1,
            size: '2.6'
        }
    ]),
    999,
    100,
    'ROYAL10',
    899,
    'Razorpay (UPI)',
    'Paid',
    'Dispatched',
    'BLUEDART-84920491',
    'BlueDart Express',
    Date.now() - 86400000,
    Date.now() - 3600000
)

console.log('--- DATABASE SEEDING COMPLETED SUCCESSFULLY ---')
