import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PatronTier = 'Royal Patron (Solitaire)' | 'Heritage Diamond VIP' | 'Gold Tier Patron' | 'Silver Patron'

export interface AdminCustomer {
    id: string
    name: string
    email: string
    phone: string
    city: string
    tier: PatronTier
    totalOrders: number
    lifetimeSpend: number
    joinedDate: string
    lastOrderDate: string
    loyaltyPoints: number
    notes?: string
}

interface CustomerStoreState {
    customers: AdminCustomer[]
    addCustomer: (customer: AdminCustomer) => void
    updateCustomer: (id: string, updates: Partial<AdminCustomer>) => void
    deleteCustomer: (id: string) => void
    resetToDefault: () => void
}

const DEFAULT_CUSTOMERS: AdminCustomer[] = [
    {
        id: 'cust-1',
        name: 'Radhika Singhania',
        email: 'radhika.singhania@heritage.in',
        phone: '+91 98201 44521',
        city: 'Mumbai',
        tier: 'Royal Patron (Solitaire)',
        totalOrders: 14,
        lifetimeSpend: 184500,
        joinedDate: 'Jan 2025',
        lastOrderDate: '03 Oct 2026',
        loyaltyPoints: 3680,
        notes: 'Loves 22K temple bangles and uncut Jadau chokers.',
    },
    {
        id: 'cust-2',
        name: 'Vikramaditya Rathore',
        email: 'vikram.rathore@jodhpurpalace.com',
        phone: '+91 94140 88219',
        city: 'Jodhpur',
        tier: 'Heritage Diamond VIP',
        totalOrders: 9,
        lifetimeSpend: 112000,
        joinedDate: 'Mar 2025',
        lastOrderDate: '02 Oct 2026',
        loyaltyPoints: 2240,
        notes: 'Prefers BIS 916 certified antique gold sets.',
    },
    {
        id: 'cust-3',
        name: 'Ananya Deshmukh',
        email: 'ananya.d@fintech.co',
        phone: '+91 97690 12839',
        city: 'Pune',
        tier: 'Gold Tier Patron',
        totalOrders: 6,
        lifetimeSpend: 42800,
        joinedDate: 'Nov 2025',
        lastOrderDate: '30 Sep 2026',
        loyaltyPoints: 850,
        notes: 'Regular silver oxidised ring & bangle buyer.',
    },
    {
        id: 'cust-4',
        name: 'Meenakshi Sundaram',
        email: 'meenakshi.s@chennai.org',
        phone: '+91 98400 99182',
        city: 'Chennai',
        tier: 'Gold Tier Patron',
        totalOrders: 4,
        lifetimeSpend: 31200,
        joinedDate: 'Feb 2026',
        lastOrderDate: '04 Oct 2026',
        loyaltyPoints: 620,
    },
    {
        id: 'cust-5',
        name: 'Pooja Hegde',
        email: 'pooja.hegde@bengaluru.in',
        phone: '+91 98801 33290',
        city: 'Bengaluru',
        tier: 'Silver Patron',
        totalOrders: 2,
        lifetimeSpend: 14500,
        joinedDate: 'Aug 2026',
        lastOrderDate: '18 Sep 2026',
        loyaltyPoints: 290,
    },
]

export const useAdminCustomerStore = create<CustomerStoreState>()(
    persist(
        (set) => ({
            customers: DEFAULT_CUSTOMERS,
            addCustomer: (cust) =>
                set((state) => ({
                    customers: [cust, ...state.customers],
                })),
            updateCustomer: (id, updates) =>
                set((state) => ({
                    customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                })),
            deleteCustomer: (id) =>
                set((state) => ({
                    customers: state.customers.filter((c) => c.id !== id),
                })),
            resetToDefault: () => set({ customers: DEFAULT_CUSTOMERS }),
        }),
        {
            name: 'tbp_admin_customers_v1',
        }
    )
)
