import { ButtonView, Dialog, Plugin, icons } from 'ckeditor5'
import { BlockQuoteEditingWithSpeakerEditing } from './block-quote-2-editing'
import { BlockQuoteWithSpeakerCommmand } from './block-quote-2-command'
import { BlockQuoteDialogCommand } from './block-quote-2-dialog-command'
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

    editor.commands.add('blockQuoteDialog', new BlockQuoteDialogCommand(editor))

    editor.ui.componentFactory.add('blockQuoteWithSpeaker', () => {
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

        editor.execute('blockQuoteDialog')
      })

      return view
    })
  }
}
