import { ButtonView, toWidget, type Editor } from 'ckeditor5'

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
      icon: iconCode,
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

const iconCode = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" style="width: 20px; height: 20px">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
</svg>
`