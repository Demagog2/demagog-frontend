import { z } from 'zod'

// See https://gist.github.com/bennettdams/463c804fcfde0eaa888eaa4851c668a1
export const emptyStringToUndefined = z.literal('').transform(() => undefined)
