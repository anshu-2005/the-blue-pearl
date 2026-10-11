import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import TrustBadges from '@/components/home/TrustBadges'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import FeaturedCombos from '@/components/home/FeaturedCombos'
import BestSellers from '@/components/home/BestSellers'
import CollectionBanners from '@/components/home/CollectionBanners'
import ShopByOccasion from '@/components/home/ShopByOccasion'
import CraftsmanshipStory from '@/components/home/CraftsmanshipStory'
import Testimonials from '@/components/home/Testimonials'
import InstagramGallery from '@/components/home/InstagramGallery'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Blue Pearl — Royal Heritage & Luxury Handcrafted Jewellery',
  description: 'Timeless Beauty. Crafted to Perfection. Discover our collection of handcrafted antique jewellery — oxidised silver bangles, temple ornaments, gold filigree necklaces, and bridal sets.',
  keywords: ['jewellery', 'bangles', 'necklaces', 'earrings', 'handcrafted', 'antique', 'temple jewellery', 'bridal', 'India', 'Jaipur'],
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Cinematic Hero Section */}
        <HeroSection />

      {/* 2. Luxury Hallmarks & Trust Badges */}
      <TrustBadges />

      {/* 3. Shop by Category */}
      <FeaturedCategories />

      {/* 4. Exclusive Artisan Combos & Sets */}
      <FeaturedCombos />

      {/* 5. Master Best Sellers */}
      <BestSellers />

      {/* 6. Curated Collections (Antique, Temple, Bridal, Contemporary) */}
      <CollectionBanners />

      {/* 7. Shop by Occasion (Bridal, Festive, Everyday, Gifting) */}
      <ShopByOccasion />

      {/* 8. The Atelier & Craftsmanship Heritage Story */}
      <CraftsmanshipStory />

      {/* 9. Patron Testimonials & Reviews */}
      <Testimonials />

      {/* 10. Instagram Social Lookbook */}
      <InstagramGallery />
      </main>
      <Footer />
    </>
  )
}
