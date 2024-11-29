import { Command } from 'ckeditor5'
import { getClosestSelectedBoxElement } from '../utils/containers'

export class BoxToggleBgCommand extends Command {
  declare public value: boolean | false

  public override refresh(): void {
    const editor = this.editor

    const element = getClosestSelectedBoxElement(
      editor.model.document.selection
    )!

    this.isEnabled = !!element

    if (this.isEnabled && element.hasAttribute('hasGreyBg')) {
      this.value = element.getAttribute('hasGreyBg') as boolean | false
    } else {
      this.value = false
    }
  }

  public override execute(): void {
    const editor = this.editor
    const model = editor.model
    const boxElement = getClosestSelectedBoxElement(model.document.selection)

    model.change((writer) => {
      writer.setAttribute(
        'hasGreyBg',
        !boxElement?.getAttribute('hasGreyBg'),
        boxElement!
      )
    })
  }
}
