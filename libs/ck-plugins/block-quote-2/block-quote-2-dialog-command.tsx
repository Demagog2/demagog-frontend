import { Command } from 'ckeditor5'
import { Dialog } from 'ckeditor5'
import { View } from 'ckeditor5'
import { createRoot } from 'react-dom/client'
import { BlockQuoteDialog } from './BlockQuoteDialog'
import { Element } from 'ckeditor5'

interface BlockQuoteDialogCommandOptions {
  speakerId?: string
  link?: string
  media?: string
  quotedAt?: string
  speakerCustomName?: string
  isEditing?: boolean
  blockQuoteElement?: Element
}

export class BlockQuoteDialogCommand extends Command {
  /**
   * @inheritDoc
   */
  public override refresh(): void {
    this.isEnabled = true
  }

  /**
   * Executes the command which opens the dialog for selecting a speaker.
   *
   * @fires execute
   * @param options Command options.
   * @param options.speakerId The ID of the speaker to pre-select in the dialog.
   * @param options.link The link to pre-fill in the dialog.
   * @param options.media The media source to pre-fill in the dialog.
   * @param options.quotedAt The quote date to pre-fill in the dialog.
   * @param options.speakerCustomName The custom speaker name to pre-fill in the dialog.
   * @param options.isEditing Whether we're editing an existing block quote. If true, we'll only update the attributes.
   * @param options.blockQuoteElement The block quote element to update when editing.
   */
  public override execute(options: BlockQuoteDialogCommandOptions = {}): void {
    const editor = this.editor
    const dialog = editor.plugins.get('Dialog') as Dialog
    let reactRoot: ReturnType<typeof createRoot> | undefined

    const dialogContentView = new View(editor.locale)
    dialogContentView.setTemplate({
      tag: 'div',
      attributes: {
        style: {
          padding: 'var(--ck-spacing-large)',
          whiteSpace: 'initial',
          width: '350px',
          maxWidth: '700px',
        },
        tabindex: -1,
      },
      children: [],
    })

    dialog.show({
      id: '12345',
      title: 'Vyberte řečníka',
      content: dialogContentView,
      actionButtons: [],
      onShow: () => {
        const domElement = dialogContentView.element
        if (domElement) {
          reactRoot = createRoot(domElement)
          reactRoot.render(
            <BlockQuoteDialog
              defaultValues={{
                speakerId: options.speakerId,
                link: options.link,
                media: options.media,
                quotedAt: options.quotedAt,
                speakerCustomName: options.speakerCustomName,
              }}
              onSave={(speakerId, link, media, quotedAt, speakerCustomName) => {
                if (options.isEditing && options.blockQuoteElement) {
                  const blockQuote = options.blockQuoteElement!

                  // When editing, we only update the attributes without toggling the block quote
                  editor.model.change((writer) => {
                    // Set all attributes
                    writer.setAttribute(
                      'speakerId',
                      speakerId || null,
                      blockQuote
                    )
                    writer.setAttribute('link', link || null, blockQuote)
                    writer.setAttribute('media', media || null, blockQuote)
                    writer.setAttribute(
                      'quotedAt',
                      quotedAt || null,
                      blockQuote
                    )
                    writer.setAttribute(
                      'speakerCustomName',
                      speakerCustomName || null,
                      blockQuote
                    )
                  })
                } else {
                  // When creating new, we execute the blockQuoteWithSpeaker command
                  editor.execute('blockQuoteWithSpeaker', {
                    speakerId,
                    link,
                    media,
                    quotedAt,
                    speakerCustomName,
                  })
                }
                dialog.hide()
              }}
              onClose={() => dialog.hide()}
            />
          )
        }
      },
      onHide: () => {
        if (reactRoot) {
          reactRoot.unmount()
          reactRoot = undefined
        }
      },
    })

    editor.editing.view.focus()
  }
}
