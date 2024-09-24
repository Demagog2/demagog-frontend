import '../../../assets/styles/tailwind.css'

import AdminClientLayout from '@/components/admin/AdminClientLayout'
import { serverQuery } from '@/libs/apollo-client-server'
import { gql } from '@/__generated__'
import { ApolloError } from '@apollo/client'
import { redirect } from 'next/navigation'

// Invalidate pages after n seconds
// See: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate

export const revalidate = 60

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <html lang="cs" className="h-full">
      <body className="h-full">
        {adminData && (
          <AdminClientLayout data={adminData}>{children}</AdminClientLayout>
        )}
      </body>
    </html>
  )
}
