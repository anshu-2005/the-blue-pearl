// ─── Firestore Data Models ──────────────────────────────────────────────────

export interface ProductImage {
    url: string
    isPrimary: boolean
}

export interface ProductDimensions {
    l: number
    w: number
    h: number
}

export interface Product {
    id: string
    name: string
    slug: string
    category: string
    subCategory?: string
    description: string
    careInstructions?: string
    images: ProductImage[]
    mrp: number
    salePrice: number
    costPrice: number
    discountPercent: number
    stock: number
    sku: string
    material: string
    weight: number // in grams
    dimensions: ProductDimensions
    isActive: boolean
    isFeatured: boolean
    ratingAvg: number
    ratingCount: number
    tags?: string[]
    seoSlug?: string
    createdAt: number
    updatedAt: number
}

export interface OrderItem {
    productId: string
    name: string
    image: string
    qty: number
    price: number
}

export interface Address {
    id?: string
    fullName: string
    phone: string
    pincode: string
    city: string
    state: string
    addressLine1: string
    addressLine2?: string
    landmark?: string
    type: 'Home' | 'Work' | 'Other'
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type OrderStatus =
    | 'placed'
    | 'confirmed'
    | 'packed'
    | 'shipped'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'rto'

export type PaymentMethod = 'razorpay' | 'cod'

export interface Order {
    id: string
    userId: string
    items: OrderItem[]
    address: Address
    subtotal: number
    discount: number
    couponCode?: string
    shippingFee: number
    total: number
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    razorpayOrderId?: string
    razorpayPaymentId?: string
    shiprocketOrderId?: string
    shiprocketShipmentId?: string
    awbCode?: string
    shipmentStatus?: string
    orderStatus: OrderStatus
    createdAt: number
    updatedAt: number
}

export interface User {
    uid: string
    name: string
    email: string
    phone?: string
    role: 'customer' | 'admin'
    addresses?: Address[]
    createdAt: number
}

export type CouponType = 'flat' | 'percentage'

export interface Coupon {
    id: string
    code: string
    type: CouponType
    value: number
    minOrderValue: number
    maxDiscount?: number
    usageLimit?: number
    usedCount: number
    perUserLimit?: number
    expiresAt: number
    isActive: boolean
}

export interface Category {
    id: string
    name: string
    slug: string
    image: string
    parentId?: string
}

export interface Review {
    id: string
    productId: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt: number
}

// ─── Cart Types ──────────────────────────────────────────────────────────────

export interface CartItem {
    productId: string
    name: string
    image: string
    price: number
    mrp: number
    quantity: number
    slug: string
    purity?: string
    size?: string
}

// ─── UI Types ────────────────────────────────────────────────────────────────

export interface ShipmentTrackingEvent {
    date: string
    activity: string
    location: string
}

export interface ShipmentTracking {
    awbCode: string
    currentStatus: string
    shipmentTrackActivities: ShipmentTrackingEvent[]
}

// ─── Admin Analytics ────────────────────────────────────────────────────────

export interface MonthlyStats {
    month: string        // e.g. "Jan 2025"
    orders: number
    revenue: number
    profit: number
    loss: number
}

export interface AdminKPIs {
    totalOrders: number
    totalRevenue: number
    totalProfit: number
    totalLoss: number
    pendingOrders: number
    lowStockProducts: number
}
