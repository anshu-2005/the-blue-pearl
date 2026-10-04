import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GoldRates {
    gold24k: number
    gold22k: number
    gold18k: number
    gold14k: number
    silver925: number
    silverFine: number
    currency: string
    lastUpdated: string
}

interface RatesStore {
    rates: GoldRates
    updateRate: (key: keyof Omit<GoldRates, 'currency' | 'lastUpdated'>, value: number) => void
    updateAllRates: (newRates: Partial<GoldRates>) => void
    resetToDefault: () => void
}

const DEFAULT_RATES: GoldRates = {
    gold24k: 7480,
    gold22k: 6890,
    gold18k: 5640,
    gold14k: 4420,
    silver925: 89.5,
    silverFine: 92.0,
    currency: 'INR',
    lastUpdated: 'Live MCX Rate',
}

export const useAdminRatesStore = create<RatesStore>()(
    persist(
        (set) => ({
            rates: DEFAULT_RATES,
            updateRate: (key, value) =>
                set((state) => ({
                    rates: {
                        ...state.rates,
                        [key]: Number(value),
                        lastUpdated: `Updated Just Now (${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})`,
                    },
                })),
            updateAllRates: (newRates) =>
                set((state) => ({
                    rates: {
                        ...state.rates,
                        ...newRates,
                        lastUpdated: `Updated Just Now (${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})`,
                    },
                })),
            resetToDefault: () => set({ rates: DEFAULT_RATES }),
        }),
        {
            name: 'tbp_admin_gold_rates_v1',
        }
    )
)
