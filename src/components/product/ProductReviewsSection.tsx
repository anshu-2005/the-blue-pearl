'use client'

import { useState } from 'react'
import { Star, CheckCircle2, ThumbsUp, Camera, Plus, Sparkles, X } from 'lucide-react'
import { ProductItem, ReviewItem } from '@/lib/data'
import toast from 'react-hot-toast'

interface ProductReviewsSectionProps {
    product: ProductItem
}

export default function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
    const [reviews, setReviews] = useState<ReviewItem[]>(
        product.customerReviews && product.customerReviews.length > 0
            ? product.customerReviews
            : [
                {
                    id: 'rev-def-1',
                    author: 'Ananya Deshmukh',
                    city: 'Pune',
                    rating: 5,
                    date: 'September 20, 2026',
                    title: 'Absolutely breathtaking craftsmanship!',
                    comment: 'Looks identical to the photos. The antique finish and weight are top notch. Arrived safely in high-end velvet casing.',
                    verified: true,
                },
                {
                    id: 'rev-def-2',
                    author: 'Kavita Verma',
                    city: 'New Delhi',
                    rating: 5,
                    date: 'September 14, 2026',
                    title: 'Heirloom quality piece',
                    comment: 'Wore it for my niece’s wedding and received non-stop compliments all evening. The hallmark certificate verified online without any hassle.',
                    verified: true,
                }
            ]
    )

    const [modalOpen, setModalOpen] = useState(false)
    const [author, setAuthor] = useState('')
    const [city, setCity] = useState('')
    const [rating, setRating] = useState(5)
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')

    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault()
        if (!author || !comment || !title) {
            toast.error('Please fill in all review details')
            return
        }

        const newRev: ReviewItem = {
            id: `rev-${Date.now()}`,
            author,
            city: city || 'Verified Customer',
            rating,
            date: 'Just now',
            title,
            comment,
            verified: true,
        }

        setReviews(prev => [newRev, ...prev])
        setModalOpen(false)
        setAuthor('')
        setCity('')
        setTitle('')
        setComment('')
        toast.success('Thank you! Your verified review has been submitted.')
    }

    return (
        <div className="mt-16 pt-10 border-t border-brand-gold/15">
            {/* Header / Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-brand-gold/15">
                <div className="flex items-center gap-6">
                    <div className="text-center md:border-r md:border-brand-gold/20 md:pr-6">
                        <span className="font-display text-4xl font-bold text-brand-gold">{product.rating}</span>
                        <div className="flex items-center justify-center gap-0.5 my-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5" fill={i < Math.floor(product.rating) ? '#C9A66B' : 'none'} stroke="#C9A66B" />
                            ))}
                        </div>
                        <span className="text-brand-silver/50 text-xs">Based on {reviews.length} reviews</span>
                    </div>

                    <div className="space-y-1 text-xs text-brand-silver/70 hidden sm:block">
                        <p className="flex items-center gap-2">
                            <span className="w-12 text-right">5 Star</span>
                            <span className="w-32 h-2 bg-brand-maroon-300 rounded-full overflow-hidden block">
                                <span className="bg-brand-gold h-full block w-[85%]" />
                            </span>
                            <span>85%</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="w-12 text-right">4 Star</span>
                            <span className="w-32 h-2 bg-brand-maroon-300 rounded-full overflow-hidden block">
                                <span className="bg-brand-gold h-full block w-[15%]" />
                            </span>
                            <span>15%</span>
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setModalOpen(true)}
                    className="btn-gold py-2.5 px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start md:self-auto"
                >
                    <Plus className="w-4 h-4" /> Write a Review
                </button>
            </div>

            {/* Reviews List */}
            <div className="mt-8 space-y-6">
                {reviews.map(rev => (
                    <div key={rev.id} className="bg-[#1C0810] border border-brand-gold/15 rounded-sm p-5 space-y-2.5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-maroon-300 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-display font-bold text-xs">
                                    {rev.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-white text-xs font-semibold">{rev.author}</p>
                                        {rev.verified && (
                                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                                                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-brand-silver/40 text-[10px]">{rev.city} · {rev.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3" fill={i < rev.rating ? '#C9A66B' : 'none'} stroke="#C9A66B" />
                                ))}
                            </div>
                        </div>

                        <h4 className="text-brand-gold font-semibold text-xs pt-1">{rev.title}</h4>
                        <p className="text-brand-silver/80 text-xs leading-relaxed">{rev.comment}</p>
                    </div>
                ))}
            </div>

            {/* Write Review Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#1C0710] border border-brand-gold/40 rounded-sm p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-4 right-4 text-brand-gold/60 hover:text-brand-gold p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="font-display text-xl font-bold text-white mb-1">Write a Customer Review</h2>
                        <p className="text-brand-silver/60 text-xs mb-5">Share your experience with "{product.name}"</p>

                        <form onSubmit={handleAddReview} className="space-y-3.5">
                            <div>
                                <label className="text-brand-silver/70 text-xs block mb-1">Rating *</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="p-1"
                                        >
                                            <Star className="w-6 h-6" fill={star <= rating ? '#C9A66B' : 'none'} stroke="#C9A66B" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-brand-silver/70 text-xs block mb-1">Your Name *</label>
                                    <input
                                        required
                                        value={author}
                                        onChange={e => setAuthor(e.target.value)}
                                        placeholder="e.g. Radhika S."
                                        className="input-gold text-xs w-full py-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-brand-silver/70 text-xs block mb-1">City</label>
                                    <input
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                        placeholder="e.g. Mumbai"
                                        className="input-gold text-xs w-full py-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-brand-silver/70 text-xs block mb-1">Review Headline *</label>
                                <input
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Stunning royal temple detailing!"
                                    className="input-gold text-xs w-full py-2"
                                />
                            </div>

                            <div>
                                <label className="text-brand-silver/70 text-xs block mb-1">Detailed Review *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="How does the jewellery fit? How is the finish and weight?"
                                    className="input-gold text-xs w-full py-2"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn-outline-gold text-xs flex-1 py-2"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-gold text-xs flex-1 py-2">
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
