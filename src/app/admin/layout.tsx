'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { AdminImageModalProvider } from '@/components/admin/AdminImageModalContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <AdminImageModalProvider>
            <div className="min-h-screen bg-[#0A0307] text-[#E8D5B0] flex flex-col font-sans">
                {/* Sidebar */}
                <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

                {/* Main Content Area */}
                <div className="lg:pl-64 flex flex-col flex-1 min-w-0 transition-all duration-300">
                    {/* Header */}
                    <AdminHeader setMobileOpen={setMobileOpen} />

                    {/* Page Content */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
                        {children}
                    </main>

                    {/* Footer */}
                    <footer className="py-4 px-6 border-t border-brand-gold/15 text-center text-xs text-brand-silver/50">
                        <p>© 2026 The Blue Pearl Haute Jewellery Atelier — Proprietary Inventory & Curatorial Suite</p>
                    </footer>
                </div>
            </div>
        </AdminImageModalProvider>
    )
}
