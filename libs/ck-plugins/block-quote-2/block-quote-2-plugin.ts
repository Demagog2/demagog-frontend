import { BlockQuote, ButtonView, Dialog, Plugin, View, icons } from 'ckeditor5'
import { BlockQuoteEditingWithSpeakerEditing } from './block-quote-2-editing'
import { BlockQuoteWithSpeakerCommmand } from './block-quote-2-command'
import { BlockQuoteSpeakersView } from './block-quote-2-view-speakers'

export class BlockQuoteWithSpeaker extends Plugin {
  /**
   * @inheritDoc
   */
  public static get requires() {
    return [BlockQuote, BlockQuoteEditingWithSpeakerEditing, Dialog] as const
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

      const dialogContentView = new View(editor.locale)

      dialogContentView.setTemplate({
        tag: 'div',
        attributes: {
          style: {
            padding: 'var(--ck-spacing-large)',
            whiteSpace: 'initial',
            width: '100%',
            maxWidth: '500px',
          },
          tabindex: -1,
        },
        children: [
          BlockQuoteSpeakersView(editor, {
            onSelect(speakerId: string) {
              editor.execute('blockQuoteWithSpeaker', { speakerId })
              dialog.hide()
            },
          }),
        ],
      })

      const command = editor.commands.get(
        'blockQuoteWithSpeaker'
      ) as BlockQuoteWithSpeakerCommmand

      const view = new ButtonView(editor.locale)

      view.set({
        label: editor.locale.t('Block Quote'),
        icon: icons.quote,
        isToggleable: true,
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
          actionButtons: [
            {
              label: 'Citát bez řečníka',
              class: 'ck-button-action',
              withText: true,
              onExecute: () => {
                editor.execute('blockQuoteWithSpeaker')
                dialog.hide()
              },
            },
            {
              label: 'Zavřít',
              class: 'ck-button-action',
              withText: true,
              onExecute: () => {
                dialog.hide()
              },
            },
          ],
          onHide() {},
        })

        editor.editing.view.focus()
      })

      return view
    })
  }
}
