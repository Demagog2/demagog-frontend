import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.query

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' })
  }

  // Validate that the URL is from an allowed domain
  const allowedDomains = [
    'https://demagog.cz',
    'https://www.demagog.cz',
    'https://api.demagog.cz',
  ]

  let isAllowedDomain = false;
  try {
    const parsedUrl = new URL(url);
    isAllowedDomain = allowedDomains.some((domain) => parsedUrl.origin === domain);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!isAllowedDomain) {
    return res.status(403).json({ error: 'Domain not allowed' })
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
