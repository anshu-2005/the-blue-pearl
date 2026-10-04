import 'server-only'
import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function getAdminApp(): App {
    if (getApps().length > 0) return getApps()[0]

    const base64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64
    if (!base64) {
        throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 env var is not set')
    }

    const serviceAccount = JSON.parse(
        Buffer.from(base64, 'base64').toString('utf-8')
    )

    return initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
}

export const adminApp = getAdminApp()
export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)
