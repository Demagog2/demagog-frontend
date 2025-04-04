import { diffWords } from 'diff'

interface DiffChange {
  value: string
  added?: boolean
  removed?: boolean
}

export function highlightTextDifferences(oldText: string, newText: string) {
  const differences = diffWords(oldText, newText)

  const oldTextWithHighlights = differences
    .filter((diff: DiffChange) => !diff.added)
    .map((diff: DiffChange) => {
      if (diff.removed) {
        return `<span class="bg-red-100 line-through">${diff.value}</span>`
      }
      return diff.value
    })
    .join('')

  const newTextWithHighlights = differences
    .filter((diff: DiffChange) => !diff.removed)
    .map((diff: DiffChange) => {
      if (diff.added) {
        return `<span class="bg-green-100">${diff.value}</span>`
      }
      return diff.value
    })
    .join('')

  return {
    oldTextWithHighlights,
    newTextWithHighlights,
  }
}
