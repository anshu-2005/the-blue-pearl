import { create } from 'zustand'
import type { User } from '@/types'

interface WishlistState {
    items: string[] // productIds
    addItem: (productId: string) => void
    removeItem: (productId: string) => void
    toggle: (productId: string) => void
    has: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
    (set, get) => ({
        items: [],
        addItem: (id) => {
            if (!get().items.includes(id)) {
                set(state => ({ items: [...state.items, id] }))
            }
        },
        removeItem: (id) => {
            set(state => ({ items: state.items.filter(i => i !== id) }))
        },
        toggle: (id) => {
            if (get().items.includes(id)) {
                get().removeItem(id)
            } else {
                get().addItem(id)
            }
        },
        has: (id) => get().items.includes(id),
    })
)
