import { BlockQuote, ButtonView, ContextualBalloon, Plugin } from 'ckeditor5'

const PLUGIN_NAME = 'blockQuoteWithSpeaker'

export class BlockQuoteWithSpeaker extends Plugin {
  static get requires() {
    return [BlockQuote]
  }

  static get pluginName() {
    return PLUGIN_NAME
  }

  init() {
    const editor = this.editor

    // Extend block quote model to accept speaker id attribute
    editor.model.schema.extend('blockQuote', {
      allowAttributes: ['speakerId'],
    })

    // Conversion: Model to View (Data Downcast).
    editor.conversion.for('dataDowncast').add((dispatcher) =>
      dispatcher.on(
        'attribute:speakerId:blockQuote',
        (evt, data, conversionApi) => {
          const { writer } = conversionApi
          const viewElement = conversionApi.mapper.toViewElement(data.item)
          if (data.attributeNewValue) {
            writer.setAttribute(
              'speakerId',
              data.attributeNewValue,
              viewElement
            )
          } else {
            writer.removeAttribute('speakerId', viewElement)
          }
        }
      )
    )

    // Conversion: Model to View (Editing Downcast).
    editor.conversion.for('editingDowncast').add((dispatcher) =>
      dispatcher.on(
        'attribute:speakerId:blockQuote',
        (_, data, conversionApi) => {
          const { writer } = conversionApi
          const viewElement = conversionApi.mapper.toViewElement(data.item)
          if (data.attributeNewValue) {
            writer.setAttribute(
              'speakerId',
              data.attributeNewValue,
              viewElement
            )
          } else {
            writer.removeAttribute('speakerId', viewElement)
          }
        }
      )
    )

    // Conversion: View to Model (Upcast).
    editor.conversion.for('upcast').attributeToAttribute({
      view: {
        name: 'blockquote',
        key: 'speakerId',
      },
      model: 'speakerId',
    })

    editor.ui.componentFactory.add(PLUGIN_NAME, (locale) => {
      const button = new ButtonView(locale)

      button.set({
        label: locale.t('Citát řečníka'),
        tooltip: true,
        withText: true,
      })

      button.on('execute', async () => {
        const selectedSpeaker = await this.getSpeakerId()

        if (selectedSpeaker) {
          this.wrapBlockQuoteWithSpeakerId(selectedSpeaker)
        }
      })

      return button
    })
  }

  // Wrap blockquote with an author footer.
  private wrapBlockQuoteWithSpeakerId(speakerId: string) {
    const editor = this.editor
    const model = editor.model

    model.change((writer) => {
      const selection = model.document.selection

      // Wrap the selected text in a blockquote element.
      const blockQuoteElement = writer.createElement('blockQuote', {
        speakerId,
      })

      if (selection) {
        const range = selection.getFirstRange()

        if (range) {
          writer.wrap(range, blockQuoteElement)
        }
      }
    })
  }

  private getSpeakerId() {
    const speakerId = prompt('Zadejte ID řečníka:')

    return speakerId
  }
}
