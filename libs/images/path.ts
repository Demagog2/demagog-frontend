/**
 * Prepends server name and path to an image path received from the GraphQL API.
 */
export function imagePath(path: string) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  return mediaUrl + path
}

const PREVIEW_IMAGE_SIZE = {
  large: {
    width: 360,
    height: 202,
  },
  small: {
    width: 320,
    height: 175,
  },
}

export function getPreviewImageSize(isLargerPreview: boolean) {
  const size = isLargerPreview ? 'large' : 'small'

  return {
    width: PREVIEW_IMAGE_SIZE[size].width,
    height: PREVIEW_IMAGE_SIZE[size].height,
  }
}
