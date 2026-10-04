'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { upsertUserProfile } from '@/lib/firebase/firestore'

interface AuthContextType {
    user: FirebaseUser | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (name: string, email: string, password: string, phone?: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser)
            if (firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken()
                    document.cookie = `__session=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
                } catch {
                    // Ignore error in offline/local mode
                }
            } else {
                document.cookie = `__session=; path=/; max-age=0`
            }
            setLoading(false)
        })
        return unsub
    }, [])

    async function signIn(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password)
    }

    async function signUp(name: string, email: string, password: string, phone?: string) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(cred.user, { displayName: name })
        // Create user doc in Firestore
        await upsertUserProfile(cred.user.uid, {
            name,
            email,
            phone: phone || '',
            role: 'customer',
            createdAt: Date.now(),
        })
    }

    async function handleSignInWithGoogle() {
        const provider = new GoogleAuthProvider()
        const cred = await signInWithPopup(auth, provider)
        await upsertUserProfile(cred.user.uid, {
            name: cred.user.displayName || '',
            email: cred.user.email || '',
            phone: cred.user.phoneNumber || '',
            role: 'customer',
            createdAt: Date.now(),
        })
    }

    async function handleSignOut() {
        await signOut(auth)
    }

    async function resetPassword(email: string) {
        await sendPasswordResetEmail(auth, email)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                signInWithGoogle: handleSignInWithGoogle,
                signOut: handleSignOut,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
