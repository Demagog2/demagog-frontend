import {
  ButtonView,
  DowncastWriter,
  type Editor,
  Element,
  toWidget,
} from 'ckeditor5'

import '@ckeditor/ckeditor5-media-embed/theme/mediaembed.css'
import { query } from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import { createRoot } from 'react-dom/client'
import { AdminStatement } from '@/components/admin/articles/segments/AdminStatement'
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { parseStatementId } from '@/libs/ck-plugins/utils/parse-id'

function renderStatement(model: Element, writer: DowncastWriter) {
  const statementId = model.getAttribute('statementId')

  query({
    query: gql(`
        query AdminCkEditorStatement($id: Int!) {
          statementV2(id: $id, includeUnpublished: true) {
            ...AdminStatement
          }
        }
      `),
    variables: {
      id: parseInt(String(statementId), 10),
    },
  }).then(
    ({ data }) => {
      const statementElem = document.getElementById(
        `statement-embed-${statementId}`
      )

      if (!statementElem) {
        return
      }

      if (!data?.statementV2) {
        const root = createRoot(statementElem)
        root.render(
          <div className="p-2 text-center text-gray-600 bg-gray-100 flex">
            <div className="shrink-0">
              <ExclamationCircleIcon aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between text-sm">
              Výrok &quot;{String(statementId)}&quot; nenalezen
            </div>
          </div>
        )
      } else {
        const root = createRoot(statementElem)
        root.render(
          <AdminStatement className="mt-8" statement={data.statementV2} />
        )
      }
    },
    () => {
      const statementElem = document.getElementById(
        `statement-embed-${statementId}`
      )
      if (!statementElem) {
        return
      }
      const root = createRoot(statementElem)
      root.render(
        <div className="p-2 text-center text-gray-600 bg-gray-100 flex">
          <div className="shrink-0">
            <ExclamationCircleIcon aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between text-sm">
            Došlo k chybě při načítání výroku &quot;{String(statementId)}&quot;.
            Kontaktujte administrátora.
          </div>
        </div>
      )
    }
  )

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
      const statementId = parseStatementId(prompt('Vložte ID výroku:'))

      if (statementId === null) {
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
