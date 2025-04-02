import type { MetadataRoute } from 'next'

const DEFAULT_RULE = {
  userAgent: '*',
  allow: '/',
  disallow: [
    '/admin/',
    '/beta/admin',
    '*?q=*',
    '*?veracity=*',
    '*&veracity=*',
    '*?veracities=*',
    '*&veracities=*',
    '*?hodnoceni*',
    '*&hodnoceni*',
    '*?recnik*',
    '*&recnik*',
    '*?oblast*',
    '*&oblast*',
    '*?tema*',
    '*&tema*',
    '*?hc_location*',
    '*&hc_location*',
  ],
}

const DISSALLOW_ALL_RULE = {
  userAgent: '*',
  disallow: ['/'],
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: process.env.ROBOTS_ALLOW_NOTHING ? DISSALLOW_ALL_RULE : DEFAULT_RULE,
  }
}
