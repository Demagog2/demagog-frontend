import {
  ButtonView,
  toWidget,
  type Editor,
  DowncastWriter,
  Element,
} from 'ckeditor5'

import '@ckeditor/ckeditor5-media-embed/theme/mediaembed.css'
import { query } from '@/libs/apollo-client'
import { gql } from '@/__generated__'

function renderStatement(model: Element, writer: DowncastWriter) {
  const statementId = model.getAttribute('statementId')

  query({
    query: gql(`
          query AdminCkEditorStatement($id: Int!) {
            statementV2(id: $id) {
              content
            }
          }
        `),
    variables: {
      id: parseInt(String(statementId), 10),
    },
  }).then(({ data }) => {
    const statementElem = document.getElementById(
      `statement-embed-${statementId}`
    )

    if (!statementElem) {
      return
    }

    // TODO: Styling
    if (!data?.statementV2) {
      statementElem.innerHTML = `<div class="statement">
         <p>Výrok ${statementId} nenalezen</p>
      </div>`
    } else {
      statementElem.innerHTML = `<div class="statement">
         Výrok: <p>&bdquo;${data.statementV2.content}&bdquo;</p>
      </div>`
    }
  })

  const div = writer.createRawElement(
    'div',
    {
      id: `statement-embed-${statementId}`,
      class: 'ck-media__wrapper',
    },
    (domElement: HTMLElement) => {
      domElement.innerText = `Nahrávám`
    }
  )

  const wrapperElement = writer.createContainerElement('div')

  writer.insert(writer.createPositionAt(wrapperElement, 0), div)

  return toWidget(wrapperElement, writer, {
    label: 'statement embed widget',
  })
}

export function StatementEmbed(editor: Editor) {
  const schema = editor.model.schema
  const conversion = editor.conversion
  const domConverter = editor.editing.view.domConverter

  // Configure the schema.
  schema.register('statementEmbed', {
    isObject: true,
    isBlock: true,
    allowWhere: '$block',
    allowAttributes: ['statementId'],
  })

  // Model -> Data
  conversion.for('dataDowncast').elementToElement({
    model: 'statementEmbed',
    view: (modelElement, { writer }) => {
      const statementId = modelElement.getAttribute('statementId')

      return writer.createUIElement(
        'div',
        { class: 'statement-embed', 'data-statement-id': statementId },
        function (domDocument) {
          return this.toDomElement(domDocument)
        }
      )
    },
  })

  // Model -> View
  conversion.for('editingDowncast').elementToElement({
    model: 'statementEmbed',
    view: (model, { writer }) => renderStatement(model, writer),
  })

  // View -> Model
  conversion
    .for('upcast')
    // div.statement-embed
    .elementToElement({
      view: {
        name: 'div',
        classes: 'statement-embed',
      },
      model: (viewFigure, { writer }) => {
        const domElement = domConverter.viewToDom(viewFigure)

        const statementId = domElement.dataset.statementId

        return writer.createElement('statementEmbed', { statementId })
      },
    })

  editor.ui.componentFactory.add('statementEmbed', (locale) => {
    const view = new ButtonView(locale)

    view.set({
      label: 'Vložit výrok',
      tooltip: true,
      withText: true,
    })

    // Callback executed once the toolbar item is clicked.
    view.on('execute', () => {
      const statementId = prompt('Vložte ID výroku:')

      if (statementId === null || statementId.trim() === '') {
        // Prompt cancelled or nothing put in
        return
      }

      editor.model.change((writer) => {
        const embedElement = writer.createElement('statementEmbed', {
          statementId,
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
