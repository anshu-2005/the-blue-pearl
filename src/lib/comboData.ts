export interface ComboItem {
    id: string
    title: string
    slug: string
    description: string
    badge: string
    productIds: string[]
    customPrice: number
    isActive: boolean
    sortOrder: number
    createdAt: string
}

export const INITIAL_COMBOS: ComboItem[] = [
    {
        id: 'combo-1',
        title: 'Royal Bridal Grand 3-Piece Set',
        slug: 'royal-bridal-grand-3-piece-set',
        description: 'Coordinated wedding ensemble featuring the Royal Kundan & Pearl Gold Choker, matching Kundan Drop Earrings, and Grand Bridal Chuda.',
        badge: 'ROYAL BRIDAL COMBO',
        productIds: ['p9', 'p17', 'p23'],
        customPrice: 5999, // Total MRP ~10,000+, original sale ~7,700 -> Special Combo: 5,999
        isActive: true,
        sortOrder: 1,
        createdAt: '2026-09-01',
    },
    {
        id: 'combo-2',
        title: 'Temple Art Devotional Duo',
        slug: 'temple-art-devotional-duo',
        description: 'Sacred South Indian temple jewellery set with the Goddess Lakshmi Temple Grand Necklace and Peacock Motif Jhumkas.',
        badge: 'TEMPLE SPECIAL',
        productIds: ['p12', 'p18'],
        customPrice: 2999,
        isActive: true,
        sortOrder: 2,
        createdAt: '2026-09-10',
    },
    {
        id: 'combo-3',
        title: 'Boho Oxidised Festive Trio',
        slug: 'boho-oxidised-festive-trio',
        description: 'Complete vintage Rajputana oxidised silver look: Antique Oxidised Bangle Set, Layered Silver Necklace, and Jhumka Earrings.',
        badge: 'FESTIVE STACK (SAVE ₹600)',
        productIds: ['p1', 'p8', 'p13'],
        customPrice: 2249,
        isActive: true,
        sortOrder: 3,
        createdAt: '2026-09-15',
    },
]
