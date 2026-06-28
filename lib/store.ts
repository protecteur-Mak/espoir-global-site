import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { ContactForm, Donation, Statistics, ImpactStory, FundAllocation } from "./schemas"

interface AppState {
  // UI State
  isMobileMenuOpen: boolean
  activeSection: string

  // Data
  statistics: Statistics
  impactStories: ImpactStory[]
  fundAllocation: FundAllocation[]

  // Forms
  contactForm: Partial<ContactForm>
  donationForm: Partial<Donation>

  // Add to AppState interface
  activeDonationType: "one-time" | "monthly" | "sponsorship"
  selectedAmount: number | null
  customAmount: string
  newsletterEmail: string

  // Actions
  setMobileMenuOpen: (open: boolean) => void
  setActiveSection: (section: string) => void
  updateContactForm: (data: Partial<ContactForm>) => void
  updateDonationForm: (data: Partial<Donation>) => void
  submitContactForm: () => Promise<void>
  submitDonation: () => Promise<void>
  subscribeNewsletter: (email: string) => Promise<void>

  // Add to actions
  setActiveDonationType: (type: "one-time" | "monthly" | "sponsorship") => void
  setSelectedAmount: (amount: number | null) => void
  setCustomAmount: (amount: string) => void
  setNewsletterEmail: (email: string) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isMobileMenuOpen: false,
      activeSection: "accueil",

      statistics: {
        peopleHelped: 152,
        countries: 3,
        activeProjects: 5,
      },

      impactStories: [
        {
          id: "1",
          name: "Fatima",
          age: 45,
          location: "Mali",
          category: "Micro-entreprise",
          story:
            "Grâce au soutien reçu, j'ai pu lancer mon commerce de légumes au marché local et subvenir aux besoins de mes enfants après le décès de mon mari.",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hGI35XcqmhEWca6Y0XCvsuyErkpC6Q.png",
        },
        {
          id: "2",
          name: "Kofi & Ama",
          age: 8,
          location: "Ghana",
          category: "Éducation",
          story:
            "Nous pouvons maintenant aller à l'école tous les jours et nous espérons devenir médecins pour aider les autres comme on nous a aidés.",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-J9JVyAj6oMp51gYb6NXQ8vV75KKp0k.png",
        },
        {
          id: "3",
          name: "Aisha",
          age: 32,
          location: "Sénégal",
          category: "Autonomisation",
          story:
            "Le programme m'a permis de développer mon commerce de fruits. Aujourd'hui, je peux nourrir ma famille et même employer d'autres femmes.",
          image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XZkqaAXeTEHdmiNnPcCFATbkQJZlX7.png",
        },
      ],

      fundAllocation: [
        { category: "Aide directe aux bénéficiaires", percentage: 82, color: "#4f46e5" },
        { category: "Programmes sur le terrain", percentage: 10, color: "#4f46e5" },
        { category: "Administration", percentage: 5, color: "#4f46e5" },
        { category: "Collecte de fonds", percentage: 3, color: "#4f46e5" },
      ],

      contactForm: {},
      donationForm: { type: "one-time" },

      // Add to the initial state:
      activeDonationType: "one-time",
      selectedAmount: null,
      customAmount: "",
      newsletterEmail: "",

      // Actions
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setActiveSection: (section) => set({ activeSection: section }),

      updateContactForm: (data) =>
        set((state) => ({
          contactForm: { ...state.contactForm, ...data },
        })),

      updateDonationForm: (data) =>
        set((state) => ({
          donationForm: { ...state.donationForm, ...data },
        })),

      submitContactForm: async () => {
        const { contactForm } = get()
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contactForm),
          })

          const result = await response.json()

          if (!response.ok) {
            console.error("Contact form submission failed:", result)
            throw new Error(result.error || result.details || "Failed to send message")
          }

          console.log("Contact form submitted successfully:", result)

          // Reset form after successful submission
          set({ contactForm: {} })
          return result
        } catch (error) {
          console.error("Error submitting contact form:", error)
          throw error
        }
      },

      submitDonation: async () => {
        const { donationForm } = get()
        // Simulate API call
        console.log("Processing donation:", donationForm)
      },

      subscribeNewsletter: async (email) => {
        try {
          const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          })

          const result = await response.json()

          if (!response.ok) {
            console.error("Newsletter subscription failed:", result)
            throw new Error(result.error || result.details || "Failed to subscribe to newsletter")
          }

          console.log("Newsletter subscription successful:", result)
          return result
        } catch (error) {
          console.error("Error subscribing to newsletter:", error)
          throw error
        }
      },

      // Add to the actions:
      setActiveDonationType: (type) => set({ activeDonationType: type }),
      setSelectedAmount: (amount) => set({ selectedAmount: amount }),
      setCustomAmount: (amount) => set({ customAmount: amount }),
      setNewsletterEmail: (email) => set({ newsletterEmail: email }),
    }),
    { name: "app-store" },
  ),
)
