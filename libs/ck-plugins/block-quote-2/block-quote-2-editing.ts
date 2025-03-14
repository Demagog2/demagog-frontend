import { Plugin, Enter, Delete } from 'ckeditor5'
import { BlockQuoteWithSpeakerCommmand as BlockQuoteWithSpeakerCommmand } from './block-quote-2-command'
import { query } from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import { displayDate } from '@/libs/date-time'

export class BlockQuoteEditingWithSpeakerEditing extends Plugin {
  /**
   * @inheritDoc
   */
  public static get pluginName() {
    return 'BlockQuoteWithSpeakerEditing' as const
  }

  /**
   * @inheritDoc
   */
  public static override get isOfficialPlugin(): false {
    return false
  }

  /**
   * @inheritDoc
   */
  public static get requires() {
    return [Enter, Delete] as const
  }

  /**
   * @inheritDoc
   */
  public init(): void {
    const editor = this.editor
    const schema = editor.model.schema
    const domConverter = editor.editing.view.domConverter

    editor.commands.add(
      'blockQuoteWithSpeaker',
      new BlockQuoteWithSpeakerCommmand(editor)
    )

    schema.register('blockQuoteWithSpeaker', {
      inheritAllFrom: '$container',
      allowAttributes: [
        'speakerId',
        'link',
        'media',
        'quotedAt',
        'speakerCustomName',
      ],
    })

    // View -> Model
    editor.conversion
      .for('upcast')
      // div.statement-embed
      .elementToElement({
        view: {
          name: 'blockquote',
        },
        model: (viewFigure, { writer }) => {
          const domElement = domConverter.viewToDom(viewFigure)

          const speakerId = domElement.dataset.speakerId
          const link = domElement.dataset.link
          const media = domElement.dataset.media
          const quotedAt = domElement.dataset.quotedAt
          const speakerCustomName = domElement.dataset.speakerCustomName

          return writer.createElement('blockQuoteWithSpeaker', {
            speakerId,
            media,
            quotedAt,
            link,
            speakerCustomName,
          })
        },
      })

    // Model -> Data (DB)
    editor.conversion.for('dataDowncast').elementToElement({
      model: 'blockQuoteWithSpeaker',
      view: (modelElement, { writer }) => {
        const speakerId = modelElement.getAttribute('speakerId')
        const media = modelElement.getAttribute('media')
        const link = modelElement.getAttribute('link')
        const quotedAt = modelElement.getAttribute('quotedAt')
        const speakerCustomName = modelElement.getAttribute('speakerCustomName')

        return writer.createContainerElement('blockquote', {
          ...(speakerId ? { 'data-speaker-id': speakerId } : {}),
          ...(media ? { 'data-media': media } : {}),
          ...(link ? { 'data-link': link } : {}),
          ...(quotedAt ? { 'data-quoted-at': quotedAt } : {}),
          ...(speakerCustomName
            ? { 'data-speaker-custom-name': speakerCustomName }
            : {}),
        })
      },
    })

    // Model -> View
    editor.conversion.for('editingDowncast').elementToElement({
      model: 'blockQuoteWithSpeaker',
      view: (modelElement, { writer }) => {
        const speakerId = modelElement.getAttribute('speakerId')
        const link = modelElement.getAttribute('link')
        const media = modelElement.getAttribute('media')
        const quotedAt = modelElement.getAttribute('quotedAt') as
          | string
          | undefined
        const speakerCustomName = modelElement.getAttribute(
          'speakerCustomName'
        ) as string | undefined

        if (!speakerId) {
          const container = writer.createContainerElement('blockquote', {
            cite: link,
          })

          if (link || media || quotedAt || speakerCustomName) {
            const quoteMetadata = writer.createUIElement(
              'span',
              { class: 'blockquote-author' },
              function (domDocument) {
                const domElement = this.toDomElement(domDocument)
                let content = `— ${speakerCustomName}`
                if (link) {
                  content += `, <a href="${link}" target="_blank">${media || 'Odkaz'}</a>`
                } else if (media) {
                  content += `, ${media}`
                }
                if (quotedAt) {
                  content += ` (${displayDate(quotedAt)})`
                }
                domElement.innerHTML = content
                return domElement
              }
            )

            writer.insert(
              writer.createPositionAt(container, 'end'),
              quoteMetadata
            )
          }

          return container
        }

        const blockQuote = writer.createContainerElement('blockquote', {
          'data-speaker-id': speakerId,
          'data-link': link,
          ...(media ? { 'data-media': media } : {}),
          ...(quotedAt ? { 'data-quoted-at': quotedAt } : {}),
        })

        const authorElement = writer.createUIElement(
          'span',
          { class: 'blockquote-author' },
          function (domDocument) {
            const domElement = this.toDomElement(domDocument)
            domElement.innerHTML = 'Načítám autora...'
            return domElement
          }
        )

        writer.insert(writer.createPositionAt(blockQuote, 'end'), authorElement)

        query({
          query: gql(`
            query BlockQuotePluginDetail($id: ID!) {
              speakerV2(id: $id) {
                fullName
              }
            }
          `),
          variables: {
            id: speakerId as string,
          },
        }).then((payload) => {
          if (payload.data.speakerV2) {
            const editingView = editor.editing.view
            editingView.change((writer) => {
              writer.remove(authorElement)

              const authorWithName = writer.createUIElement(
                'span',
                { class: 'blockquote-author' },
                function (domDocument) {
                  const domElement = this.toDomElement(domDocument)
                  let content = `— ${payload.data.speakerV2?.fullName}`
                  if (link) {
                    content += `, <a href="${link}" target="_blank">${media || 'Odkaz'}</a>`
                  } else if (media) {
                    content += `, ${media}`
                  }
                  if (quotedAt) {
                    content += ` (${displayDate(quotedAt)})`
                  }
                  domElement.innerHTML = content
                  return domElement
                }
              )

              writer.insert(
                writer.createPositionAt(blockQuote, 'end'),
                authorWithName
              )
            })
          }
        })

        return blockQuote
      },
    })

    // Postfixer which cleans incorrect model states connected with block quotes.
    editor.model.document.registerPostFixer((writer) => {
      const changes = editor.model.document.differ.getChanges()

      for (const entry of changes) {
        if (entry.type == 'insert') {
          const element = entry.position.nodeAfter

          if (!element) {
            // We are inside a text node.
            continue
          }

          if (element.is('element', 'blockQuote') && element.isEmpty) {
            // Added an empty blockQuote - remove it.
            writer.remove(element)

            return true
          } else if (
            element.is('element', 'blockQuote') &&
            !schema.checkChild(entry.position, element)
          ) {
            // Added a blockQuote in incorrect place. Unwrap it so the content inside is not lost.
            writer.unwrap(element)

            return true
          } else if (element.is('element')) {
            // Just added an element. Check that all children meet the scheme rules.
            const range = writer.createRangeIn(element)

            for (const child of range.getItems()) {
              if (
                child.is('element', 'blockQuote') &&
                !schema.checkChild(writer.createPositionBefore(child), child)
              ) {
                writer.unwrap(child)

                return true
              }
            }
          }
        } else if (entry.type == 'remove') {
          const parent = entry.position.parent

          if (parent.is('element', 'blockQuote') && parent.isEmpty) {
            // Something got removed and now blockQuote is empty. Remove the blockQuote as well.
            writer.remove(parent)

            return true
          }
        }
      }

      return false
    })
  }
}
