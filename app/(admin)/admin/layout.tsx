// Invalidate pages after n seconds
// See: https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 60

import '../../../assets/styles/tailwind.css'
import AdminClientLayout from '@/components/admin/AdminClientLayout'
import { adminQuery } from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import { ApolloError } from '@apollo/client'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let adminData = null
  try {
    const { data } = await adminQuery({
      query: gql(`
        query AdminLayout {
          ...AdminClientLayout
        }
      `),
    })

    adminData = data
  } catch (error) {
    if (error instanceof ApolloError) {
      // Redirect to proper login page
      return redirect('http://localhost:3000/admin/test-login/240')
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
