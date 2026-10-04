#!/usr/bin/env node
/**
 * Image Organizer Script — The Blue Pearl
 * ----------------------------------------
 * Scans D:\HarshadbhaiProject\siteImages, copies and renames all images
 * into the proper Next.js public/ subfolders, generates a manifest JSON,
 * and writes MISSING_IMAGES.md flagging any gaps.
 *
 * Usage:
 *   node scripts/organizeImages.mjs
 */

import { existsSync, mkdirSync, copyFileSync, writeFileSync, readdirSync } from 'fs'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const SOURCE_DIR = 'D:\\HarshadbhaiProject\\siteImages'
const PRODUCTS_DIR = join(ROOT, 'public', 'images', 'products')
const HERO_DIR = join(ROOT, 'public', 'images', 'hero')
const BRAND_DIR = join(ROOT, 'public', 'images', 'brand')
const CAT_DIR = join(ROOT, 'public', 'images', 'categories')

// ─── Ensure output dirs exist ────────────────────────────────────────────────

for (const dir of [PRODUCTS_DIR, HERO_DIR, BRAND_DIR, CAT_DIR]) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

// ─── Category / product slot assignments ────────────────────────────────────
// We have ~50 images. Assign them to products/categories by index.

const CATEGORIES = ['bangles', 'necklaces', 'earrings', 'rings', 'bridal', 'anklets', 'maangtikka']

const PRODUCT_SLOTS = [
    { slug: 'antique-oxidised-bangle-set', category: 'bangles' },
    { slug: 'temple-gold-bangle-pair', category: 'bangles' },
    { slug: 'tribal-silver-cuff-bangle', category: 'bangles' },
    { slug: 'filigree-broad-bangle', category: 'bangles' },
    { slug: 'oxidised-kundan-bangle-set-6', category: 'bangles' },
    { slug: 'antique-brass-bangle-pair', category: 'bangles' },
    { slug: 'temple-choker-necklace', category: 'necklaces' },
    { slug: 'layered-oxidised-silver-necklace', category: 'necklaces' },
    { slug: 'kundan-gold-choker', category: 'necklaces' },
    { slug: 'filigree-pendant-chain', category: 'necklaces' },
    { slug: 'antique-coin-necklace', category: 'necklaces' },
    { slug: 'temple-lakshmi-necklace', category: 'necklaces' },
    { slug: 'oxidised-jhumka-earrings', category: 'earrings' },
    { slug: 'gold-filigree-studs', category: 'earrings' },
    { slug: 'temple-chandelier-earrings', category: 'earrings' },
    { slug: 'silver-tassel-earrings', category: 'earrings' },
    { slug: 'kundan-drop-earrings', category: 'earrings' },
    { slug: 'antique-peacock-earrings', category: 'earrings' },
    { slug: 'oxidised-adjustable-ring', category: 'rings' },
    { slug: 'gold-filigree-statement-ring', category: 'rings' },
    { slug: 'temple-toe-ring-pair', category: 'rings' },
    { slug: 'antique-silver-ring-set', category: 'rings' },
    { slug: 'bridal-gold-plated-bangle-set-12', category: 'bridal' },
    { slug: 'bridal-necklace-earring-set', category: 'bridal' },
    { slug: 'bridal-maangtikka-jhumka-combo', category: 'bridal' },
    { slug: 'temple-anklet-pair', category: 'anklets' },
    { slug: 'silver-bells-anklet-pair', category: 'anklets' },
    { slug: 'oxidised-maangtikka', category: 'maangtikka' },
]

// ─── Read source images ──────────────────────────────────────────────────────

const VALID_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

let sourceFiles = []
try {
    sourceFiles = readdirSync(SOURCE_DIR)
        .filter(f => VALID_EXT.has(extname(f).toLowerCase()))
        .sort()
} catch (e) {
    console.error(`❌  Could not read source directory: ${SOURCE_DIR}`)
    console.error(`   Make sure the path exists or update SOURCE_DIR in this script.`)
    process.exit(1)
}

console.log(`✅  Found ${sourceFiles.length} images in source folder.\n`)

const manifest = []
const missing = []

// ─── Assign first image as hero banner ───────────────────────────────────────

if (sourceFiles.length > 0) {
    const src = join(SOURCE_DIR, sourceFiles[0])
    const dest = join(HERO_DIR, `hero-banner-1${extname(sourceFiles[0])}`)
    copyFileSync(src, dest)
    manifest.push({ original: sourceFiles[0], dest: 'images/hero/hero-banner-1' + extname(sourceFiles[0]), role: 'hero' })
    console.log(`🖼️  Hero: ${sourceFiles[0]} → hero-banner-1`)
}

if (sourceFiles.length > 1) {
    const src = join(SOURCE_DIR, sourceFiles[1])
    const dest = join(HERO_DIR, `hero-banner-2${extname(sourceFiles[1])}`)
    copyFileSync(src, dest)
    manifest.push({ original: sourceFiles[1], dest: 'images/hero/hero-banner-2' + extname(sourceFiles[1]), role: 'hero' })
}

// ─── Assign next N to categories ─────────────────────────────────────────────

const catStart = 2
CATEGORIES.forEach((cat, idx) => {
    const fileIdx = catStart + idx
    if (fileIdx < sourceFiles.length) {
        const src = join(SOURCE_DIR, sourceFiles[fileIdx])
        const dest = join(CAT_DIR, `category-${cat}${extname(sourceFiles[fileIdx])}`)
        copyFileSync(src, dest)
        manifest.push({ original: sourceFiles[fileIdx], dest: `images/categories/category-${cat}${extname(sourceFiles[fileIdx])}`, role: 'category', category: cat })
        console.log(`📁  Category: ${sourceFiles[fileIdx]} → category-${cat}`)
    } else {
        missing.push({ type: 'category', name: cat })
    }
})

// ─── Assign remaining to products ─────────────────────────────────────────────

const productStart = catStart + CATEGORIES.length
PRODUCT_SLOTS.forEach((slot, idx) => {
    const fileIdx = productStart + idx
    if (fileIdx < sourceFiles.length) {
        const ext = extname(sourceFiles[fileIdx])
        const src = join(SOURCE_DIR, sourceFiles[fileIdx])
        const dest = join(PRODUCTS_DIR, `${slot.slug}${ext}`)
        copyFileSync(src, dest)
        manifest.push({
            original: sourceFiles[fileIdx],
            dest: `images/products/${slot.slug}${ext}`,
            role: 'product',
            productSlug: slot.slug,
            category: slot.category,
        })
        console.log(`💎  Product: ${sourceFiles[fileIdx]} → ${slot.slug}`)
    } else {
        missing.push({ type: 'product', slug: slot.slug, category: slot.category })
        console.warn(`⚠️   No image for product: ${slot.slug}`)
    }
})

// ─── Write manifest ───────────────────────────────────────────────────────────

writeFileSync(
    join(ROOT, 'public', 'images', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
)
console.log(`\n📋  Manifest written to public/images/manifest.json`)

// ─── Write MISSING_IMAGES.md ──────────────────────────────────────────────────

const missingLines = missing.map(m =>
    m.type === 'category'
        ? `- **Category** \`${m.name}\` — add an image to \`public/images/categories/category-${m.name}.jpg\``
        : `- **Product** \`${m.slug}\` (${m.category}) — add an image to \`public/images/products/${m.slug}.jpg\``
)

const missingMd = missing.length === 0
    ? `# Missing Images\n\nAll product and category images were successfully organised! ✅\n`
    : `# Missing Images — The Blue Pearl

These slots have no image from the source folder. Please add the corresponding files:

${missingLines.join('\n')}

---
*Generated by \`scripts/organizeImages.mjs\`. Re-run the script after adding images to reassign them.*
`

writeFileSync(join(ROOT, 'MISSING_IMAGES.md'), missingMd)
console.log(`📝  MISSING_IMAGES.md written (${missing.length} missing entries)\n`)
console.log(`✅  Image organization complete!`)
