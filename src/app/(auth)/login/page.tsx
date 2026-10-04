'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, Award } from 'lucide-react'

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    )
}

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { signIn, signInWithGoogle } = useAuth()
    const router = useRouter()
    const params = useSearchParams()
    const redirect = params.get('redirect') || '/'

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signIn(email, password)
            toast.success('Welcome back to The Blue Pearl!')
            router.push(redirect)
        } catch (err: any) {
            toast.error(err.message?.includes('password') ? 'Incorrect email or password' : 'Login failed. Please verify credentials.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async () => {
        try {
            await signInWithGoogle()
            toast.success('Signed in successfully!')
            router.push(redirect)
        } catch (err: any) {
            toast.error('Google sign-in failed.')
        }
    }

    return (
        <div className="min-h-screen bg-[#0E0206] flex items-stretch">
            {/* Left Column: Full-height Luxury Jewellery Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-brand-maroon border-r border-brand-gold/20">
                <Image
                    src="/images/hero/hero-banner-1.jpeg"
                    alt="The Blue Pearl Haute Jewellery"
                    fill
                    priority
                    quality={95}
                    className="object-cover object-center scale-105"
                />
                {/* Layered cinematic gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0206] via-[#1C060F]/60 to-[#0E0206]/40" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#C9A66B25_0%,_transparent_60%)]" />

                {/* Top Logo */}
                <div className="relative z-10">
                    <Link href="/" className="inline-block">
                        <span className="font-display text-2xl font-bold text-gold-gradient tracking-wider">
                            The Blue Pearl
                        </span>
                        <p className="text-brand-gold/60 text-[10px] uppercase tracking-[0.25em] font-sans">
                            Haute Jewellery Atelier
                        </p>
                    </Link>
                </div>

                {/* Bottom Story Card */}
                <div className="relative z-10 max-w-md bg-black/40 border border-brand-gold/25 p-6 rounded-sm backdrop-blur-md shadow-2xl">
                    <div className="flex items-center gap-2 text-brand-gold text-[10px] uppercase tracking-widest font-semibold mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Exclusive Patron Access</span>
                    </div>
                    <blockquote className="font-serif italic text-lg text-white/95 leading-snug mb-4">
                        "Every jewel carries a soul — carved with ancient devotion, worn with modern majesty."
                    </blockquote>
                    <div className="flex items-center gap-4 text-xs text-brand-silver/60 pt-3 border-t border-brand-gold/15">
                        <div className="flex items-center gap-1.5 text-brand-gold">
                            <Award className="w-3.5 h-3.5" />
                            <span>BIS 916 Hallmark</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Insured Delivery</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Minimal Luxury Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="w-full max-w-md bg-[#18050D]/80 border border-brand-gold/25 rounded-sm p-8 sm:p-10 shadow-2xl backdrop-blur-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 border border-brand-gold/30 rounded-full mb-3 bg-brand-maroon/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                            <span className="text-brand-gold text-[10px] tracking-[0.2em] uppercase font-sans font-semibold">
                                Patron Concierge
                            </span>
                        </div>
                        <h1 className="font-display text-3xl font-bold text-white mb-1.5">Welcome Back</h1>
                        <p className="text-brand-silver/60 text-xs">
                            Sign in to access your saved wishlist, custom orders & loyalty perks.
                        </p>
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={handleGoogle}
                        className="w-full flex items-center justify-center gap-3 py-3 border border-brand-gold/30 rounded-xs hover:border-brand-gold bg-brand-maroon-300/30 hover:bg-brand-maroon-300/60 transition-all text-white text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm"
                    >
                        <GoogleIcon />
                        <span>Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-brand-gold/20" />
                        <span className="text-brand-silver/40 text-[10px] uppercase tracking-widest font-sans">or email</span>
                        <div className="flex-1 h-px bg-brand-gold/20" />
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-brand-silver/70 text-xs block mb-1 font-medium">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="input-gold text-xs w-full py-2.5"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-brand-silver/70 text-xs font-medium">Password</label>
                                <Link
                                    href="/forgot-password"
                                    className="text-brand-gold/70 hover:text-brand-gold text-[11px] transition-colors hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="input-gold text-xs w-full py-2.5 pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-silver/40 hover:text-brand-gold p-1"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold w-full py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 mt-2 shadow-lg"
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Atelier'}
                            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-brand-gold/15 text-center">
                        <p className="text-brand-silver/60 text-xs">
                            New to The Blue Pearl?{' '}
                            <Link href="/signup" className="text-brand-gold font-semibold hover:underline ml-1">
                                Create an Account →
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0E0206] flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>}>
            <LoginForm />
        </Suspense>
    )
}
