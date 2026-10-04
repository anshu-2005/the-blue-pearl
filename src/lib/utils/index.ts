import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind Merge ──────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// ─── Currency ─────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

// ─── Date ─────────────────────────────────────────────────────────────────────

export function formatDate(timestamp: number): string {
    return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(timestamp))
}

export function formatDateShort(timestamp: number): string {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(timestamp))
}

// ─── Slugify ──────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

// ─── Discount ─────────────────────────────────────────────────────────────────

export function calcDiscountPercent(mrp: number, salePrice: number): number {
    if (mrp <= 0) return 0
    return Math.round(((mrp - salePrice) / mrp) * 100)
}

// ─── Order status display ─────────────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<string, string> = {
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    packed: 'Packed',
    shipped: 'Shipped',
    in_transit: 'In Transit',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    rto: 'Return to Origin',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
    placed: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-indigo-100 text-indigo-800',
    packed: 'bg-purple-100 text-purple-800',
    shipped: 'bg-amber-100 text-amber-800',
    in_transit: 'bg-orange-100 text-orange-800',
    out_for_delivery: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rto: 'bg-rose-100 text-rose-800',
}

// ─── Image fallback ───────────────────────────────────────────────────────────

export function productImageFallback(productName: string): string {
    // Returns a data URI for a gold-on-maroon placeholder card
    const encoded = encodeURIComponent(productName.slice(0, 30))
    return `/api/placeholder?text=${encoded}`
}

// ─── Free shipping threshold ──────────────────────────────────────────────────

export const FREE_SHIPPING_THRESHOLD = 2999

export function calcShippingFee(subtotal: number): number {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99
}

// ─── RAZORPAY fee approximation for profit/loss calc ─────────────────────────
// Razorpay charges ~2% + GST. We approximate at 2.36% for domestic cards.

export const RAZORPAY_FEE_PERCENT = 2.36

export function calcRazorpayFee(amount: number): number {
    return Math.round(amount * (RAZORPAY_FEE_PERCENT / 100))
}
