export async function callApi(url: string, options: RequestInit) {
  // TODO: Use proper ENV and do not reuse media
  const server = process.env.NEXT_PUBLIC_MEDIA_URL ?? 'https://demagog.cz'

  options.credentials = 'include'

  return await fetch(server + url, options).then((response: Response) => {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      throw response
    }
  })
}
