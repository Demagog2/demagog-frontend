/**
 * Prepends server name and path to an image path received from the GraphQL API.
 */
export function imagePath(path: string) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  return mediaUrl + path
}

const IMAGE_SIZES = {
  large: {
    width: 960,
    height: 540,
  },
  medium: {
    width: 360,
    height: 202,
  },
  small: {
    width: 320,
    height: 180,
  },
}

export function getPreviewImageSize(imageSize: 'large' | 'medium' | 'small') {
  return {
    width: IMAGE_SIZES[imageSize].width,
    height: IMAGE_SIZES[imageSize].height,
  }
}
