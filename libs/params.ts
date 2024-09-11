type SearchParams = { [key: string]: string | string[] | undefined }

export type PropsWithSearchParams<T = {}> = T & { searchParams: SearchParams }
