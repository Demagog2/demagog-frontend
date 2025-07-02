import { ButtonView, toWidget, type Editor } from 'ckeditor5'
import { IconHtml } from '@ckeditor/ckeditor5-icons'

import '@ckeditor/ckeditor5-media-embed/theme/mediaembed.css'

export function Embed(editor: Editor) {
  const schema = editor.model.schema
  const conversion = editor.conversion
  const domConverter = editor.editing.view.domConverter

  // Configure the schema.
  schema.register('embed', {
    isObject: true,
    isBlock: true,
    allowWhere: '$block',
    allowAttributes: ['code'],
  })

  // Model -> Data
  conversion.for('dataDowncast').elementToElement({
    model: 'embed',
    view: (modelElement, { writer }) => {
      const code = modelElement.getAttribute('code')

      return writer.createUIElement(
        'figure',
        { class: 'embed' },
        function (domDocument) {
          const domElement = this.toDomElement(domDocument)

          domElement.innerHTML = code as string

          return domElement
        }
      )
    },
  })

  // Model -> View
  conversion.for('editingDowncast').elementToElement({
    model: 'embed',
    view: (modelElement, { writer }) => {
      const code = modelElement.getAttribute('code')

      const iframeWrapperElement = writer.createRawElement(
        'div',
        {
          class: 'ck-media__wrapper',
        },
        (domElement: HTMLElement) => {
          domElement.innerHTML = code as string
        }
      )

      const figureElement = writer.createContainerElement('figure', {
        class: 'media',
      })

      writer.insert(
        writer.createPositionAt(figureElement, 0),
        iframeWrapperElement
      )

      return toWidget(figureElement, writer, { label: 'embed widget' })
    },
  })

  // View -> Model
  conversion
    .for('upcast')
    // figure.embed (Preferred way to represent embed)
    .elementToElement({
      view: {
        name: 'figure',
        attributes: {
          class: 'embed',
        },
      },
      model: (viewFigure, { writer }) => {
        const figureEl = domConverter.viewToDom(viewFigure)
        const code = figureEl.innerHTML

        return writer.createElement('embed', { code })
      },
    })
    // iframe (To be able to parse older representation)
    .elementToElement({
      view: {
        name: 'iframe',
      },
      model: (viewIframe, { writer }) => {
        const iframeEl = domConverter.viewToDom(viewIframe)
        const code = iframeEl.outerHTML

        return writer.createElement('embed', { code })
      },
    })
    // div.infogram-embed (To be able to parse older representation)
    .elementToElement({
      view: {
        name: 'div',
      },
      model: (viewIframe, { writer }) => {
        const divEl = domConverter.viewToDom(viewIframe)

        if (divEl.querySelector('.infogram-embed')) {
          const code = divEl.outerHTML

          return writer.createElement('embed', { code })
        }

        return null
      },
    })

  editor.ui.componentFactory.add('embed', (locale) => {
    const view = new ButtonView(locale)

    view.set({
      label: 'Insert embed',
      icon: IconHtml,
      tooltip: true,
    })

    // Callback executed once the toolbar item is clicked.
    view.on('execute', () => {
      const code = prompt(
        'Vložte embedovaný kód (začíná většinou znaky "<iframe "):'
      )

      if (code === null || code.trim() === '') {
        // Prompt cancelled or nothing put in
        return
      }

      editor.model.change((writer) => {
        const embedElement = writer.createElement('embed', {
          code,
        })

        // Insert the embed in the current selection location.
        editor.model.insertContent(
          embedElement,
          editor.model.document.selection
        )
      })
    })
    return view
  })
}
