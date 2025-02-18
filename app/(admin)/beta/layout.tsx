import '../../../assets/styles/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'
import 'ckeditor5/ckeditor5.css'

import AdminClientLayout from '@/components/admin/AdminClientLayout'
import { serverQuery } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { ApolloError } from '@apollo/client'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ADMIN_BANNER_VISIBILITY_COOKIE } from '@/libs/constants/cookies'
import { ToastContainer } from 'react-toastify'

// Invalidate pages after n seconds
// See: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate

export const revalidate = 60

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()

  let adminData = null
  try {
    const { data } = await serverQuery({
      query: gql(`
        query AdminLayout {
          ...AdminClientLayout
        }
      `),
    })

    adminData = data
  } catch (error) {
    if (error instanceof ApolloError) {
      return redirect(process.env.ADMIN_LOGIN_REDIRECT ?? '')
    }
  }

  const isBannerVisible = !cookieStore.has(ADMIN_BANNER_VISIBILITY_COOKIE)

  return (
    <html lang="cs" className="h-full">
      <body className="h-full">
        {adminData && (
          <AdminClientLayout isBannerVisible={isBannerVisible} data={adminData}>
            {children}
            <ToastContainer theme="light" />
          </AdminClientLayout>
        )}
      </body>
    </html>
  )
}
