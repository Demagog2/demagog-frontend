import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  try {
    // Fetch the image from the external server
    const response = await fetch(url)

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Failed to fetch image' })
    }

    // Get the content type from the original response
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // Set CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // Set the content type
    res.setHeader('Content-Type', contentType)

    // Stream the image data to the response
    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (error) {
    console.error('Error proxying image:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
