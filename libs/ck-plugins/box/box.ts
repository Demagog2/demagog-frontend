import { ButtonView, Editor, icons } from 'ckeditor5'
import { BoxCommand } from './box-command'

const CUSTOM_CLASS_NAME = 'ck-editor_demagog-box-wrapper'

export function Box(editor: Editor) {
  editor.commands.add('box', new BoxCommand(editor))

  editor.model.schema.register('box', {
    inheritAllFrom: '$container',
  })

  editor.conversion.elementToElement({
    view: {
      name: 'div',
      classes: [CUSTOM_CLASS_NAME],
    },
    model: 'box',
  })

  editor.ui.componentFactory.add('box', () => {
    const view = new ButtonView(editor.locale)

    const command = editor.commands.get('box') as BoxCommand

    view.bind('isEnabled').to(command, 'isEnabled')
    view.bind('isOn').to(command, 'value')

    view.set({
      label: editor.locale.t('Rámeček'),
      icon: icons.objectCenter,
      isToggleable: true,
    })

    view.on('execute', () => {
      editor.execute('box')
    })

    return view
  })
}
