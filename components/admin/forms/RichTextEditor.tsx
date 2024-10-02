'use client'

import { useCallback, useMemo } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Image,
  ImageInsert,
  Italic,
  Link,
  List,
  SpecialCharacters,
  SpecialCharactersEssentials,
  Strikethrough,
  TextTransformation,
  Mention,
  Paragraph,
  Undo,
  Editor,
  EventInfo,
  PasteFromOffice,
} from 'ckeditor5'
import { Embed } from '@/libs/ck-plugins/embed'

import 'ckeditor5/ckeditor5.css'

export default function RickTextEditor(props: {
  includeHeadings: boolean
  value: string
  onChange(value: string): void
}) {
  const handleChange = useCallback(
    (_: EventInfo, editor: Editor) => {
      props.onChange(editor.getData())
    },
    [props.onChange]
  )

  const config = useMemo(() => {
    return {
      toolbar: {
        items: [
          ...(props.includeHeadings ? ['heading', '|'] : []),
          'bold',
          'italic',
          'strikethrough',
          '|',
          'link',
          '|',
          'bullettedList',
          'numberedList',
          '|',
          'embed',
          'insertImageViaUrl',
          '|',
          'specialCharacters',
          '|',
          'undo',
          'redo',
        ],
      },
      plugins: [
        Bold,
        Embed,
        Essentials,
        Italic,
        Link,
        List,
        Image,
        ImageInsert,
        Mention,
        Paragraph,
        Heading,
        Strikethrough,
        Undo,
        PasteFromOffice,
        SpecialCharacters,
        SpecialCharactersEssentials,
        SpecialCharactersSpaces,
        TextTransformation,
        NonBreakableSpaceKeystrokes,
      ],
      typing: {
        transformations: {
          include: [],
          remove: [
            // Do not use the US quotes
            'quotes',
          ],
          extra: [
            // Czech double quotes
            {
              from: buildQuotesRegExp('"'),
              to: [null, '„', null, '“'],
            },
            // Czech single quotes
            {
              from: buildQuotesRegExp("'"),
              to: [null, '‚', null, '‘'],
            },
          ],
        },
      },
      ...(props.includeHeadings
        ? {
            heading: {
              options: [
                {
                  model: 'paragraph' as const,
                  title: 'Paragraph',
                  class: 'ck-heading_paragraph',
                },
                {
                  model: 'heading1' as const,
                  view: 'h2',
                  title: 'Heading',
                  class: 'ck-heading_heading1',
                },
              ],
            },
          }
        : {}),
    }
  }, [props.includeHeadings])

  return (
    <CKEditor
      editor={ClassicEditor}
      data={props.value}
      onChange={handleChange}
      config={config}
    />
  )
}

// From https://github.com/ckeditor/ckeditor5-typing/blob/cd4fa3ea2dcd5789e91fae92d7f220ef850cc7b6/src/texttransformation.js
function buildQuotesRegExp(quoteCharacter: string) {
  return new RegExp(
    `(^|\\s)(${quoteCharacter})([^${quoteCharacter}]*)(${quoteCharacter})$`
  )
}

function SpecialCharactersSpaces(editor: Editor) {
  const specialCharactersPlugin = editor.plugins.get('SpecialCharacters')
  specialCharactersPlugin.addItems('Spaces', [
    { title: 'non-breakable space', character: '\u00a0' },
  ])
  specialCharactersPlugin.addItems('Mathematical', [
    { title: 'Superscript 2', character: '²' },
  ])
}

function NonBreakableSpaceKeystrokes(editor: Editor) {
  // Mac non-breakable space hack, see https://github.com/ckeditor/ckeditor5/issues/1669#issuecomment-478934583
  editor.keystrokes.set('Alt+space', (_0, stop) => {
    editor.execute('input', { text: '\u00a0' })
    stop()
  })
}
