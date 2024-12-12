export const highlightMentions = (commentContent: string) =>
  commentContent.replace(
    /@\[([^\]]+)\]\([^\)]+\)/g,
    '<span class="highlight">$1</span>'
  )

// const nicerLinks = (commentContent: string) =>
//   anchorme(commentContent, {
//     truncate: [30, 15],
//     attributes: [{ name: 'target', value: '_blank' }],
//     // Bugfix for percent being encoded twice, see https://github.com/alexcorvi/anchorme.js/issues/49
//     exclude: (urlObj) => {
//       urlObj.encoded = urlObj.encoded.replace(/%25/g, '%')
//       return false
//     },
//   })

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
