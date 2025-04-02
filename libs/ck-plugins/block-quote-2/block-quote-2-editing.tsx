import {
  Plugin,
  Enter,
  Delete,
  Element,
  ViewElement,
  DowncastConversionApi,
} from 'ckeditor5'
import { BlockQuoteWithSpeakerCommmand as BlockQuoteWithSpeakerCommmand } from './block-quote-2-command'
import { createRoot } from 'react-dom/client'
import { BlockQuote } from '@/app/components/BlockQuote'

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

    // Helper function to create block quote view
    const createBlockQuoteView = (
      modelElement: Element,
      { writer }: DowncastConversionApi
    ): ViewElement => {
      const speakerId = modelElement.getAttribute('speakerId') as
        | string
        | undefined
      const link = modelElement.getAttribute('link') as string | undefined
      const media = modelElement.getAttribute('media') as string | undefined
      const quotedAt = modelElement.getAttribute('quotedAt') as
        | string
        | undefined
      const speakerCustomName = modelElement.getAttribute(
        'speakerCustomName'
      ) as string | undefined

      const container = writer.createContainerElement('div', {
        class: 'blockquote-container',
      })

      const content = writer.createContainerElement('div', {
        class: 'blockquote-content',
      })

      // Create a container for React
      const reactContainer = writer.createUIElement(
        'div',
        {
          class: 'blockquote-react-container',
        },
        function (
          this: { toDomElement: (doc: Document) => HTMLElement },
          domDocument: Document
        ) {
          const domElement = this.toDomElement(domDocument)
          const root = createRoot(domElement)
          root.render(
            <BlockQuote
              speakerId={speakerId}
              speakerCustomName={speakerCustomName}
              link={link}
              media={media}
              quotedAt={quotedAt}
              onEdit={() => {
                editor.execute('blockQuoteDialog', {
                  speakerId,
                  link,
                  media,
                  quotedAt,
                  speakerCustomName,
                  isEditing: true,
                  blockQuoteElement: modelElement,
                })
              }}
            >
              <div className="blockquote-content" />
            </BlockQuote>
          )
          return domElement
        }
      )

      writer.insert(writer.createPositionAt(content, 0), reactContainer)
      writer.insert(writer.createPositionAt(container, 0), content)
      return container
    }

    // Model -> View
    editor.conversion.for('editingDowncast').elementToElement({
      model: 'blockQuoteWithSpeaker',
      view: (modelElement, conversionApi) =>
        createBlockQuoteView(modelElement, conversionApi),
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
