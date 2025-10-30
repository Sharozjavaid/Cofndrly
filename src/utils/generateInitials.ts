// Generate a data URL for an initials image
export const generateInitialsImage = (name: string): string => {
  // Get initials (first letter of first and last name)
  const nameParts = name.trim().split(' ')
  const initials = nameParts.length >= 2
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase()

  // Create canvas
  const canvas = document.createElement('canvas')
  const size = 400
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  if (!ctx) return ''

  // Background gradient - Forest to Mint
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#456456') // forest green
  gradient.addColorStop(1, '#7FB685') // mint green
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  // Draw initials
  ctx.fillStyle = '#FFFFFF' // white
  ctx.font = `bold ${size * 0.4}px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, size / 2, size / 2)

  // Return data URL
  return canvas.toDataURL('image/png')
}

