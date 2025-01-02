import anchorme from 'anchorme'

export const highlightMentions = (commentContent: string) =>
  commentContent.replace(
    /@\[([^\]]+)\]\([^\)]+\)/g,
    '<span class="highlight">$1</span>'
  )

export const nicerLinks = (commentContent: string) =>
  anchorme({
    input: commentContent,
    options: {
      truncate: 30,
      middleTruncation: true,
      attributes: { name: 'target', value: '_blank' },
    },
  })

export const newlinesToParagraphsAndBreaks = (
  commentContent: string
): string => {
  let paragraphs = commentContent.split(/(?:\r\n|\r|\n){2,}/)

  paragraphs = paragraphs.map((paragraph) => {
    const lines = paragraph.split(/(?:\r\n|\r|\n)/)

    return lines.join('<br>')
  })

  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')
}
