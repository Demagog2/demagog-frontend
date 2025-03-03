import { ButtonView, Dialog, Plugin, View, icons } from 'ckeditor5'
import { BlockQuoteEditingWithSpeakerEditing } from './block-quote-2-editing'
import { BlockQuoteWithSpeakerCommmand } from './block-quote-2-command'
import { createRoot } from 'react-dom/client'
import { BlockQuoteDialog } from './BlockQuoteDialog'
import './block-quote-2-plugin.css'

export class BlockQuoteWithSpeaker extends Plugin {
  /**
   * @inheritDoc
   */
  public static get requires() {
    return [BlockQuoteEditingWithSpeakerEditing, Dialog] as const
  }

  public static get pluginName() {
    return 'BlockQuoteWithSpeaker`' as const
  }

  public static override get isOfficialPlugin(): false {
    return false
  }

  public init(): void {
    const editor = this.editor

    editor.ui.componentFactory.add('blockQuoteWithSpeaker', () => {
      const dialog = this.editor.plugins.get('Dialog')
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

      const command = editor.commands.get(
        'blockQuoteWithSpeaker'
      ) as BlockQuoteWithSpeakerCommmand

      const view = new ButtonView(editor.locale)

      view.set({
        label: editor.locale.t('Citát'),
        icon: icons.quote,
        isToggleable: true,
        tooltip: true,
      })

      view.bind('isEnabled').to(command, 'isEnabled')
      view.bind('isOn').to(command, 'value')

      // Execute the command.
      this.listenTo(view, 'execute', () => {
        // We will be removing the block quote, don't show dialog
        if (view.isOn) {
          editor.execute('blockQuoteWithSpeaker')
          return
        }

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
                  onSave={(speakerId, link, media, quotedAt) => {
                    editor.execute('blockQuoteWithSpeaker', { speakerId, link, media, quotedAt })
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
      })

      return view
    })
  }
}
