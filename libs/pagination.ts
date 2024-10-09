import { range } from 'lodash'

const DEFAULT_PAGE = 1

export function parsePage(page?: string | string[]): number {
  return parseInt(String(page ?? DEFAULT_PAGE), 10) ?? DEFAULT_PAGE
}

type Page = {
  type: 'page'
  value: number
  active: boolean
}

type Gap = {
  type: 'gap'
}

const GAP_WINDOW = 4

function isGapBeforeNeeded(currentPage: number): boolean {
  return currentPage - GAP_WINDOW - 1 >= 0
}

function isGapAfterNeeded(currentPage: number, totalCount: number): boolean {
  return currentPage + GAP_WINDOW + 1 < totalCount
}

export function makePage(page: number, active: boolean = false): Page {
  return { type: 'page', active, value: page }
}

export function makeGap(): Gap {
  return { type: 'gap' }
}

export function paginate({
  currentPage,
  totalCount,
}: {
  currentPage: number
  totalCount: number
}): (Page | Gap)[] {
  if (
    isGapBeforeNeeded(currentPage) &&
    isGapAfterNeeded(currentPage, totalCount)
  ) {
    return [
      makePage(0),
      makeGap(),
      ...range(currentPage - GAP_WINDOW + 1, currentPage + GAP_WINDOW).map(
        (page) => makePage(page, page === currentPage)
      ),
      makeGap(),
      makePage(totalCount - 1),
    ]
  }

  // If we need to generate a gap before the current page
  if (isGapBeforeNeeded(currentPage)) {
    return [
      makePage(0),
      makeGap(),
      ...range(currentPage - GAP_WINDOW + 1, totalCount).map((page) =>
        makePage(page, page === currentPage)
      ),
    ]
  }

  // If we need to generate a gap after the current page
  if (isGapAfterNeeded(currentPage, totalCount)) {
    return [
      ...range(0, currentPage + GAP_WINDOW).map((page) =>
        makePage(page, page === currentPage)
      ),
      makeGap(),
      makePage(totalCount - 1),
    ]
  }

  return range(0, totalCount).map((page) =>
    makePage(page, page === currentPage)
  )
}

export function buildGraphQLVariables({
  before,
  after,
  pageSize,
}: {
  before?: string
  after?: string
  pageSize: number
}) {
  if (after) {
    return { after: after, first: pageSize }
  }

  if (before) {
    return { before: after, last: pageSize }
  }

  return { first: pageSize }
}
