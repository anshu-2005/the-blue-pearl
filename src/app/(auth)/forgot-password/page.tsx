'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const { resetPassword } = useAuth()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await resetPassword(email)
            setSent(true)
        } catch {
            toast.error('Could not find that email address.')
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <h1 className="font-display text-3xl font-bold text-gold-gradient mb-2">Reset Password</h1>
                {!sent ? (
                    <>
                        <p className="text-brand-silver/50 text-sm mb-8">Enter your registered email and we'll send you a reset link.</p>
                        <form onSubmit={handleReset} className="space-y-4">
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-gold" placeholder="your@email.com" />
                            <button type="submit" disabled={loading} className="btn-gold w-full">{loading ? 'Sending...' : 'Send Reset Link'}</button>
                        </form>
                    </>
                ) : (
                    <div className="py-8 text-center">
                        <p className="text-brand-gold text-4xl mb-4">📬</p>
                        <p className="text-white font-semibold mb-2">Reset link sent!</p>
                        <p className="text-brand-silver/60 text-sm">Check your inbox at <strong className="text-brand-gold">{email}</strong>. The link expires in 1 hour.</p>
                    </div>
                )}
                <p className="mt-6 text-center"><Link href="/login" className="text-brand-gold/60 hover:text-brand-gold text-sm transition-colors">← Back to Login</Link></p>
            </div>
        </div>
    )
}
