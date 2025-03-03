import { Editor, View, InputTextView } from 'ckeditor5'

export function BlockQuoteUrlView(
  editor: Editor,
  options: { onUrlChange(url: string): void }
) {
  const view = new View(editor.locale)
  const inputView = new InputTextView(editor.locale)

  inputView.set({
    placeholder: 'Zadejte URL citátu',
    isReadOnly: false,
  })

  inputView.on('input', () => {
    options.onUrlChange(inputView.element?.value ?? '')
  })

  view.setTemplate({
    tag: 'div',
    attributes: {
      style: {
        marginTop: 'var(--ck-spacing-medium)',
      },
    },
    children: [inputView],
  })

  return view
} 