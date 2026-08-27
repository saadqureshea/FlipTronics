export type ListingCategory = 'laptop' | 'console' | 'ram' | 'ssd' | 'other'
export type ListingStatus = 'available' | 'limited' | 'sold'

export interface Listing {
  id: string
  title: string
  category: ListingCategory
  brand: string | null
  price: number
  currency: string
  price_firm: boolean
  condition: string
  location: string | null
  status: ListingStatus
  specs: string[]
  description: string | null
  photos: string[]
  featured: boolean
  created_at: string
  updated_at: string
}
