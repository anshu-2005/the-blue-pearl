import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Page Not Found — The Blue Pearl',
}

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
            {/* Decorative radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#2A0A1440_0%,_transparent_70%)] pointer-events-none" />

            {/* Diamond decorative */}
            <div className="text-brand-gold/10 text-9xl font-display font-bold select-none mb-0 relative">
                404
            </div>

            <div className="relative -mt-4 mb-8">
                <div className="text-brand-gold text-3xl mb-3">◆</div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient mb-3">
                    Page Not Found
                </h1>
                <p className="text-brand-silver/50 max-w-sm mx-auto text-sm leading-relaxed">
                    The page you're looking for has moved, or was never here to begin with.
                    Let us guide you back to something beautiful.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/" className="btn-gold">Return Home</Link>
                <Link href="/shop" className="btn-outline-gold">Browse Collection</Link>
            </div>

            <Link href="/contact" className="mt-8 text-brand-gold/40 hover:text-brand-gold text-xs transition-colors">
                Need help? Contact us →
            </Link>
        </div>
    )
}
