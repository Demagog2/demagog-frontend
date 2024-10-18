'use server'

import { ADMIN_BANNER_VISIBILITY_COOKIE } from '@/libs/constants/cookies'
import { cookies } from 'next/headers'

export async function hideAdminBanner() {
  cookies().set(ADMIN_BANNER_VISIBILITY_COOKIE, 'true')
}
