import {
  Schema,
  Element,
  Range,
  Writer,
  Position,
  DocumentFragment,
  first,
  Editor,
  NodeAttributes,
} from 'ckeditor5'

import { curry } from 'lodash'

// FIXME: Add license and reference original source code in ck-editor

/**
 * Checks whether <modelName> can wrap the block.
 */
function checkCanBeWrapped(
  schema: Schema,
  block: Element,
  modelName: string
): boolean {
  // TMP will be replaced with schema.checkWrap().
  const isWrappingAllowed = schema.checkChild(
    block.parent as Element,
    modelName
  )
  const isBlockAllowedInWrapper = schema.checkChild(['$root', modelName], block)

  return isWrappingAllowed && isBlockAllowedInWrapper
}

/**
 * Returns a minimal array of ranges containing groups of subsequent blocks.
 *
 * content:         abcdefgh
 * blocks:          [ a, b, d, f, g, h ]
 * output ranges:   [ab]c[d]e[fgh]
 */
function getRangesOfBlockGroups(
  writer: Writer,
  blocks: Array<Element>
): Array<Range> {
  let startPosition
  let i = 0
  const ranges = []

  while (i < blocks.length) {
    const block = blocks[i]
    const nextBlock = blocks[i + 1]

    if (!startPosition) {
      startPosition = writer.createPositionBefore(block)
    }

    if (!nextBlock || block.nextSibling != nextBlock) {
      ranges.push(
        writer.createRange(startPosition, writer.createPositionAfter(block))
      )
      startPosition = null
    }

    i++
  }

  return ranges
}

const findWrapper = curry(
  (
    modelName: string,
    elementOrPosition: Element | Position
  ): Element | DocumentFragment | null => {
    return elementOrPosition.parent!.name == modelName
      ? elementOrPosition.parent
      : null
  }
)

export function checkWrapperValue(editor: Editor, modelName: string) {
  const selection = editor.model.document.selection

  const firstBlock = first(selection.getSelectedBlocks())

  // In the current implementation, the block quote must be an immediate parent of a block element.
  return !!(firstBlock && findWrapper(modelName, firstBlock))
}

export function checkWrapperEnabled(
  editor: Editor,
  modelName: string,
  value: boolean
): boolean {
  if (value) {
    return true
  }

  const selection = editor.model.document.selection
  const schema = editor.model.schema

  const firstBlock = first(selection.getSelectedBlocks())

  if (!firstBlock) {
    return false
  }

  return checkCanBeWrapped(schema, firstBlock, modelName)
}

/**
 * Removes the wrapper from given blocks.
 *
 * If blocks which are supposed to be "unwrapped" are in the middle of a wrapped content,
 * start it or end it, then the wrapped content will be split (if needed) and the blocks
 * will be moved out of it, so other wrapped blocks remained wrapped.
 */
export function removeWrapper(
  writer: Writer,
  modelName: string,
  blocks: Array<Element>
): void {
  // Unquote all groups of block. Iterate in the reverse order to not break following ranges.
  getRangesOfBlockGroups(writer, blocks.filter(findWrapper(modelName)))
    .reverse()
    .forEach((groupRange) => {
      if (groupRange.start.isAtStart && groupRange.end.isAtEnd) {
        writer.unwrap(groupRange.start.parent as Element)

        return
      }

      // The group of blocks are at the beginning of an <bQ> so let's move them left (out of the <bQ>).
      if (groupRange.start.isAtStart) {
        const positionBefore = writer.createPositionBefore(
          groupRange.start.parent as Element
        )

        writer.move(groupRange, positionBefore)

        return
      }

      // The blocks are in the middle of an <bQ> so we need to split the <bQ> after the last block
      // so we move the items there.
      if (!groupRange.end.isAtEnd) {
        writer.split(groupRange.end)
      }

      // Now we are sure that groupRange.end.isAtEnd is true, so let's move the blocks right.

      const positionAfter = writer.createPositionAfter(
        groupRange.end.parent as Element
      )

      writer.move(groupRange, positionAfter)
    })
}

/**
 * Applies the quote to given blocks.
 */
export function applyWrapper(
  editor: Editor,
  writer: Writer,
  blocks: Array<Element>,
  modelName: string,
  wrapperAttributes: NodeAttributes = {}
): void {
  const blocksToQuote = blocks.filter((block) => {
    // Already quoted blocks needs to be considered while quoting too
    // in order to reuse their <bQ> elements.
    return (
      findWrapper(modelName, block) ||
      checkCanBeWrapped(editor.model.schema, block, modelName)
    )
  })

  const quotesToMerge: Array<Element | DocumentFragment> = []

  // Quote all groups of block. Iterate in the reverse order to not break following ranges.
  getRangesOfBlockGroups(writer, blocksToQuote)
    .reverse()
    .forEach((groupRange) => {
      let quote = findWrapper(modelName, groupRange.start)

      if (!quote) {
        quote = writer.createElement(modelName, wrapperAttributes)

        writer.wrap(groupRange, quote)
      }

      quotesToMerge.push(quote)
    })

  // Merge subsequent <bQ> elements. Reverse the order again because this time we want to go through
  // the <bQ> elements in the source order (due to how merge works – it moves the right element's content
  // to the first element and removes the right one. Since we may need to merge a couple of subsequent `<bQ>` elements
  // we want to keep the reference to the first (furthest left) one.
  quotesToMerge.reverse().reduce((currentQuote, nextQuote) => {
    if (currentQuote.nextSibling == nextQuote) {
      writer.merge(writer.createPositionAfter(currentQuote))

      return currentQuote
    }

    return nextQuote
  })
}
