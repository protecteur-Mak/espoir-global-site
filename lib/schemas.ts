import { z } from "zod"

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  subject: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
})

// Donation schema
export const donationSchema = z.object({
  amount: z.number().min(1, "Le montant doit être supérieur à 0"),
  type: z.enum(["one-time", "monthly", "sponsorship"]),
  paymentMethod: z.string().optional(),
})

// Newsletter schema
export const newsletterSchema = z.object({
  email: z.string().email("Email invalide"),
})

// Types
export type ContactForm = z.infer<typeof contactFormSchema>
export type Donation = z.infer<typeof donationSchema>
export type Newsletter = z.infer<typeof newsletterSchema>

// Statistics data
export interface Statistics {
  peopleHelped: number
  countries: number
  activeProjects: number
}

// Impact story
export interface ImpactStory {
  id: string
  name: string
  age: number
  location: string
  category: string
  story: string
  image: string
}

// Fund allocation
export interface FundAllocation {
  category: string
  percentage: number
  color: string
}

// Navigation item
export interface NavItem {
  id: string
  label: string
  href: string
  icon: string
}
