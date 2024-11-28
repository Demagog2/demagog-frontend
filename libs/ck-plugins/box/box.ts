import {
  ButtonView,
  Editor,
  icons,
  View,
  Element,
  viewToModelPositionOutsideModelElement,
  ContextualBalloon,
} from 'ckeditor5'
import { BoxCommand } from './box-command'
import classNames from 'classnames'
import { bind } from 'lodash'

const CUSTOM_CLASS_NAME = 'ck-editor_demagog-box-wrapper'
const CUSTOM_CLASS_FLOAT_RIGHT = 'float-right'
const CUSTOM_CLASS_FLOAT_GREY_BG = 'bg-grey'
const CUSTOM_CLASS_SETTINGS = 'settings'

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

      const container = writer.createContainerElement('div', {
        class: classNames(CUSTOM_CLASS_NAME, {
          [CUSTOM_CLASS_FLOAT_RIGHT]: isFloating,
          [CUSTOM_CLASS_FLOAT_GREY_BG]: hasBgGrey,
        }),
      })

      const authorElement = writer.createUIElement(
        'span',
        { class: CUSTOM_CLASS_SETTINGS, tooltip: 'Nastavení' },
        function (domDocument) {
          const domElement = this.toDomElement(domDocument)
          domElement.innerHTML = '⚙️'
          return domElement
        }
      )

      writer.insert(writer.createPositionAt(container, 'end'), authorElement)

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
        writer.addClass('float-right', viewElement)
      } else {
        writer.removeClass('float-right', viewElement)
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

    view.on('execute', () => {
      editor.execute('box')
    })

    return view
  })

  const balloon = editor.plugins.get('ContextualBalloon')
  const myBalloonView = new View()

  editor.editing.view.document.on('click', (_, data) => {
    const clickedElement = data.target

    if (clickedElement.hasClass(CUSTOM_CLASS_SETTINGS)) {
      const containerDomElement = clickedElement.parent
      const container =
        editor.editing.mapper.toModelElement(containerDomElement)

      const toggleButton = new ButtonView(editor.locale)

      toggleButton.set({
        label: editor.locale.t('Float'),
        icon: icons.objectBlockRight,
        isToggleable: true,
        tooltip: true,
      })

      toggleButton.on('execute', () => {
        const model = editor.model

        if (container) {
          model.change((writer) => {
            writer.setAttribute(
              'isFloating',
              !container.getAttribute('isFloating'),
              container
            )
          })
        }
      })

      myBalloonView.setTemplate({
        tag: 'div',
        attributes: {
          class: 'custom-balloon',
        },
        children: [toggleButton],
      })

      showBalloon(editor, balloon, myBalloonView, clickedElement)
    } else {
      balloon.remove(myBalloonView)
    }
  })
}

function showBalloon(
  editor: Editor,
  balloon: ContextualBalloon,
  view: View,
  targetElement: any
) {
  if (!balloon.hasView(view)) {
    balloon.add({
      view: view,
      position: getBalloonPositionData(editor, targetElement),
    })
  }
}

// Pomocná funkce pro určení pozice bubliny
function getBalloonPositionData(editor: Editor, targetElement: any) {
  const viewDomConverter = editor.editing.view.domConverter
  const domTarget = viewDomConverter.mapViewToDom(targetElement)

  return {
    target: domTarget?.getBoundingClientRect(),
  }
}
