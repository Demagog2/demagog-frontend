'use client'

interface StatementTranscriptPosition {
  startLine: number
  startOffset: number
  endLine: number
  endOffset: number
  statementId: string
}

interface TranscriptPosition {
  startLine: number
  startOffset: number
  endLine: number
  endOffset: number
  text: string
}

interface AdminSourceTranscriptProps {
  transcript: string
  statementTranscriptPositions?: StatementTranscriptPosition[]
  onStatementClick?: (statementId: string | null) => void
  onTextSelect?: (position: TranscriptPosition | null) => void
}

export function AdminSourceTranscript({
  transcript,
  statementTranscriptPositions = [],
  onStatementClick,
  onTextSelect,
}: AdminSourceTranscriptProps) {
  // Split transcript into lines for easier processing
  const lines = transcript.split('\n')

  const handleSelectionChange = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      onTextSelect?.(null)
      return
    }

    const range = selection.getRangeAt(0)
    let parentElement = range.startContainer.parentElement
    while (parentElement && parentElement.tagName !== 'PRE') {
      parentElement = parentElement.parentElement
    }

    if (!parentElement) {
      onTextSelect?.(null)
      return
    }

    // Get all text nodes in the pre element
    const textNodes: Node[] = []
    const walker = document.createTreeWalker(
      parentElement,
      NodeFilter.SHOW_TEXT,
      null
    )

    let node = walker.nextNode()
    while (node) {
      textNodes.push(node)
      node = walker.nextNode()
    }

    // Find start and end positions
    let startLine = 0
    let startOffset = 0
    let endLine = 0
    let endOffset = 0
    let currentLine = 0
    let currentOffset = 0

    for (const node of textNodes) {
      const nodeLength = node.textContent?.length || 0

      if (node === range.startContainer) {
        startLine = currentLine
        startOffset = currentOffset + range.startOffset
      }

      if (node === range.endContainer) {
        endLine = currentLine
        endOffset = currentOffset + range.endOffset
        break
      }

      if (node.textContent === '\n') {
        currentLine++
        currentOffset = 0
      } else {
        currentOffset += nodeLength
      }
    }

    // Get the selected text
    const selectedText = selection.toString().trim()

    onTextSelect?.({
      startLine,
      startOffset,
      endLine,
      endOffset,
      text: selectedText,
    })
  }

  // Create spans with highlights for statements
  const renderedLines = lines.map((line, lineIndex) => {
    const linePositions = statementTranscriptPositions.filter(
      (pos) => lineIndex >= pos.startLine && lineIndex <= pos.endLine
    )

    if (linePositions.length === 0) {
      return (
        <span key={lineIndex}>
          {line}
          {'\n'}
        </span>
      )
    }

    // Sort positions by startOffset to handle overlapping highlights
    const sortedPositions = [...linePositions].sort(
      (a, b) => a.startOffset - b.startOffset
    )

    let currentPosition = 0
    const segments: JSX.Element[] = []

    sortedPositions.forEach((pos, index) => {
      const startOffset = lineIndex === pos.startLine ? pos.startOffset : 0
      const endOffset = lineIndex === pos.endLine ? pos.endOffset : line.length

      // Add non-highlighted text before this position if needed
      if (currentPosition < startOffset) {
        segments.push(
          <span key={`${lineIndex}-${index}-before`}>
            {line.substring(currentPosition, startOffset)}
          </span>
        )
      }

      // Add highlighted text
      segments.push(
        <span
          key={`${lineIndex}-${index}-highlight`}
          className="bg-yellow-200 bg-opacity-40 cursor-pointer hover:bg-yellow-300 hover:bg-opacity-40"
          onClick={(e) => {
            e.stopPropagation()
            onStatementClick?.(pos.statementId)
          }}
        >
          {line.substring(startOffset, endOffset)}
        </span>
      )

      currentPosition = endOffset
    })

    // Add any remaining non-highlighted text
    if (currentPosition < line.length) {
      segments.push(
        <span key={`${lineIndex}-end`}>{line.substring(currentPosition)}</span>
      )
    }

    // Add line break
    segments.push(<span key={`${lineIndex}-break`}>{'\n'}</span>)

    return <span key={lineIndex}>{segments}</span>
  })

  return (
    <pre
      className="whitespace-pre-wrap font-sans text-base leading-relaxed p-4 sm:ml-2 lg:ml-4 bg-white rounded-lg shadow"
      onMouseUp={handleSelectionChange}
      onMouseDown={() => onStatementClick?.(null)}
    >
      {renderedLines}
    </pre>
  )
}
