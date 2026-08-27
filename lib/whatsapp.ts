const WHATSAPP_NUMBER = '923279754940' // FlipTronics WhatsApp — no leading 0, country code 92 for Pakistan

export function whatsappLink(message: string) {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function listingWhatsappLink(title: string) {
  return whatsappLink(`Hi, I'm interested in the ${title} on FlipTronics`)
}
