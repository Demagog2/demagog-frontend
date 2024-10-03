/**
 * Prepends server name and path to an image path received from the GraphQL API.
 */
export function imagePath(path: string) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  return mediaUrl + path
}
