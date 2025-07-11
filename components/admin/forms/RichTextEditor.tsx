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
  ImageToolbar,
  ImageCaption,
  ContextualBalloon,
} from 'ckeditor5'
import { Embed } from '@/libs/ck-plugins/embed'

import { EmbedStatement } from '@/libs/ck-plugins/embed-statement'
import { EmbedArticle } from '@/libs/ck-plugins/embed-article'
import { BlockQuoteWithSpeaker } from '@/libs/ck-plugins/block-quote-2/block-quote-2-plugin'
import { Box } from '@/libs/ck-plugins/box/box'
import { BoxToolbar } from '@/libs/ck-plugins/box/box-toolbar'
import { MsWordPaste } from '@/libs/ck-plugins/ms-word-paste/ms-word-paste'

export default function RichTextEditor(props: {
  includeHeadings?: boolean
  includeStatements?: boolean
  value: string
  onChange(value: string): void
  onBlur?(): void
}) {
  const { onChange, onBlur } = props

  const handleChange = useCallback(
    (_: EventInfo, editor: Editor) => {
      onChange(editor.getData())
    },
    [onChange]
  )

  const config = useMemo(() => {
    return {
      image: {
        toolbar: [
          'toggleImageCaption',
          'imageTextAlternative',
          'ckboxImageEdit',
        ],
      },
      toolbar: {
        items: [
          ...(props.includeHeadings ? ['heading', '|'] : []),
          'bold',
          'italic',
          'strikethrough',
          'blockQuoteWithSpeaker',
          '|',
          'link',
          '|',
          'bulletedList',
          'numberedList',
          'box',
          '|',
          {
            label: 'Vložit',
            withText: true,
            icon: 'threeVerticalDots',
            items: [
              'embed',
              'insertImageViaUrl',
              'embedArticle',
              'embedStatement',
            ],
          },
          '|',
          'specialCharacters',
          '|',
          'undo',
          'redo',
        ],
        shouldNotGroupWhenFull: true,
      },
      plugins: [
        PasteFromOffice,
        MsWordPaste,
        ContextualBalloon,
        Bold,
        BlockQuoteWithSpeaker,
        Box,
        BoxToolbar,
        Embed,
        EmbedArticle,
        EmbedStatement,
        Essentials,
        Italic,
        Link,
        List,
        Image,
        ImageInsert,
        ImageCaption,
        ImageToolbar,
        Mention,
        Paragraph,
        Heading,
        Strikethrough,
        Undo,
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
                  title: 'Nadpis h2',
                  class: 'ck-heading_heading1',
                },
                {
                  model: 'heading2' as const,
                  view: 'h3',
                  title: 'Nadpis h3',
                  class: 'ck-heading_heading2',
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
      onBlur={onBlur}
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
