import type { Meta, StoryObj } from '@storybook/react'
import { LoadingMessage } from '@/components/admin/forms/LoadingMessage'

const meta = {
  title: 'Forms/LoadingMessage',
  component: LoadingMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingMessage>

export default meta
type Story = StoryObj<typeof LoadingMessage>

export const Default: Story = {
  args: {
    message: 'Načítám...',
  },
}

export const LoadingStatement: Story = {
  args: {
    message: 'Nahrávám výrok...',
  },
}

export const LoadingTranscript: Story = {
  args: {
    message: 'Načítám přepis...',
  },
}

export const LoadingData: Story = {
  args: {
    message: 'Načítám data...',
  },
}
