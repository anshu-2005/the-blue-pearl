'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, Heart, ShoppingBag, User, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import GoldRateTicker from '@/components/common/GoldRateTicker'

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    {
        label: 'Shop',
        href: '/shop',
        sub: [
            { label: 'All Royal Jewellery', href: '/shop' },
            { label: 'Bangles & Kadas', href: '/shop?category=bangles' },
            { label: 'Temple & Royal Necklaces', href: '/shop?category=necklaces' },
            { label: 'Jhumkas & Earrings', href: '/shop?category=earrings' },
            { label: 'Statement Rings', href: '/shop?category=rings' },
            { label: 'Bridal Ensembles', href: '/shop?category=bridal' },
            { label: 'Traditional Payals', href: '/shop?category=anklets' },
            { label: 'Maang Tikka Ornaments', href: '/shop?category=maangtikka' },
        ],
    },
    { label: 'Combos & Sets', href: '/combos' },
    { label: 'Compare', href: '/compare' },
    { label: 'Atelier Heritage', href: '/about' },
    { label: 'Concierge', href: '/contact' },
]

export default function Header() {
    const [mounted, setMounted] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeDropdown, setActive] = useState<string | null>(null)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const itemCount = useCartStore(s => s.itemCount())
    const wishlist = useWishlistStore(s => s.items.length)
    const { user } = useAuth()

    useEffect(() => {
        setMounted(true)
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
                scrolled
                    ? 'bg-[#0E0207]/90 backdrop-blur-md border-b border-brand-gold/25 shadow-[0_8px_30px_rgba(0,0,0,0.7)]'
                    : 'bg-[#0E0207]/60 backdrop-blur-sm border-b border-brand-gold/15'
            )}
        >
            {/* Ultra-Sleek Precious Metal & Origin Ribbon */}
            <GoldRateTicker />

            {/* Main Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Left: Atelier Logo */}
                    <Link href="/" className="flex-shrink-0 group">
                        <div className="flex flex-col items-start leading-none">
                            <span className="font-display text-xl md:text-2xl font-bold text-gold-gradient tracking-[0.08em] group-hover:opacity-90 transition-opacity">
                                The Blue Pearl
                            </span>
                            <span className="text-brand-gold/60 text-[9px] md:text-[10px] tracking-[0.3em] uppercase font-sans mt-0.5">
                                Haute Jewellery Atelier
                            </span>
                        </div>
                    </Link>

                    {/* Center: Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-7">
                        {NAV_ITEMS.map(item => (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => item.sub && setActive(item.label)}
                                onMouseLeave={() => setActive(null)}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em]',
                                        'text-brand-silver/80 hover:text-brand-gold transition-colors duration-200 py-2',
                                        'relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px',
                                        'after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full'
                                    )}
                                >
                                    <span>{item.label}</span>
                                    {item.sub && <ChevronDown className="w-3 h-3 opacity-60" />}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.sub && activeDropdown === item.label && (
                                    <div className="absolute top-full left-0 min-w-[240px] mt-1 bg-[#17040C]/95 border border-brand-gold/30 rounded-xs shadow-2xl backdrop-blur-md animate-fade-in z-50 p-2">
                                        <div className="py-1">
                                            {item.sub.map(sub => (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    className="block px-3.5 py-2 text-xs text-brand-silver/80 hover:text-brand-gold hover:bg-brand-maroon-300/60 rounded-xs transition-colors"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Right: Minimal Icon Buttons */}
                    <div className="flex items-center gap-1.5 md:gap-3">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(s => !s)}
                            className="p-2 text-brand-gold/70 hover:text-brand-gold transition-colors"
                            aria-label="Search Catalog"
                            id="header-search-btn"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="relative p-2 text-brand-gold/70 hover:text-brand-gold transition-colors"
                            aria-label="Wishlist"
                            id="header-wishlist-btn"
                        >
                            <Heart className="w-5 h-5" />
                            {mounted && wishlist > 0 && (
                                <span className="absolute 1 top-0.5 right-0.5 bg-brand-gold text-brand-maroon text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold font-mono">
                                    {wishlist}
                                </span>
                            )}
                        </Link>

                        {/* Shopping Bag */}
                        <Link
                            href="/cart"
                            className="relative p-2 text-brand-gold/70 hover:text-brand-gold transition-colors"
                            aria-label="Shopping Bag"
                            id="header-cart-btn"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute 1 top-0.5 right-0.5 bg-brand-gold text-brand-maroon text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold font-mono">
                                    {itemCount > 9 ? '9+' : itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Account */}
                        <Link
                            href={mounted && user ? '/account/orders' : '/login'}
                            className="p-2 text-brand-gold/70 hover:text-brand-gold transition-colors"
                            aria-label="Patron Account"
                            id="header-account-btn"
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(s => !s)}
                            className="lg:hidden p-2 text-brand-gold/70 hover:text-brand-gold transition-colors ml-1"
                            aria-label="Toggle Menu"
                            id="header-menu-btn"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar Overlay */}
            {searchOpen && (
                <div className="bg-[#15040B] border-b border-brand-gold/25 px-4 py-3.5 animate-fade-in shadow-2xl">
                    <div className="max-w-2xl mx-auto flex items-center gap-3">
                        <Search className="w-5 h-5 text-brand-gold/50 flex-shrink-0" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search bridal chokers, temple kadas, oxidised silver..."
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && searchValue.trim()) {
                                    window.location.href = `/shop?search=${encodeURIComponent(searchValue.trim())}`
                                }
                                if (e.key === 'Escape') setSearchOpen(false)
                            }}
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-brand-silver/40 text-xs sm:text-sm font-sans"
                            id="header-search-input"
                        />
                        <button
                            onClick={() => setSearchOpen(false)}
                            className="text-brand-gold/60 hover:text-brand-gold transition-colors text-xs font-semibold uppercase tracking-wider"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Menu Sidebar */}
            {menuOpen && (
                <div className="lg:hidden bg-[#15040B] border-t border-brand-gold/20 animate-slide-in-right max-h-[80vh] overflow-y-auto">
                    <nav className="px-6 py-5 flex flex-col gap-1">
                        {NAV_ITEMS.map(item => (
                            <div key={item.label}>
                                <Link
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="block py-3 text-brand-silver/90 hover:text-brand-gold font-display font-semibold text-base border-b border-brand-gold/10 transition-colors"
                                >
                                    {item.label}
                                </Link>
                                {item.sub && (
                                    <div className="pl-4 flex flex-col gap-1 py-1">
                                        {item.sub.map(sub => (
                                            <Link
                                                key={sub.label}
                                                href={sub.href}
                                                onClick={() => setMenuOpen(false)}
                                                className="block py-2 text-xs text-brand-gold/70 hover:text-brand-gold transition-colors"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    )
}
