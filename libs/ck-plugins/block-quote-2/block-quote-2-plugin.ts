import { ButtonView, Dialog, Plugin, View, icons } from 'ckeditor5'
import { BlockQuoteEditingWithSpeakerEditing } from './block-quote-2-editing'
import { BlockQuoteWithSpeakerCommmand } from './block-quote-2-command'
import { BlockQuoteSpeakersView } from './block-quote-2-view-speakers'
import { BlockQuoteUrlView } from './block-quote-2-view-url'

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
    let link = ''
    let selectedSpeakerId: string | undefined

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
              selectedSpeakerId = speakerId
            },
          }),
          BlockQuoteUrlView(editor, {
            onUrlChange(url: string) {
              link = url
            },
          }),
        ],
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
          actionButtons: [
            {
              label: 'Uložit',
              class: 'ck-button-action',
              withText: true,
              onExecute: () => {
                editor.execute('blockQuoteWithSpeaker', { 
                  speakerId: selectedSpeakerId,
                  link 
                })
                dialog.hide()
              },
            },
            {
              label: 'Citát bez řečníka',
              class: 'ck-button-action',
              withText: true,
              onExecute: () => {
                editor.execute('blockQuoteWithSpeaker', { link })
                dialog.hide()
              },
            },
            {
              label: 'Zavřít',
              class: 'ck-button-action ck-button-warning',
              withText: true,
              onExecute: () => {
                dialog.hide()
              },
            },
          ],
          onHide() {
            selectedSpeakerId = undefined
            link = ''
          },
        })

        editor.editing.view.focus()
      })

      return view
    })
  }
}
