'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, MessageSquare, X, Send, Bot, User, ShoppingBag, ArrowRight } from 'lucide-react'
import { ALL_PRODUCTS, ProductItem } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

interface ChatMessage {
    id: string
    sender: 'ai' | 'user'
    text: string
    recommendedProducts?: ProductItem[]
}

const QUICK_PROMPTS = [
    '✨ Bridal jewellery under ₹5,000',
    '👗 What matches a green saree/lehenga?',
    '💎 Best gift under ₹1,500',
    '🔍 Difference between 22K and 18K Gold',
    '📏 How do I find my bangle size?',
]

export default function AIJewelleryStylist() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'm1',
            sender: 'ai',
            text: 'Namaste! I am your AI Royal Jewellery Stylist. How may I assist you today? Feel free to ask about bridal pairings, gifts by budget, gold purity, or custom sizing!',
        },
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const addItem = useCartStore(s => s.addItem)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (open) scrollToBottom()
    }, [messages, open])

    const handleSend = (textToSend?: string) => {
        const query = (textToSend || input).trim()
        if (!query) return

        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text: query,
        }

        setMessages(prev => [...prev, userMsg])
        if (!textToSend) setInput('')
        setIsTyping(true)

        // Rule-based + AI keyword matching response engine
        setTimeout(() => {
            const q = query.toLowerCase()
            let replyText = ''
            let recs: ProductItem[] = []

            if (q.includes('bridal') || q.includes('wedding') || q.includes('sangeet') || q.includes('marriage')) {
                replyText = 'For bridal celebrations, we recommend our royal 22K gold-plated temple and uncut Jadau Kundan collections. Here are our top hand-picked bridal masterpieces:'
                recs = ALL_PRODUCTS.filter(p => p.category === 'Bridal' || p.tags?.includes('Bridal')).slice(0, 2)
            } else if (q.includes('gift') || q.includes('budget') || q.includes('1500') || q.includes('2000') || q.includes('under')) {
                replyText = 'Here are our most adored signature jewellery pieces under ₹1,500 that make for unforgettable gifting:'
                recs = ALL_PRODUCTS.filter(p => p.salePrice <= 1500 && (p.bestSeller || p.rating >= 4.7)).slice(0, 2)
            } else if (q.includes('green') || q.includes('lehenga') || q.includes('saree') || q.includes('matching')) {
                replyText = 'For green, emerald, and pastel outfits, antique oxidised silver and pearl-accented temple choker sets offer stunning contrast. Here are our top styling picks:'
                recs = ALL_PRODUCTS.filter(p => p.category === 'Necklaces' || p.category === 'Earrings').slice(0, 2)
            } else if (q.includes('22k') || q.includes('18k') || q.includes('purity') || q.includes('karat')) {
                replyText = '24K is 99.9% pure gold (too soft for intricate daily wear). 22K (91.6% Hallmark) is the royal standard for Indian wedding & temple jewellery. 18K (75% gold) has superior hardness, making it ideal for daily diamond studs and cocktail rings.'
            } else if (q.includes('size') || q.includes('bangle') || q.includes('ring')) {
                replyText = 'Standard Indian bangle sizes range from 2.4 (Small, 57mm) to 2.8 (Large, 63mm). You can measure the circumference of your hand across your knuckles or use our interactive Size Guide on any product page.'
            } else if (q.includes('temple') || q.includes('peacock') || q.includes('lakshmi')) {
                replyText = 'Our Temple Art series features authentic South Indian Nakshi engravings of Goddess Lakshmi and dancing peacocks plated in 22K antique gold:'
                recs = ALL_PRODUCTS.filter(p => p.tags?.includes('Temple') || p.name.includes('Temple')).slice(0, 2)
            } else {
                replyText = `I would love to help you with "${query}". Explore our best-selling signature pieces crafted by master artisans:`
                recs = ALL_PRODUCTS.filter(p => p.bestSeller).slice(0, 2)
            }

            const aiMsg: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                sender: 'ai',
                text: replyText,
                recommendedProducts: recs.length > 0 ? recs : undefined,
            }

            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 600)
    }

    return (
        <>
            {/* Floating Trigger Button on bottom right */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-brand-maroon via-brand-maroon-600 to-brand-maroon border-2 border-brand-gold text-brand-gold p-3.5 rounded-full shadow-[0_0_25px_rgba(201,166,107,0.4)] hover:scale-110 transition-transform duration-300 flex items-center gap-2 group"
                    aria-label="AI Jewellery Stylist"
                >
                    <Sparkles className="w-5 h-5 text-brand-gold animate-spin-slow" />
                    <span className="text-xs font-bold font-sans uppercase tracking-wider hidden md:inline pr-1 text-white">
                        AI Stylist
                    </span>
                </button>
            )}

            {/* Chatbot Window */}
            {open && (
                <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-[#19060E] border-2 border-brand-gold/40 rounded-sm shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-maroon to-brand-maroon-600 border-b border-brand-gold/25 p-3.5 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold flex items-center justify-center text-brand-gold">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-sm text-brand-gold">AI Jewellery Stylist</h3>
                                <p className="text-[10px] text-brand-silver/60 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online · Instant Advice
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-brand-gold/70 hover:text-brand-gold p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                        {messages.map(m => (
                            <div
                                key={m.id}
                                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {m.sender === 'ai' && (
                                    <div className="w-6 h-6 rounded-full bg-brand-gold/20 border border-brand-gold/50 flex items-center justify-center text-brand-gold flex-shrink-0 text-[10px]">
                                        👑
                                    </div>
                                )}
                                <div
                                    className={`max-w-[82%] rounded-sm p-3 leading-relaxed ${
                                        m.sender === 'user'
                                            ? 'bg-brand-gold text-brand-maroon font-medium'
                                            : 'bg-brand-maroon-300/80 border border-brand-gold/20 text-brand-silver/90'
                                    }`}
                                >
                                    <p>{m.text}</p>

                                    {/* Product recommendations inside chat */}
                                    {m.recommendedProducts && (
                                        <div className="mt-3 space-y-2 pt-2 border-t border-brand-gold/15">
                                            {m.recommendedProducts.map(p => (
                                                <div
                                                    key={p.id}
                                                    className="bg-black/40 border border-brand-gold/25 rounded p-2 flex items-center gap-2.5"
                                                >
                                                    <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={`/product/${p.slug}`}
                                                            onClick={() => setOpen(false)}
                                                            className="text-white hover:text-brand-gold font-semibold truncate block text-[11px]"
                                                        >
                                                            {p.name}
                                                        </Link>
                                                        <p className="text-brand-gold font-bold text-xs mt-0.5">
                                                            {formatCurrency(p.salePrice)}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            addItem({
                                                                productId: p.id,
                                                                name: p.name,
                                                                image: p.image,
                                                                price: p.salePrice,
                                                                mrp: p.mrp,
                                                                quantity: 1,
                                                                slug: p.slug,
                                                            })
                                                            toast.success('Added to cart!')
                                                        }}
                                                        className="bg-brand-gold text-brand-maroon p-1.5 rounded hover:bg-[#D4AF37] flex-shrink-0"
                                                        title="Add to Cart"
                                                    >
                                                        <ShoppingBag className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-2 text-brand-gold/60 text-[11px]">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce" />
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce [animation-delay:0.4s]" />
                                <span>Stylist is curating...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    <div className="px-3 py-1.5 border-t border-brand-gold/15 bg-[#14040A] flex gap-1.5 overflow-x-auto no-scrollbar">
                        {QUICK_PROMPTS.map(qp => (
                            <button
                                key={qp}
                                onClick={() => handleSend(qp)}
                                className="whitespace-nowrap text-[10px] bg-brand-maroon-300/60 hover:bg-brand-gold hover:text-brand-maroon text-brand-gold/80 border border-brand-gold/20 px-2 py-1 rounded-full transition-colors flex-shrink-0"
                            >
                                {qp}
                            </button>
                        ))}
                    </div>

                    {/* Input Field */}
                    <form
                        onSubmit={e => {
                            e.preventDefault()
                            handleSend()
                        }}
                        className="p-3 border-t border-brand-gold/20 bg-[#1A060E] flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask about styling, gifts, sizing..."
                            className="input-gold text-xs flex-1 py-2"
                        />
                        <button
                            type="submit"
                            className="bg-brand-gold text-brand-maroon p-2 rounded hover:bg-[#D4AF37] flex-shrink-0"
                            aria-label="Send"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}
