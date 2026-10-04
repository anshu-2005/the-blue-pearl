import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'
import { FREE_SHIPPING_THRESHOLD, calcShippingFee } from '@/lib/utils'

interface CartState {
    items: CartItem[]
    couponCode: string
    discount: number

    // Actions
    addItem: (item: CartItem) => void
    removeItem: (productId: string) => void
    updateQty: (productId: string, qty: number) => void
    clearCart: () => void
    applyCoupon: (code: string, amount: number) => void
    removeCoupon: () => void

    // Computed
    itemCount: () => number
    subtotal: () => number
    shippingFee: () => number
    total: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            couponCode: '',
            discount: 0,

            addItem: (item) => {
                const existing = get().items.find(i => i.productId === item.productId)
                if (existing) {
                    set(state => ({
                        items: state.items.map(i =>
                            i.productId === item.productId
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    }))
                } else {
                    set(state => ({ items: [...state.items, item] }))
                }
            },

            removeItem: (productId) => {
                set(state => ({ items: state.items.filter(i => i.productId !== productId) }))
            },

            updateQty: (productId, qty) => {
                if (qty < 1) return
                set(state => ({
                    items: state.items.map(i =>
                        i.productId === productId ? { ...i, quantity: qty } : i
                    ),
                }))
            },

            clearCart: () => set({ items: [], couponCode: '', discount: 0 }),

            applyCoupon: (code, amount) => set({ couponCode: code, discount: amount }),
            removeCoupon: () => set({ couponCode: '', discount: 0 }),

            itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            subtotal: () =>
                get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

            shippingFee: () => {
                const sub = get().subtotal()
                return calcShippingFee(sub)
            },

            total: () => {
                const sub = get().subtotal()
                const disc = get().discount
                const ship = get().shippingFee()
                return Math.max(0, sub - disc + ship)
            },
        }),
        {
            name: 'blue-pearl-cart',
            partialize: (state) => ({
                items: state.items,
                couponCode: state.couponCode,
                discount: state.discount,
            }),
        }
    )
)
