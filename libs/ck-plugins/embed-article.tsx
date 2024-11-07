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
  const articleId = model.getAttribute('articleId')

  query({
    query: gql(`
        query AdminCkEditorStatement($id: Int!) {
          statementV2(id: $id, includeUnpublished: true) {
            ...AdminStatement
          }
        }
      `),
    variables: {
      id: parseInt(String(articleId), 10),
    },
  }).then(
    ({ data }) => {
      const statementElem = document.getElementById(
        `statement-embed-${articleId}`
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
              Výrok &quot;{String(articleId)}&quot; nenalezen
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
        `article-embed-${articleId}`
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
            Došlo k chybě při načítání výroku &quot;{String(articleId)}&quot;.
            Kontaktujte administrátora.
          </div>
        </div>
      )
    }
  )

  const div = writer.createRawElement(
    'div',
    {
      id: `article-embed-${articleId}`,
      class: 'ck-media__wrapper',
    },
    (domElement: HTMLElement) => {
      domElement.innerText = `Nahrávám`
    }
  )

  const wrapperElement = writer.createContainerElement('div')

  writer.insert(writer.createPositionAt(wrapperElement, 0), div)

  return toWidget(wrapperElement, writer, {
    label: 'article embed widget',
  })
}

export function EmbedArticle(editor: Editor) {
  const schema = editor.model.schema
  const conversion = editor.conversion
  const domConverter = editor.editing.view.domConverter

  // Configure the schema.
  schema.register('embedArticle', {
    isObject: true,
    isBlock: true,
    allowWhere: '$block',
    allowAttributes: ['articleId'],
  })

  // Model -> Data
  conversion.for('dataDowncast').elementToElement({
    model: 'embedArticle',
    view: (modelElement, { writer }) => {
      const articleId = modelElement.getAttribute('articleId')

      return writer.createUIElement(
        'div',
        { class: 'article-embed', 'data-article-id': articleId },
        function (domDocument) {
          return this.toDomElement(domDocument)
        }
      )
    },
  })

  // Model -> View
  conversion.for('editingDowncast').elementToElement({
    model: 'embedArticle',
    view: (model, { writer }) => renderStatement(model, writer),
  })

  // View -> Model
  conversion
    .for('upcast')
    // div.statement-embed
    .elementToElement({
      view: {
        name: 'div',
        classes: 'article-embed',
      },
      model: (viewFigure, { writer }) => {
        const domElement = domConverter.viewToDom(viewFigure)

        const articleId = domElement.dataset.articleId

        return writer.createElement('embedArticle', { articleId })
      },
    })

  editor.ui.componentFactory.add('embedArticle', (locale) => {
    const view = new ButtonView(locale)

    view.set({
      label: 'Vložit článek',
      tooltip: true,
      withText: true,
    })

    // Callback executed once the toolbar item is clicked.
    view.on('execute', () => {
      const articleId = parseStatementId(prompt('Vložte ID článku:'))

      if (articleId === null) {
        // Prompt cancelled or nothing put in
        return
      }

      editor.model.change((writer) => {
        const embedElement = writer.createElement('embedArticle', {
          articleId,
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
