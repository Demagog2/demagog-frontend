import { Plugin, Enter, Delete } from 'ckeditor5'
import { BlockQuoteWithSpeakerCommmand as BlockQuoteWithSpeakerCommmand } from './block-quote-2-command'
import { query } from '@/libs/apollo-client'
import { gql } from '@/__generated__'

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
      allowAttributes: ['speakerId', 'link'],
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

          return writer.createElement('blockQuoteWithSpeaker', { speakerId })
        },
      })

    // Model -> Data (DB)
    editor.conversion.for('dataDowncast').elementToElement({
      model: 'blockQuoteWithSpeaker',
      view: (modelElement, { writer }) => {
        const speakerId = modelElement.getAttribute('speakerId')

        return writer.createContainerElement('blockquote', {
          'data-speaker-id': speakerId,
        })
      },
    })

    // Model -> View
    editor.conversion.for('editingDowncast').elementToElement({
      model: 'blockQuoteWithSpeaker',
      view: (modelElement, { writer }) => {
        const speakerId = modelElement.getAttribute('speakerId')
        const link = modelElement.getAttribute('link')

        if (!speakerId) {
          const container = writer.createContainerElement('blockquote', { cite: link })

          if (link) {
            const quoteMetadata = writer.createUIElement(
              'span',
              { class: 'blockquote-author' },
              function (domDocument) {
                const domElement = this.toDomElement(domDocument)
                domElement.innerHTML = `— <a href="${link}" target="_blank">Odkaz</a>`
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
                  domElement.innerHTML = `— ${payload.data.speakerV2?.fullName}`
                  if (link) {
                    domElement.innerHTML += `, <a href="${link}" target="_blank">Odkaz</a>`
                  }
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
