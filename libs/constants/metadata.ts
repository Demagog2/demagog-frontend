import { Metadata } from 'next'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? 'https://demagog.cz'

const DEFAULT_TITLE = 'Demagog.cz'
const DEFAULT_DESCRIPTION =
  'Demagog.cz je unikátní český projekt, který se zaměřuje na ověřování výroků politiků, dezinformací a dalšího nepravdivého obsahu na sociálních sítích. Usilujeme o kultivaci veřejné diskuse a klademe důraz na transparentní zdroje informací, kritické myšlení a mediální gramotnost.'

export const DefaultMetadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  authors: [{ name: 'Vývojáři demagog.cz', url: 'https://demagog.cz' }],
  keywords: [
    'factcheck',
    'politics',
    'truth',
    'ověřování',
    'politika',
    'pravda',
  ],
  openGraph: {
    title: 'Demagog.cz',
    description: DEFAULT_DESCRIPTION,
    type: 'article',
    url: DOMAIN,
    images: `${DOMAIN}/default-meta-image.png`,
  },
  twitter: {
    title: 'Demagog.cz',
    description: DEFAULT_DESCRIPTION,
    card: 'summary',
    site: '@DemagogCZ',
    images: `${DOMAIN}/default-meta-image.png`,
  },
}
