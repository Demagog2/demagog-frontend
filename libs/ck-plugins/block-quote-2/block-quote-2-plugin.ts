import { ButtonView, Plugin, icons } from 'ckeditor5'
import { BlockQuoteEditingWithSpeakerEditing } from './block-quote-2-editing'
import { BlockQuoteWithSpeakerCommmand } from './block-quote-2-command'

export class BlockQuoteWithSpeaker extends Plugin {
  /**
   * @inheritDoc
   */
  public static get requires() {
    return [BlockQuoteEditingWithSpeakerEditing] as const
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
      const editor = this.editor
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
        console.log('Execute from view')

        editor.execute('blockQuoteWithSpeaker')
        editor.editing.view.focus()
      })

      return view
    })
  }
}
