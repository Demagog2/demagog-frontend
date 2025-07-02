import type { Meta, StoryObj } from '@storybook/react'
import { AdminPresentUsers } from '@/components/admin/sources/statements/AdminPresentUsers'

const meta: Meta<typeof AdminPresentUsers> = {
  title: 'Admin/PresentUsers/AdminPresentUsers',
  component: AdminPresentUsers,
  tags: ['autodocs'],
  args: {},
  parameters: {
    docs: {
      description: {
        component: `
TODO: Add description or something
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof AdminPresentUsers>

// const exampleAvatar =
//   '/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbklJIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--16a2e8f4f2e601097f178d61da325ad7e2e1f151/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2d0eVpYTnBlbVZKSWdvME1YZzBNUVk3QmxRNkRIRjFZV3hwZEhscFpBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--98c80e9146f057764a612b1acfe22d478ced2fa0/0.jpeg'

export const Empty: Story = {
  args: {
    presentUsers: [],
  },
}

export const OneUser: Story = {
  args: {
    presentUsers: [{ id: 1, avatar: null, fullName: 'Jezevec Chrujda' }],
  },
}

// TODO: Add more examples and make it super pretty!
