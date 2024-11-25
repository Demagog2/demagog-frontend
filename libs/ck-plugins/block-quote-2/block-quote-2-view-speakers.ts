import { gql } from '@/__generated__'
import { query } from '@/libs/apollo-client'
import { Editor, View, ListItemView, ListView, InputTextView } from 'ckeditor5'
import { debounce } from 'lodash'

function fetchSpeakers(
  editor: Editor,
  listView: ListView,
  options: { onSelect(speakerId: string): void },
  name: string = ''
): void {
  const loadingItem = new ListItemView(editor.locale)

  loadingItem.setTemplate({
    tag: 'li',
    children: ['Načítání...'],
  })

  listView.items.add(loadingItem)

  query({
    query: gql(
      `
        query BlockQuoteSpeakerView($name: String) {
          speakersV2(first: 10, filter: { name: $name }) {
            edges {
              node {
                id
                fullName
              }
            }
          }
        }
      `
    ),
    variables: {
      name,
    },
  }).then((response) => {
    listView.items.clear()

    response.data?.speakersV2?.edges?.forEach((edge) => {
      if (!edge?.node) {
        return
      }

      const listItem = new ListItemView(editor.locale)
      listItem.setTemplate({
        tag: 'li',
        children: [edge.node?.fullName ?? ''],
      })

      listView.items.add(listItem)

      listItem.element?.addEventListener('click', () => {
        if (edge.node?.id) {
          options.onSelect(edge.node.id)
        }
      })
    })
  })
}

export function BlockQuoteSpeakersView(
  editor: Editor,
  options: { onSelect(speakerId: string): void }
) {
  const view = new View(editor.locale)
  const inputView = new InputTextView(editor.locale)
  const listView = new ListView(editor.locale)

  inputView.set({
    placeholder: 'Jméno řečníka',
    isReadOnly: false,
  })

  const customOptions = {
    ...options,
    onSelect(speakerId: string) {
      options.onSelect(speakerId)
      inputView.reset()
    },
  }

  fetchSpeakers(editor, listView, customOptions)

  inputView.on(
    'input',
    debounce(
      () =>
        fetchSpeakers(
          editor,
          listView,
          customOptions,
          inputView.element?.value ?? ''
        ),
      500
    )
  )

  view.setTemplate({
    tag: 'div',
    children: [inputView, listView],
  })

  return view
}
