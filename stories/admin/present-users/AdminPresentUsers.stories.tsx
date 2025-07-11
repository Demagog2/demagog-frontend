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
        component: `Active users testing`,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof AdminPresentUsers>

const exampleAvatar =
  '/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbklJIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--16a2e8f4f2e601097f178d61da325ad7e2e1f151/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2d0eVpYTnBlbVZKSWdvME1YZzBNUVk3QmxRNkRIRjFZV3hwZEhscFpBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--98c80e9146f057764a612b1acfe22d478ced2fa0/0.jpeg'

const exampleAvatar2 =
  '/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdEJjIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--18f48f9eef443b2a2fde4dd78aef4963c9b9906a/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2QzNKbGMybDZaVWtpQ2pReGVEUXhCanNHVkRvTWNYVmhiR2wwZVdsayIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--034d533cb3aeaf5e69018fae78df6508b2794613/T04DQ7AV8DB-U0707L4NMST-bae1c4a188d8-512.jpg'

export const Empty: Story = {
  args: {
    presentUsers: [],
    typingUserIds: [],
  },
}

export const OneUser: Story = {
  args: {
    presentUsers: [{ id: 1, avatar: null, fullName: 'Jezevec Chrujda' }],
    typingUserIds: [1],
  },
}

export const UserWithAvatar: Story = {
  args: {
    presentUsers: [
      { id: 2, avatar: exampleAvatar, fullName: 'Sovicka Stanicka' },
    ],
    typingUserIds: [2],
  },
}
export const UsersWithAvatars: Story = {
  args: {
    presentUsers: [
      { id: 2, avatar: exampleAvatar, fullName: 'Sovicka Stanicka' },
      { id: 3, avatar: exampleAvatar2, fullName: 'Lasicka Anicka' },
      { id: 4, avatar: exampleAvatar2, fullName: 'Jezeved Chrujda' },
      { id: 5, avatar: exampleAvatar, fullName: 'Krtek Krtouch' },
      { id: 6, avatar: exampleAvatar2, fullName: 'Sovicka Stanicka' },
    ],
    typingUserIds: [2, 3, 5],
  },
}
export const TooManyUsers: Story = {
  args: {
    presentUsers: [
      { id: 2, avatar: exampleAvatar, fullName: 'Sovicka Stanicka' },
      { id: 3, avatar: exampleAvatar2, fullName: 'Lasicka Anicka' },
      { id: 4, avatar: exampleAvatar2, fullName: 'Jezeved Chrujda' },
      { id: 5, avatar: exampleAvatar, fullName: 'Krtek Krtouch' },
      { id: 6, avatar: exampleAvatar2, fullName: 'Sovicka Stanicka' },
      { id: 7, avatar: exampleAvatar, fullName: 'Sovicka Stanicka' },
      { id: 8, avatar: exampleAvatar2, fullName: 'Lasicka Anicka' },
      { id: 9, avatar: exampleAvatar2, fullName: 'Jezeved Chrujda' },
      { id: 10, avatar: exampleAvatar, fullName: 'Krtek Krtouch' },
      { id: 11, avatar: exampleAvatar2, fullName: 'Sovicka Stanicka' },
      { id: 12, avatar: exampleAvatar, fullName: 'Krtek Krtouch' },
      { id: 13, avatar: exampleAvatar2, fullName: 'Sovicka Stanicka' },
    ],
    typingUserIds: [2, 3, 5, 6, 7, 8],
  },
}

export const TooManyUsersWithoutAvatar: Story = {
  args: {
    presentUsers: [
      { id: 2, avatar: null, fullName: 'Sovicka Stanicka' },
      { id: 3, avatar: null, fullName: 'Lasicka Anicka' },
      { id: 4, avatar: null, fullName: 'Jezeved Chrujda' },
      { id: 6, avatar: null, fullName: 'Sovicka Stanicka' },
      { id: 7, avatar: null, fullName: 'Sovicka Stanicka' },
      { id: 8, avatar: null, fullName: 'Lasicka Anicka' },
      { id: 9, avatar: null, fullName: 'Jezeved Chrujda' },
      { id: 10, avatar: null, fullName: 'Krtek Krtouch' },
      { id: 11, avatar: null, fullName: 'Sovicka Stanicka' },
      { id: 12, avatar: null, fullName: 'Krtek Krtouch' },
      { id: 13, avatar: null, fullName: 'Sovicka Stanicka' },
    ],
    typingUserIds: [2, 8],
  },
}
