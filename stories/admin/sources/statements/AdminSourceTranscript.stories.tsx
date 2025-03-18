import type { Meta, StoryObj } from '@storybook/react'
import { AdminSourceTranscript } from '@/components/admin/sources/statements/AdminSourceTranscript'
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof AdminSourceTranscript> = {
  title: 'Admin/Sources/Statements/AdminSourceTranscript',
  component: AdminSourceTranscript,
  tags: ['autodocs'],
  args: {
    onStatementClick: action('onStatementClick'),
  },
  parameters: {
    docs: {
      description: {
        component: `
A component that displays a transcript with highlighted statements.

## Interactions
- Click on highlighted text to select a statement (triggers onStatementClick with statement ID)
- Click on non-highlighted text or empty space to clear selection (triggers onStatementClick with null)
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AdminSourceTranscript>

export const Empty: Story = {
  args: {
    transcript: '',
    statementTranscriptPositions: [],
  },
}

export const SingleLine: Story = {
  args: {
    transcript: 'This is a single line transcript.',
    statementTranscriptPositions: [
      {
        startLine: 0,
        startOffset: 5,
        endLine: 0,
        endOffset: 16,
        statementId: 'statement-1',
      },
    ],
  },
}

export const MultiLine: Story = {
  args: {
    transcript: `First line of the transcript.
Second line with some content.
Third line with more text.
Fourth line to show formatting.`,
    statementTranscriptPositions: [
      {
        startLine: 0,
        startOffset: 0,
        endLine: 1,
        endOffset: 20,
        statementId: 'statement-1',
      },
      {
        startLine: 2,
        startOffset: 0,
        endLine: 2,
        endOffset: 24,
        statementId: 'statement-2',
      },
    ],
  },
}

export const LongText: Story = {
  args: {
    transcript: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
    statementTranscriptPositions: [
      {
        startLine: 0,
        startOffset: 28,
        endLine: 0,
        endOffset: 82,
        statementId: 'statement-1',
      },
      {
        startLine: 2,
        startOffset: 0,
        endLine: 2,
        endOffset: 50,
        statementId: 'statement-2',
      },
    ],
  },
}

export const OverlappingHighlights: Story = {
  args: {
    transcript: 'This is a test of overlapping highlights in the text.',
    statementTranscriptPositions: [
      {
        startLine: 0,
        startOffset: 5,
        endLine: 0,
        endOffset: 25,
        statementId: 'statement-1',
      },
      {
        startLine: 0,
        startOffset: 15,
        endLine: 0,
        endOffset: 35,
        statementId: 'statement-2',
      },
    ],
  },
}

export const MultipleHighlightsPerLine: Story = {
  args: {
    transcript:
      'This line has multiple separate highlights to demonstrate spacing.',
    statementTranscriptPositions: [
      {
        startLine: 0,
        startOffset: 5,
        endLine: 0,
        endOffset: 9,
        statementId: 'statement-1',
      },
      {
        startLine: 0,
        startOffset: 15,
        endLine: 0,
        endOffset: 23,
        statementId: 'statement-2',
      },
      {
        startLine: 0,
        startOffset: 32,
        endLine: 0,
        endOffset: 42,
        statementId: 'statement-3',
      },
    ],
  },
}

export const CrossParagraphHighlight: Story = {
  args: {
    transcript: `This is the first paragraph with some text.
This is still the first paragraph.

This is the second paragraph.
And this continues the second one.`,
    statementTranscriptPositions: [
      {
        startLine: 0,
        startOffset: 8,
        endLine: 1,
        endOffset: 20,
        statementId: 'statement-1',
      },
      {
        startLine: 3,
        startOffset: 0,
        endLine: 4,
        endOffset: 33,
        statementId: 'statement-2',
      },
    ],
  },
}

export const NestedHighlights: Story = {
  args: {
    transcript: 'This demonstrates nested highlights within the text.',
    statementTranscriptPositions: [
      {
        startLine: 0,
        startOffset: 5,
        endLine: 0,
        endOffset: 35,
        statementId: 'statement-1',
      },
      {
        startLine: 0,
        startOffset: 17,
        endLine: 0,
        endOffset: 23,
        statementId: 'statement-2',
      },
    ],
  },
}

export const PartialWordHighlights: Story = {
  args: {
    transcript: 'Highlighting parts of words demonstrates precise selection.',
    statementTranscriptPositions: [
      {
        startLine: 0,
        startOffset: 4,
        endLine: 0,
        endOffset: 8,
        statementId: 'statement-1',
      },
      {
        startLine: 0,
        startOffset: 19,
        endLine: 0,
        endOffset: 23,
        statementId: 'statement-2',
      },
      {
        startLine: 0,
        startOffset: 41,
        endLine: 0,
        endOffset: 45,
        statementId: 'statement-3',
      },
    ],
  },
}
