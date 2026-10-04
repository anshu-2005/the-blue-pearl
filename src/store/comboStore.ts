import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ComboItem, INITIAL_COMBOS } from '@/lib/comboData'

interface ComboStoreState {
    combos: ComboItem[]
    addCombo: (combo: Omit<ComboItem, 'id' | 'createdAt'>) => void
    updateCombo: (id: string, updated: Partial<ComboItem>) => void
    deleteCombo: (id: string) => void
    toggleActive: (id: string) => void
    resetToDefault: () => void
}

export const useComboStore = create<ComboStoreState>()(
    persist(
        (set, get) => ({
            combos: INITIAL_COMBOS,
            addCombo: (comboData) => {
                const newCombo: ComboItem = {
                    id: `combo-${Date.now()}`,
                    ...comboData,
                    createdAt: new Date().toISOString().split('T')[0],
                }
                set({ combos: [newCombo, ...get().combos] })
            },
            updateCombo: (id, updated) => {
                set({
                    combos: get().combos.map(c => (c.id === id ? { ...c, ...updated } : c)),
                })
            },
            deleteCombo: (id) => {
                set({ combos: get().combos.filter(c => c.id !== id) })
            },
            toggleActive: (id) => {
                set({
                    combos: get().combos.map(c =>
                        c.id === id ? { ...c, isActive: !c.isActive } : c
                    ),
                })
            },
            resetToDefault: () => {
                set({ combos: INITIAL_COMBOS })
            },
        }),
        {
            name: 'the-blue-pearl-combos',
        }
    )
)
