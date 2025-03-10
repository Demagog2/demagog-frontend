import type { Preview } from '@storybook/react'
import '../assets/styles/tailwind.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
    },
    nextjs: {
      appDirectory: true,
    },
  },
}

export default preview
