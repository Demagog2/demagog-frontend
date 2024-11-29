import {
  Plugin,
  ViewDocumentFragment,
  ViewElement,
  ViewNode,
  WidgetToolbarRepository,
} from 'ckeditor5'
import { getClosestBoxViewElement } from '../utils/containers'

export class BoxToolbar extends Plugin {
  public static get requires() {
    return [WidgetToolbarRepository]
  }

  public static get pluginName() {
    return 'BoxToolbar' as const
  }

  public static override get isOfficialPlugin(): false {
    return false
  }

  public afterInit(): void {
    const editor = this.editor

    const repository = editor.plugins.get(WidgetToolbarRepository)

    repository.register('box', {
      ariaLabel: 'Nastavení rámečku',
      items: ['box:toggle-float', 'box:toggle-bg'],
      getRelatedElement: (selection) => getClosestBoxViewElement(selection),
    })
  }
}

function isBox(viewElement: ViewElement): boolean {
  return !!viewElement.getCustomProperty('box')
}
