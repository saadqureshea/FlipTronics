const WHATSAPP_NUMBER = '923279754940' // FlipTronics WhatsApp — no leading 0, country code 92 for Pakistan
const SITE_URL = 'https://fliptronics.vercel.app' // update this if you attach a custom domain

export function whatsappLink(message: string) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function listingWhatsappLink(listing: {
  id: string
  title: string
  price: number
  currency: string
  condition: string
  specs: string[]
}) {
  const specsLine = listing.specs.length ? `\nSpecs: ${listing.specs.join(', ')}` : ''
  const message =
    `Hi, I'm interested in the ${listing.title} (${listing.condition}) — ` +
    `${listing.currency} ${listing.price.toLocaleString()} on FlipTronics.` +
    `${specsLine}\n${SITE_URL}/listing/${listing.id}`
  return whatsappLink(message)
}
