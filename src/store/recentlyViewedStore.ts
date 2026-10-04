import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RecentlyViewedState {
    recentSlugs: string[]
    addSlug: (slug: string) => void
    clearAll: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
    persist(
        (set, get) => ({
            recentSlugs: [],
            addSlug: (slug: string) => {
                const current = get().recentSlugs.filter(s => s !== slug)
                set({ recentSlugs: [slug, ...current].slice(0, 10) })
            },
            clearAll: () => set({ recentSlugs: [] }),
        }),
        {
            name: 'the-blue-pearl-recently-viewed',
        }
    )
)
