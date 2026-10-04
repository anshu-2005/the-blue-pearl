import { NextRequest } from 'next/server'

// Generates a gold-on-maroon SVG placeholder for missing product images
export async function GET(request: NextRequest) {
    const text = request.nextUrl.searchParams.get('text') || 'Product Image'
    const displayText = decodeURIComponent(text).slice(0, 30)

    const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#2A0A14"/>
      <rect x="2" y="2" width="396" height="396" fill="none" stroke="#C9A66B" stroke-width="1" opacity="0.4"/>
      
      <!-- Diamond motif -->
      <polygon points="200,160 215,175 200,190 185,175" fill="#C9A66B" opacity="0.5"/>
      
      <!-- Brand name -->
      <text 
        x="200" y="220" 
        font-family="Georgia, serif" 
        font-size="13" 
        font-style="italic"
        fill="#C9A66B" 
        opacity="0.7"
        text-anchor="middle">
        The Blue Pearl
      </text>
      
      <!-- Product name -->
      <text 
        x="200" y="248" 
        font-family="Georgia, serif" 
        font-size="15" 
        font-weight="bold"
        fill="#C9A66B" 
        text-anchor="middle">
        ${displayText.length > 20 ? displayText.slice(0, 20) + '...' : displayText}
      </text>
      
      <text 
        x="200" y="270" 
        font-family="Arial, sans-serif" 
        font-size="10" 
        fill="#C9A66B" 
        opacity="0.4"
        text-anchor="middle">
        Image Coming Soon
      </text>
    </svg>
  `.trim()

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
        },
    })
}
