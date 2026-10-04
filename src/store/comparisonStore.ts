import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CompareState {
    productIds: string[]
    addToCompare: (id: string) => void
    removeFromCompare: (id: string) => void
    clearCompare: () => void
    has: (id: string) => boolean
}

export const useComparisonStore = create<CompareState>()(
    persist(
        (set, get) => ({
            productIds: [],
            addToCompare: (id: string) => {
                const current = get().productIds
                if (current.includes(id)) return
                if (current.length >= 4) {
                    set({ productIds: [...current.slice(1), id] })
                } else {
                    set({ productIds: [...current, id] })
                }
            },
            removeFromCompare: (id: string) => {
                set({ productIds: get().productIds.filter(i => i !== id) })
            },
            clearCompare: () => set({ productIds: [] }),
            has: (id: string) => get().productIds.includes(id),
        }),
        {
            name: 'the-blue-pearl-compare',
        }
    )
)
