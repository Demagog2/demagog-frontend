import classNames from 'classnames'
import { ButtonView, Editor, icons } from 'ckeditor5'
import { BoxCommand } from './box-command'
import { BoxToggleBgCommand } from './box-toggle-bg-command'
import { BoxToggleFloatCommand } from './box-toggle-float-command'

const CUSTOM_CLASS_NAME = 'ck-editor_demagog-box-wrapper'
const CUSTOM_CLASS_FLOAT_RIGHT = 'float-right'
const CUSTOM_CLASS_FLOAT_GREY_BG = 'bg-grey'

const ATTRIBUTE_FLOAT = 'isFloating'
const ATTRIBUTE_BG = 'hasGreyBg'

export function Box(editor: Editor) {
  editor.commands.add('box', new BoxCommand(editor))
  editor.commands.add('box:toggle-float', new BoxToggleFloatCommand(editor))
  editor.commands.add('box:toggle-bg', new BoxToggleBgCommand(editor))

  editor.model.schema.register('box', {
    inheritAllFrom: '$container',
    allowAttributes: [ATTRIBUTE_FLOAT, ATTRIBUTE_BG],
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
      const isFloating = modelElement.getAttribute(ATTRIBUTE_FLOAT)
      const hasBgGrey = modelElement.getAttribute(ATTRIBUTE_BG)

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
      const isFloating = modelElement.getAttribute(ATTRIBUTE_FLOAT)
      const hasBgGrey = modelElement.getAttribute(ATTRIBUTE_BG)

      const container = writer.createContainerElement('div', {
        class: classNames(CUSTOM_CLASS_NAME, {
          [CUSTOM_CLASS_FLOAT_RIGHT]: isFloating,
          [CUSTOM_CLASS_FLOAT_GREY_BG]: hasBgGrey,
        }),
      })

      writer.setCustomProperty('box', true, container)

      return container
    },
  })

  editor.conversion.for('downcast').add((dispatcher) => {
    dispatcher.on('attribute:isFloating', (_, data, conversionApi) => {
      const viewElement = conversionApi.mapper.toViewElement(data.item)

      if (!viewElement) {
        return
      }

      const writer = conversionApi.writer

      if (data.attributeNewValue) {
        writer.addClass(CUSTOM_CLASS_FLOAT_RIGHT, viewElement)
      } else {
        writer.removeClass(CUSTOM_CLASS_FLOAT_RIGHT, viewElement)
      }
    })
  })

  editor.conversion.for('downcast').add((dispatcher) => {
    dispatcher.on('attribute:hasGreyBg', (_, data, conversionApi) => {
      const viewElement = conversionApi.mapper.toViewElement(data.item)

      if (!viewElement) {
        return
      }

      const writer = conversionApi.writer

      if (data.attributeNewValue) {
        writer.addClass(CUSTOM_CLASS_FLOAT_GREY_BG, viewElement)
      } else {
        writer.removeClass(CUSTOM_CLASS_FLOAT_GREY_BG, viewElement)
      }
    })
  })

  editor.ui.componentFactory.add('box', () => {
    const view = new ButtonView(editor.locale)

    const command = editor.commands.get('box') as BoxCommand

    view.bind('isEnabled').to(command, 'isEnabled')
    view.bind('isOn').to(command, 'value')

    view.set({
      label: editor.locale.t('Rámeček'),
      icon: icons.objectFullWidth,
      isToggleable: true,
      tooltip: true,
    })

    view.on('execute', () => editor.execute('box'))

    return view
  })

  editor.ui.componentFactory.add('box:toggle-float', () => {
    const view = new ButtonView(editor.locale)

    view.set({
      label: editor.locale.t('Obtékání'),
      icon: icons.objectBlockRight,
      isToggleable: true,
      tooltip: true,
    })

    view.on('execute', () => editor.execute('box:toggle-float'))

    return view
  })

  editor.ui.componentFactory.add('box:toggle-bg', () => {
    const view = new ButtonView(editor.locale)

    view.set({
      label: editor.locale.t('Pozadí'),
      icon: icons.colorPalette,
      isToggleable: true,
      tooltip: true,
    })

    view.on('execute', () => editor.execute('box:toggle-bg'))

    return view
  })
}
