import type { Meta, StoryObj } from '@storybook/react'
import { AdminActivityToast } from '@/components/admin/sources/statements/AdminActivityToast'
import { ToastContainer, toast } from 'react-toastify'

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
      activityType: 'comment_created',
      commentId: '1234',
      user: {
        fullName: 'Jezevec Chrujda',
        avatar: avatarExample,
      },
      message: 'Jak potkal svou velkou lasecku',
    },
  },
}

export const LongMessage: Story = {
  args: {
    activityData: {
      commentId: '12345',
      user: {
        fullName: 'Jezevec Chrujda',
        avatar: null,
      },
      activityType: 'comment_created',
      message:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae mollitia odit, est alias ab atque!',
    },
  },
}

export const WithReactToastify: Story = {
  args: {
    activityData: {
      commentId: '12345',
      user: {
        fullName: 'Jezevec Chrujda',
        avatar: null,
      },
      activityType: 'comment_created',
      message:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae mollitia odit, est alias ab atque!',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ margin: '3em', height: '100vh' }}>
        <ToastContainer theme="light" />

        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      <button
        onClick={() =>
          toast(<AdminActivityToast {...args} />, { hideProgressBar: true })
        }
      >
        Click me!
      </button>
    </>
  ),
}
