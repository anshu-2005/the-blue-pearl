import { z } from 'zod'

// ─── Address ──────────────────────────────────────────────────────────────────

export const addressSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    addressLine1: z.string().min(5, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    type: z.enum(['Home', 'Work', 'Other']),
})

export type AddressFormValues = z.infer<typeof addressSchema>

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number').optional().or(z.literal('')),
})

export const forgotPasswordSchema = z.object({
    email: z.string().email('Enter a valid email address'),
})

// ─── Product (admin form) ─────────────────────────────────────────────────────

export const productSchema = z.object({
    name: z.string().min(3, 'Product name is required'),
    slug: z.string().min(3, 'SEO slug is required'),
    category: z.string().min(1, 'Category is required'),
    subCategory: z.string().optional(),
    description: z.string().min(10, 'Description is required'),
    careInstructions: z.string().optional(),
    mrp: z.number().positive('MRP must be positive'),
    salePrice: z.number().positive('Sale price must be positive'),
    costPrice: z.number().positive('Cost price is required for profit/loss tracking'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    sku: z.string().min(2, 'SKU is required'),
    material: z.string().min(2, 'Material is required'),
    weight: z.number().positive('Weight (grams) is required'),
    dimensions: z.object({
        l: z.number().positive(),
        w: z.number().positive(),
        h: z.number().positive(),
    }),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    tags: z.array(z.string()).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>

// ─── Coupon (admin form) ─────────────────────────────────────────────────────

export const couponSchema = z.object({
    code: z.string().min(3).max(20).toUpperCase(),
    type: z.enum(['flat', 'percentage']),
    value: z.number().positive(),
    minOrderValue: z.number().min(0),
    maxDiscount: z.number().optional(),
    usageLimit: z.number().int().optional(),
    perUserLimit: z.number().int().optional(),
    expiresAt: z.string(), // ISO date string from form
    isActive: z.boolean(),
})

export type CouponFormValues = z.infer<typeof couponSchema>

// ─── Review ───────────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10, 'Please write at least 10 characters'),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    subject: z.string().min(3, 'Subject is required'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
})

export type ContactFormValues = z.infer<typeof contactSchema>
