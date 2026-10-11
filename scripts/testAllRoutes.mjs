const routes = [
    { url: 'http://localhost:3001/', name: 'Home Page' },
    { url: 'http://localhost:3001/shop', name: 'Shop Catalogue' },
    { url: 'http://localhost:3001/product/antique-oxidised-bangle-set', name: 'Product Detail Page (Bangle Set)' },
    { url: 'http://localhost:3001/combos', name: 'Artisan Combos & Sets' },
    { url: 'http://localhost:3001/compare', name: 'Product Comparison' },
    { url: 'http://localhost:3001/design/antique-oxidised-bangle-set', name: '3D Custom Configurator' },
    { url: 'http://localhost:3001/cart', name: 'Shopping Cart' },
    { url: 'http://localhost:3001/checkout', name: 'Checkout' },
    { url: 'http://localhost:3001/wishlist', name: 'Wishlist' },
    { url: 'http://localhost:3001/track-order', name: 'Track Order' },
    { url: 'http://localhost:3001/about', name: 'About Atelier' },
    { url: 'http://localhost:3001/contact', name: 'Concierge & Contact' },
    { url: 'http://localhost:3001/admin', name: 'Admin Dashboard' },
    { url: 'http://localhost:3001/admin/products', name: 'Admin Products' },
    { url: 'http://localhost:3001/admin/orders', name: 'Admin Orders' },
    { url: 'http://localhost:3001/admin/coupons', name: 'Admin Coupons' },
    { url: 'http://localhost:3001/admin/customers', name: 'Admin Customers' },
    { url: 'http://localhost:3001/api/products', name: 'API - Products (DB)' },
    { url: 'http://localhost:3001/api/orders', name: 'API - Orders (DB)' },
    { url: 'http://localhost:3001/api/coupons?code=ROYAL10', name: 'API - Coupon Check (DB)' },
    { url: 'http://localhost:3001/api/rates', name: 'API - Live Rates (DB)' }
]

console.log('--- STARTING COMPREHENSIVE PROJECT HEALTH CHECK ---')

async function runHealthCheck() {
    let passed = 0
    let failed = 0

    for (const r of routes) {
        const start = Date.now()
        try {
            const res = await fetch(r.url)
            const duration = Date.now() - start
            if (res.status === 200) {
                console.log(`[PASS] ${res.status} OK | ${duration}ms | ${r.name.padEnd(35)} | ${r.url}`)
                passed++
            } else {
                console.log(`[FAIL] Status ${res.status} | ${duration}ms | ${r.name.padEnd(35)} | ${r.url}`)
                failed++
            }
        } catch (err) {
            console.log(`[ERROR] ${err.message} | ${r.name} | ${r.url}`)
            failed++
        }
    }

    console.log('--- RESULTS ---')
    console.log(`Total Tested: ${routes.length}`)
    console.log(`Passed: ${passed}`)
    console.log(`Failed: ${failed}`)

    if (failed === 0) {
        console.log('STATUS: ALL PAGES AND APIs ARE WORKING PERFECTLY!')
    } else {
        console.log(`STATUS: ${failed} ISSUES DETECTED`)
    }
}

runHealthCheck()
