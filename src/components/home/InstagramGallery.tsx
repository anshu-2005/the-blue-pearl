import Image from 'next/image'
import Link from 'next/link'

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    )
}

const GALLERY_IMAGES = [
    '/images/products/antique-oxidised-bangle-set.jpeg',
    '/images/products/oxidised-jhumka-earrings.jpeg',
    '/images/products/temple-choker-necklace.jpeg',
    '/images/products/kundan-drop-earrings.jpeg',
    '/images/products/bridal-necklace-earring-set.jpeg',
    '/images/products/filigree-pendant-chain.jpeg',
]

export default function InstagramGallery() {
    return (
        <section className="py-16 md:py-20 bg-brand-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-brand-gold/60 text-xs tracking-[0.3em] uppercase mb-3">Follow Us</p>
                    <h2 className="section-heading-gold flex items-center justify-center gap-3">
                        <InstagramIcon className="w-7 h-7 text-brand-gold" />
                        @thebluepearl.in
                    </h2>
                    <div className="diamond-divider mt-4">
                        <span className="text-brand-gold text-lg">◆</span>
                    </div>
                    <p className="text-brand-silver/50 text-sm max-w-md mx-auto mt-3">
                        Tag us with #TheBluePearl and be featured in our gallery
                    </p>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                    {GALLERY_IMAGES.map((image, i) => (
                        <div key={i} className="relative aspect-square overflow-hidden rounded group cursor-pointer">
                            <Image
                                src={image}
                                alt={`Gallery ${i + 1}`}
                                fill
                                className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-brand-maroon/0 group-hover:bg-brand-maroon/50 transition-colors duration-300 flex items-center justify-center">
                                <InstagramIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <a
                        href="https://instagram.com/thebluepearl.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline-gold inline-flex items-center gap-2"
                        id="instagram-follow-btn"
                    >
                        <InstagramIcon className="w-4 h-4" />
                        Follow on Instagram
                    </a>
                </div>
            </div>
        </section>
    )
}
