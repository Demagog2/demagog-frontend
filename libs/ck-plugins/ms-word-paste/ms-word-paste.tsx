import {
  type ClipboardInputTransformationEvent,
  ClipboardPipeline,
  Plugin,
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

          for (const paragraph of data.content.getChildren()) {
            if (!paragraph.is('element', 'p')) {
              return
            }

            for (const span of paragraph.getChildren()) {
              if (span.is('element', 'span')) {
                let linkVisited = false
                for (const link of span.getChildren()) {
                  if (link.is('element', 'a')) {
                    if (linkVisited) {
                      setTimeout(() => {
                        this._scheduledRemoval()
                      }, 1)

                      return
                    }

                    linkVisited = true
                  } else {
                    linkVisited = false
                  }
                }
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
}
