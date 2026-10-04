import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AdminCoupon {
    id: string
    code: string
    discountType: 'percentage' | 'flat'
    discountValue: number
    minOrderValue: number
    maxDiscountAmount?: number
    validUntil: string
    active: boolean
    usedCount: number
    usageLimit: number
    description: string
}

interface CouponStoreState {
    coupons: AdminCoupon[]
    addCoupon: (coupon: AdminCoupon) => void
    toggleCoupon: (id: string) => void
    deleteCoupon: (id: string) => void
    resetToDefault: () => void
}

const DEFAULT_COUPONS: AdminCoupon[] = [
    {
        id: 'cp-1',
        code: 'ROYAL10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 2999,
        maxDiscountAmount: 1500,
        validUntil: '2026-12-31',
        active: true,
        usedCount: 142,
        usageLimit: 500,
        description: '10% privilege discount for all royal handcrafted collections.',
    },
    {
        id: 'cp-2',
        code: 'FESTIVE500',
        discountType: 'flat',
        discountValue: 500,
        minOrderValue: 3999,
        validUntil: '2026-11-15',
        active: true,
        usedCount: 89,
        usageLimit: 300,
        description: 'Flat ₹500 off on bridal & temple sets.',
    },
    {
        id: 'cp-3',
        code: 'FIRSTJEWEL',
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 1499,
        maxDiscountAmount: 750,
        validUntil: '2027-01-01',
        active: true,
        usedCount: 312,
        usageLimit: 1000,
        description: 'Welcome gift for first-time patrons.',
    },
    {
        id: 'cp-4',
        code: 'SILVERFEST',
        discountType: 'flat',
        discountValue: 200,
        minOrderValue: 1299,
        validUntil: '2026-10-31',
        active: true,
        usedCount: 77,
        usageLimit: 200,
        description: 'Special ₹200 off on 925 sterling silver rings & bangles.',
    },
]

export const useAdminCouponStore = create<CouponStoreState>()(
    persist(
        (set) => ({
            coupons: DEFAULT_COUPONS,
            addCoupon: (coupon) =>
                set((state) => ({
                    coupons: [coupon, ...state.coupons],
                })),
            toggleCoupon: (id) =>
                set((state) => ({
                    coupons: state.coupons.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
                })),
            deleteCoupon: (id) =>
                set((state) => ({
                    coupons: state.coupons.filter((c) => c.id !== id),
                })),
            resetToDefault: () => set({ coupons: DEFAULT_COUPONS }),
        }),
        {
            name: 'tbp_admin_coupons_v1',
        }
    )
)
