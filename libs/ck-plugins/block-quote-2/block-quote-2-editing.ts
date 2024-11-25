import { Plugin } from 'ckeditor5'
import { Enter, type ViewDocumentEnterEvent } from 'ckeditor5'
import { Delete, type ViewDocumentDeleteEvent } from 'ckeditor5'
import { BlockQuoteWithSpeakerCommmand as BlockQuoteWithSpeakerCommmand } from './block-quote-2-command'

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

    editor.commands.add(
      'blockQuoteWithSpeaker',
      new BlockQuoteWithSpeakerCommmand(editor)
    )

    schema.register('blockQuoteWithSpeaker', {
      inheritAllFrom: '$container',
      allowAttributes: ['speakerId'],
    })

    // View -> Model
    editor.conversion.for('upcast').elementToElement({
      model: 'blockQuoteWithSpeaker',
      view: {
        name: 'blockquote',
        attributes: {
          'data-speaker-id': true,
        },
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
        const blockQuote = writer.createContainerElement('blockquote', {
          'data-speaker-id': speakerId,
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

    const viewDocument = this.editor.editing.view.document
    const selection = editor.model.document.selection
    const blockQuoteCommand = editor.commands.get('blockQuoteWithSpeaker')!

    // // Overwrite default Enter key behavior.
    // // If Enter key is pressed with selection collapsed in empty block inside a quote, break the quote.
    // this.listenTo<ViewDocumentEnterEvent>(
    //   viewDocument,
    //   'enter',
    //   (evt, data) => {
    //     if (!selection.isCollapsed || !blockQuoteCommand.value) {
    //       return
    //     }

    //     const positionParent = selection.getLastPosition()!.parent

    //     if (positionParent.isEmpty) {
    //       editor.execute('blockQuoteWithSpeaker')
    //       editor.editing.view.scrollToTheSelection()

    //       data.preventDefault()
    //       evt.stop()
    //     }
    //   },
    //   { context: 'blockquote' }
    // )

    // // Overwrite default Backspace key behavior.
    // // If Backspace key is pressed with selection collapsed in first empty block inside a quote, break the quote.
    // this.listenTo<ViewDocumentDeleteEvent>(
    //   viewDocument,
    //   'delete',
    //   (evt, data) => {
    //     if (
    //       data.direction != 'backward' ||
    //       !selection.isCollapsed ||
    //       !blockQuoteCommand!.value
    //     ) {
    //       return
    //     }

    //     const positionParent = selection.getLastPosition()!.parent

    //     if (positionParent.isEmpty && !positionParent.previousSibling) {
    //       editor.execute('blockQuote')
    //       editor.editing.view.scrollToTheSelection()

    //       data.preventDefault()
    //       evt.stop()
    //     }
    //   },
    //   { context: 'blockquote' }
    // )
  }
}
