import type { Meta, StoryObj } from '@storybook/react'
import { AdminActivityToast } from '@/components/admin/sources/statements/AdminActivityToast'

const meta: Meta<typeof AdminActivityToast> = {
  title: 'Admin/ActivityToast/AdminActivityToast',
  component: AdminActivityToast,
  tags: ['autodocs'],
  args: {},
  parameters: {
    docs: {
      description: {
        component: `A component that displays information about new activity in the statement activities`,
      },
    },
  },
}

const avatarExample =
  '/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbklJIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--16a2e8f4f2e601097f178d61da325ad7e2e1f151/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdDRG9MWm05eWJXRjBTU0lKYW5CbFp3WTZCa1ZVT2d0eVpYTnBlbVZKSWdvME1YZzBNUVk3QmxRNkRIRjFZV3hwZEhscFpBPT0iLCJleHAiOm51bGwsInB1ciI6InZhcmlhdGlvbiJ9fQ==--98c80e9146f057764a612b1acfe22d478ced2fa0/0.jpeg'

export default meta
type Story = StoryObj<typeof AdminActivityToast>

export const Default: Story = {
  args: {
    activityData: {
      user: {
        fullName: 'Jezevec Chrujda',
        avatar: avatarExample,
      },
      time: 'teď',
      message: 'Přidal nový komentář',
    },
  },
}

export const LongMessage: Story = {
  args: {
    activityData: {
      user: {
        fullName: 'Jezevec Chrujda',
        avatar: null,
      },
      time: 'teď',
      message:
        'Přidal nový komentář v diskuzi o Tchoři Smradolfovi, který chtěl Chrujdovi ukrást mapu nakreslenou na březovou kůru, která by ho zavedla k pokladu.',
    },
  },
}
