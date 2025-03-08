import type { Meta, StoryObj } from '@storybook/react'
import { AdminVideoMark } from '../../../components/admin/sources/statements/controls/AdminVideoMark'
import { useState } from 'react'

const meta = {
  title: 'Admin/Controls/VideoMark',
  component: AdminVideoMark,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AdminVideoMark>

export default meta
type Story = StoryObj<typeof AdminVideoMark>

const VideoMarkWithState = () => {
  const [value, setValue] = useState(3661) // 1:01:01
  return <AdminVideoMark value={value} onChange={setValue} />
}

export const Default: Story = {
  args: {
    value: 3661, // 1:01:01
    onChange: (value: number) => console.log('Time changed:', value),
  },
}

export const WithState: Story = {
  render: () => <VideoMarkWithState />,
}

export const ZeroTime: Story = {
  args: {
    value: 0,
    onChange: (value: number) => console.log('Time changed:', value),
  },
}

export const LongDuration: Story = {
  args: {
    value: 7322, // 2:02:02
    onChange: (value: number) => console.log('Time changed:', value),
  },
}
