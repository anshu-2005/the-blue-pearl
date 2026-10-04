'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import AdminImageDetailModal, { ImageDetailData } from './AdminImageDetailModal'
import { ProductItem } from '@/lib/data'

interface ImageModalContextType {
    openImageModal: (data: ImageDetailData) => void
    closeImageModal: () => void
    setEditProductCallback: (cb: (product: ProductItem) => void) => void
}

const ImageModalContext = createContext<ImageModalContextType | undefined>(undefined)

export function AdminImageModalProvider({ children }: { children: ReactNode }) {
    const [modalData, setModalData] = useState<ImageDetailData | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [editProductHandler, setEditProductHandler] = useState<((product: ProductItem) => void) | undefined>(undefined)

    const openImageModal = (data: ImageDetailData) => {
        setModalData(data)
        setIsOpen(true)
    }

    const closeImageModal = () => {
        setIsOpen(false)
    }

    const setEditProductCallback = (cb: (product: ProductItem) => void) => {
        setEditProductHandler(() => cb)
    }

    return (
        <ImageModalContext.Provider value={{ openImageModal, closeImageModal, setEditProductCallback }}>
            {children}
            <AdminImageDetailModal
                isOpen={isOpen}
                onClose={closeImageModal}
                data={modalData}
                onEditProduct={editProductHandler}
            />
        </ImageModalContext.Provider>
    )
}

export function useAdminImageModal() {
    const context = useContext(ImageModalContext)
    if (!context) {
        throw new Error('useAdminImageModal must be used within an AdminImageModalProvider')
    }
    return context
}
