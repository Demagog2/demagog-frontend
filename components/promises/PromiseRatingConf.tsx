import { PromiseRatingKey } from '@/__generated__/graphql'

import Fulfilled from '@/assets/icons/promises/fulfilled.svg'
import InProgress from '@/assets/icons/promises/in_progress.svg'
import PartiallyFulfilled from '@/assets/icons/promises/partially_fulfilled.svg'
import Broken from '@/assets/icons/promises/broken.svg'
import Stalled from '@/assets/icons/promises/stalled.svg'
import NotYetEvaluated from '@/assets/icons/promises/not_yet_evaluated.svg'

export const PromiseRatings = {
  [PromiseRatingKey.Fulfilled]: {
    backgroundColor: 'bg-primary',
    textColor: 'text-primary',
    label: {
      singular: 'splněný',
      plural: 'splněné',
      other: 'splněno',
    },
    icon: Fulfilled,
    isVisible: () => true,
  },
  [PromiseRatingKey.InProgress]: {
    backgroundColor: 'bg-primary-light',
    textColor: 'text-primary-light',
    label: {
      singular: 'rozpracovaný',
      plural: 'rozpracované',
      other: 'rozpracováno',
    },
    icon: InProgress,
    isVisible: () => true,
  },
  [PromiseRatingKey.PartiallyFulfilled]: {
    backgroundColor: 'bg-secondary',
    textColor: 'text-secondary',
    label: {
      singular: 'část. splněný',
      plural: 'část. splněné',
      other: 'část. splněno',
    },
    icon: PartiallyFulfilled,
    isVisible: () => true,
  },
  [PromiseRatingKey.NotYetEvaluated]: {
    backgroundColor: 'bg-dark',
    textColor: 'text-dark',
    label: {
      singular: 'zatím nehodnocený',
      plural: 'zatím nehodnocené',
      other: 'zatím nehodnoceno',
    },
    icon: NotYetEvaluated,
    isVisible: (count: number) => count > 0,
  },
  [PromiseRatingKey.Broken]: {
    backgroundColor: 'bg-red',
    textColor: 'text-red',
    label: {
      singular: 'porušený',
      plural: 'porušené',
      other: 'porušeno',
    },
    icon: Broken,
    isVisible: () => true,
  },
  [PromiseRatingKey.Stalled]: {
    backgroundColor: 'bg-gray',
    textColor: 'text-gray',
    label: {
      singular: 'nerealizovaný',
      plural: 'nerealizované',
      other: 'nerealizováno',
    },
    icon: Stalled,
    isVisible: () => true,
  },
}
