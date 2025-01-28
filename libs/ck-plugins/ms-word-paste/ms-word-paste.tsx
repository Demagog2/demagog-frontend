import {
  type ClipboardInputTransformationEvent,
  ClipboardPipeline,
  Plugin,
  type ViewDocumentFragment,
  type ViewNode,
} from 'ckeditor5'

export class MsWordPaste extends Plugin {
  public static get requires() {
    return [ClipboardPipeline] as const
  }

  public static get pluginName() {
    return 'MsWordPaste`' as const
  }

  public static override get isOfficialPlugin(): false {
    return false
  }

  public init(): void {
    const editor = this.editor

    editor.plugins
      .get('ClipboardPipeline')
      .on<ClipboardInputTransformationEvent>(
        'inputTransformation',
        (_, data) => {
          if (data.content.isEmpty) {
            return
          }

          // Copied whole paragraph
          if (this.isCopyPastedParagraph(data.content)) {
            for (const paragraph of data.content.getChildren()) {
              if (!paragraph.is('element', 'p')) {
                return
              }

              for (const span of paragraph.getChildren()) {
                if (this.hasJoinedLinks(span)) {
                  return setTimeout(() => {
                    this._scheduledRemoval()
                  }, 1)
                }
              }
            }
          }

          // Copied only part of the paragraph -> span
          if (this.isCopyPastedSpan(data.content)) {
            for (const span of data.content.getChildren()) {
              if (this.hasJoinedLinks(span)) {
                return setTimeout(() => {
                  this._scheduledRemoval()
                }, 1)
              }
            }
          }
        },
        { priority: 'high' }
      )
  }

  _scheduledRemoval() {
    this.editor.model.change((writer) => {
      const root = this.editor.model.document.getRoot()

      if (!root) {
        return
      }

      for (const paragraph of root.getChildren()) {
        if (!paragraph.is('element', 'paragraph')) continue

        let previousLink = null

        for (const node of paragraph.getChildren()) {
          if (node.is('$text') && node.hasAttribute('linkHref')) {
            if (previousLink) {
              writer.insertText(' ', writer.createPositionBefore(node))
            }
            previousLink = node
          } else {
            previousLink = null
          }
        }
      }
    })
  }

  private isCopyPastedParagraph(document: ViewDocumentFragment) {
    for (const node of document.getChildren()) {
      if (node.is('element', 'p')) {
        return true
      }
    }

    return false
  }

  private isCopyPastedSpan(document: ViewDocumentFragment) {
    for (const node of document.getChildren()) {
      if (node.is('element', 'span')) {
        return true
      }
    }

    return false
  }

  private hasJoinedLinks(span: ViewNode) {
    if (!span.is('element', 'span')) {
      return false
    }

    for (const link of span.getChildren()) {
      if (link.is('element', 'a') && link.nextSibling?.is('element', 'a')) {
        return true
      }
    }

    return false
  }
}
