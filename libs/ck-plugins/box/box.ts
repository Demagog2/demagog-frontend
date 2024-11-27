import { ButtonView, Editor, icons } from 'ckeditor5'
import { BoxCommand } from './box-command'
import classNames from 'classnames'

const CUSTOM_CLASS_NAME = 'ck-editor_demagog-box-wrapper'
const CUSTOM_CLASS_FLOAT_RIGHT = 'float-right'
const CUSTOM_CLASS_FLOAT_GREY_BG = 'bg-grey'

export function Box(editor: Editor) {
  editor.commands.add('box', new BoxCommand(editor))

  editor.model.schema.register('box', {
    inheritAllFrom: '$container',
    allowAttributes: ['isFloating', 'hasGreyBg'],
  })

  // View -> Model
  editor.conversion.for('upcast').elementToElement({
    view: {
      name: 'div',
      classes: [CUSTOM_CLASS_NAME],
    },
    model: (viewElement, { writer }) => {
      const isFloating = viewElement.hasClass(CUSTOM_CLASS_FLOAT_RIGHT)
      const hasGreyBg = viewElement.hasClass(CUSTOM_CLASS_FLOAT_GREY_BG)

      return writer.createElement('box', { isFloating, hasGreyBg })
    },
  })

  // Model -> Data (DB)
  editor.conversion.for('dataDowncast').elementToElement({
    model: 'box',
    view: (modelElement, { writer }) => {
      const isFloating = modelElement.getAttribute('isFloating')
      const hasBgGrey = modelElement.getAttribute('hasBgGrey')

      return writer.createContainerElement('div', {
        class: classNames(CUSTOM_CLASS_NAME, {
          [CUSTOM_CLASS_FLOAT_RIGHT]: isFloating,
          [CUSTOM_CLASS_FLOAT_GREY_BG]: hasBgGrey,
        }),
      })
    },
  })

  // Model -> View
  editor.conversion.for('editingDowncast').elementToElement({
    model: 'box',
    view: (modelElement, { writer }) => {
      const isFloating = modelElement.getAttribute('isFloating')
      const hasBgGrey = modelElement.getAttribute('hasBgGrey')

      return writer.createContainerElement('div', {
        class: classNames(CUSTOM_CLASS_NAME, {
          [CUSTOM_CLASS_FLOAT_RIGHT]: isFloating,
          [CUSTOM_CLASS_FLOAT_GREY_BG]: hasBgGrey,
        }),
      })
    },
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
      tooltip: true,
    })

    view.on('execute', () => {
      editor.execute('box')
    })

    return view
  })

  editor.ui.componentFactory.add('boxRight', () => {
    const view = new ButtonView(editor.locale)

    const command = editor.commands.get('box') as BoxCommand

    view.bind('isEnabled').to(command, 'isEnabled')
    view.bind('isOn').to(command, 'value')

    view.set({
      label: editor.locale.t('Rámeček napravo'),
      icon: icons.objectBlockRight,
      isToggleable: true,
      tooltip: true,
    })

    view.on('execute', () => {
      editor.execute('box', { isFloating: true })
    })

    return view
  })

  editor.ui.componentFactory.add('boxGrey', () => {
    const view = new ButtonView(editor.locale)

    const command = editor.commands.get('box') as BoxCommand

    view.bind('isEnabled').to(command, 'isEnabled')
    view.bind('isOn').to(command, 'value')

    view.set({
      label: editor.locale.t('Šedý rámeček'),
      icon: icons.objectFullWidth,
      isToggleable: true,
      tooltip: true,
    })

    view.on('execute', () => {
      editor.execute('box', { hasBgGrey: true })
    })

    return view
  })
}
