import { Metadata } from 'next'
import InteractiveConfigurator from '@/components/configurator/InteractiveConfigurator'

export const metadata: Metadata = {
    title: 'Design Your Own — The Blue Pearl',
}

import { ALL_PRODUCTS } from '@/lib/data'

export default async function DesignPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // Basic fallback logic: in a real app, query by slug. Here we just grab the first or a default.
    const product = ALL_PRODUCTS.find(p => p.slug === slug) || {
        id: 'p-custom',
        slug: slug,
        name: 'Bespoke Vintage Ring',
        image: '/images/products/gold-filigree-statement-ring.jpeg',
        mrp: 2499,
        salePrice: 1999
    }

    return (
        <main>
            <InteractiveConfigurator product={product} />
        </main>
    )
}
