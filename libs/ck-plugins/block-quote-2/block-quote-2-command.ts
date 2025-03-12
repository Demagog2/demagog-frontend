import { Command } from 'ckeditor5'
import {
  applyWrapper,
  checkWrapperEnabled,
  checkWrapperValue,
  removeWrapper,
} from '../utils/containers'

const MODEL_NAME = 'blockQuoteWithSpeaker'

export class BlockQuoteWithSpeakerCommmand extends Command {
  /**
   * Whether the selection starts in a block quote.
   *
   * @observable
   * @readonly
   */
  declare public value: boolean

  /**
   * @inheritDoc
   */
  public override refresh(): void {
    this.value = this._getValue()
    this.isEnabled = this._checkEnabled()
  }

  /**
   * Executes the command. When the command {@link #value is on}, all top-most block quotes within
   * the selection will be removed. If it is off, all selected blocks will be wrapped with
   * a block quote.
   *
   * @fires execute
   * @param options Command options.
   * @param options.forceValue If set, it will force the command behavior. If `true`, the command will apply a block quote,
   * otherwise the command will remove the block quote. If not set, the command will act basing on its current value.
   * @param options.speakerId If set, block quote will be created with data-speaker-id attribute.
   * @param options.link If set, block quote will be created with data-link attribute.
   * @param options.media If set, block quote will be created with data-media attribute.
   * @param options.quotedAt If set, block quote will be created with data-quoted-at attribute.
   * @param options.speakerCustomName If set, block quote will be created with data-speaker-custom-name attribute.
   */
  public override execute(
    options: {
      forceValue?: boolean
      speakerId?: string
      link?: string
      media?: string
      quotedAt?: string
      speakerCustomName?: string
    } = {}
  ): void {
    const model = this.editor.model
    const selection = model.document.selection

    const blocks = Array.from(selection.getSelectedBlocks())

    const value =
      options.forceValue === undefined ? !this.value : options.forceValue

    model.change((writer) => {
      if (!value) {
        removeWrapper(writer, MODEL_NAME, blocks)
      } else {
        applyWrapper(this.editor, writer, blocks, MODEL_NAME, {
          ...(options.speakerId ? { speakerId: options.speakerId } : {}),
          ...(options.link ? { link: options.link } : {}),
          ...(options.media ? { media: options.media } : {}),
          ...(options.quotedAt ? { quotedAt: options.quotedAt } : {}),
          ...(options.speakerCustomName
            ? { speakerCustomName: options.speakerCustomName }
            : {}),
        })
      }
    })
  }

  /**
   * Checks the command's {@link #value}.
   */
  private _getValue(): boolean {
    return checkWrapperValue(this.editor, MODEL_NAME)
  }

  /**
   * Checks whether the command can be enabled in the current context.
   *
   * @returns Whether the command should be enabled.
   */
  private _checkEnabled(): boolean {
    return checkWrapperEnabled(this.editor, MODEL_NAME, this.value)
  }
}
