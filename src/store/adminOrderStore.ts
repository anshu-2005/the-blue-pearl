import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OrderStatus = 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled'
export type PaymentStatus = 'Paid' | 'Pending Verification' | 'Refunded'

export interface OrderItem {
    productId: string
    productName: string
    productImage: string
    quantity: number
    unitPrice: number
    purity: string
    selectedSize?: string
    weightGrams?: number
}

export interface AdminOrder {
    id: string
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone: string
    shippingAddress: {
        line1: string
        city: string
        state: string
        pincode: string
    }
    items: OrderItem[]
    subtotal: number
    discountAmount: number
    couponCode?: string
    taxAmount: number
    totalAmount: number
    paymentStatus: PaymentStatus
    paymentMethod: 'Razorpay UPI' | 'Credit Card' | 'Net Banking' | 'Insured COD'
    paymentId?: string
    orderStatus: OrderStatus
    trackingNumber?: string
    courierPartner?: 'BlueDart Apex' | 'BVC Logistics Secure' | 'Sequel 24 Safe'
    createdAt: string
    notes?: string
}

interface OrderStoreState {
    orders: AdminOrder[]
    updateOrderStatus: (id: string, status: OrderStatus, trackingNumber?: string, courierPartner?: AdminOrder['courierPartner']) => void
    updatePaymentStatus: (id: string, status: PaymentStatus) => void
    deleteOrder: (id: string) => void
    addOrder: (order: AdminOrder) => void
    resetToDefault: () => void
}

const DEFAULT_ORDERS: AdminOrder[] = [
    {
        id: 'ord-101',
        orderNumber: 'TBP-2026-8812',
        customerName: 'Radhika Singhania',
        customerEmail: 'radhika.singhania@heritage.in',
        customerPhone: '+91 98201 44521',
        shippingAddress: {
            line1: 'Flat 14B, Samudra Mahal, Worli',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400018',
        },
        items: [
            {
                productId: 'p2',
                productName: 'Temple Art Gold Bangle Pair',
                productImage: '/images/products/temple-gold-bangle-pair.jpeg',
                quantity: 1,
                unitPrice: 1399,
                purity: '22K Hallmark 916',
                selectedSize: '2.6 (Medium)',
                weightGrams: 65,
            },
            {
                productId: 'p7',
                productName: 'Temple Gold Choker Necklace',
                productImage: '/images/products/temple-choker-necklace.jpeg',
                quantity: 1,
                unitPrice: 3499,
                purity: '22K Hallmark 916',
                weightGrams: 85,
            },
        ],
        subtotal: 4898,
        discountAmount: 500,
        couponCode: 'ROYAL10',
        taxAmount: 131,
        totalAmount: 4529,
        paymentStatus: 'Paid',
        paymentMethod: 'Razorpay UPI',
        paymentId: 'pay_Nz9928174Klx',
        orderStatus: 'Processing',
        trackingNumber: 'BD-EXP-8891024',
        courierPartner: 'BVC Logistics Secure',
        createdAt: '2026-10-03T19:42:00.000Z',
        notes: 'Handover to VIP courier box with velvet pouch and tamper-proof security seal.',
    },
    {
        id: 'ord-102',
        orderNumber: 'TBP-2026-8811',
        customerName: 'Vikramaditya Rathore',
        customerEmail: 'vikram.rathore@jodhpurpalace.com',
        customerPhone: '+91 94140 88219',
        shippingAddress: {
            line1: 'Umaid Heritage Bungalows #4',
            city: 'Jodhpur',
            state: 'Rajasthan',
            pincode: '342001',
        },
        items: [
            {
                productId: 'p9',
                productName: 'Royal Kundan Gold Choker',
                productImage: '/images/products/kundan-gold-choker.jpeg',
                quantity: 1,
                unitPrice: 4299,
                purity: '22K Hallmark 916',
                weightGrams: 95,
            },
            {
                productId: 'p17',
                productName: 'Kundan Drop Earrings',
                productImage: '/images/products/kundan-drop-earrings.jpeg',
                quantity: 1,
                unitPrice: 1899,
                purity: '22K Hallmark 916',
                weightGrams: 28,
            },
        ],
        subtotal: 6198,
        discountAmount: 0,
        taxAmount: 185,
        totalAmount: 6383,
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        paymentId: 'pay_Jd8827491Mpa',
        orderStatus: 'Dispatched',
        trackingNumber: 'SQ-ARM-992014',
        courierPartner: 'Sequel 24 Safe',
        createdAt: '2026-10-02T14:15:00.000Z',
        notes: 'Include BIS 916 Certificate physical hardcopy signed by Chief Gemologist.',
    },
    {
        id: 'ord-103',
        orderNumber: 'TBP-2026-8810',
        customerName: 'Ananya Deshmukh',
        customerEmail: 'ananya.d@fintech.co',
        customerPhone: '+91 97690 12839',
        shippingAddress: {
            line1: 'Plot 88, Kalyani Nagar',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411006',
        },
        items: [
            {
                productId: 'p1',
                productName: 'Antique Oxidised Bangle Set',
                productImage: '/images/products/antique-oxidised-bangle-set.jpeg',
                quantity: 2,
                unitPrice: 999,
                purity: '925 Silver',
                selectedSize: '2.4 (Small)',
                weightGrams: 80,
            },
        ],
        subtotal: 1998,
        discountAmount: 200,
        couponCode: 'SILVERFEST',
        taxAmount: 54,
        totalAmount: 1852,
        paymentStatus: 'Paid',
        paymentMethod: 'Razorpay UPI',
        paymentId: 'pay_Kl1092837Oiu',
        orderStatus: 'Delivered',
        trackingNumber: 'BD-EXP-772819',
        courierPartner: 'BlueDart Apex',
        createdAt: '2026-09-30T10:00:00.000Z',
    },
    {
        id: 'ord-104',
        orderNumber: 'TBP-2026-8809',
        customerName: 'Meenakshi Sundaram',
        customerEmail: 'meenakshi.s@chennai.org',
        customerPhone: '+91 98400 99182',
        shippingAddress: {
            line1: '12 Alwarpet High Road',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600018',
        },
        items: [
            {
                productId: 'p12',
                productName: 'Temple Lakshmi Kasu Necklace',
                productImage: '/images/products/temple-lakshmi-necklace.jpeg',
                quantity: 1,
                unitPrice: 2899,
                purity: '22K Hallmark 916',
                weightGrams: 75,
            },
        ],
        subtotal: 2899,
        discountAmount: 0,
        taxAmount: 87,
        totalAmount: 2986,
        paymentStatus: 'Pending Verification',
        paymentMethod: 'Insured COD',
        orderStatus: 'Pending',
        createdAt: '2026-10-04T00:10:00.000Z',
        notes: 'Customer requested delivery strictly after 3 PM.',
    },
]

export const useAdminOrderStore = create<OrderStoreState>()(
    persist(
        (set) => ({
            orders: DEFAULT_ORDERS,
            updateOrderStatus: (id, status, trackingNumber, courierPartner) =>
                set((state) => ({
                    orders: state.orders.map((o) =>
                        o.id === id
                            ? {
                                  ...o,
                                  orderStatus: status,
                                  ...(trackingNumber ? { trackingNumber } : {}),
                                  ...(courierPartner ? { courierPartner } : {}),
                              }
                            : o
                    ),
                })),
            updatePaymentStatus: (id, status) =>
                set((state) => ({
                    orders: state.orders.map((o) => (o.id === id ? { ...o, paymentStatus: status } : o)),
                })),
            deleteOrder: (id) =>
                set((state) => ({
                    orders: state.orders.filter((o) => o.id !== id),
                })),
            addOrder: (order) =>
                set((state) => ({
                    orders: [order, ...state.orders],
                })),
            resetToDefault: () => set({ orders: DEFAULT_ORDERS }),
        }),
        {
            name: 'tbp_admin_orders_v1',
        }
    )
)
