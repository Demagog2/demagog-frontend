import { range } from 'lodash'

type Page = {
  type: 'page'
  value: number
  active: boolean
}

type Gap = {
  type: 'gap'
}

const GAP_WINDOW = 4

function makePage(page: number, active: boolean = false): Page {
  return { type: 'page', active, value: page }
}

function makeGap(): Gap {
  return { type: 'gap' }
}

function isGapBeforeNeeded(currentPage: number): boolean {
  return currentPage - GAP_WINDOW - 1 >= 0
}

function isGapAfterNeeded(currentPage: number, totalCount: number): boolean {
  return currentPage + GAP_WINDOW + 1 < totalCount
}

function paginate({
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

describe('pagination', () => {
  it('handles an empty array', () => {
    expect(paginate({ currentPage: 0, totalCount: 0 })).toEqual([])
  })

  it('generates pages for small total count', () => {
    expect(paginate({ currentPage: 0, totalCount: 5 })).toEqual([
      makePage(0, true),
      makePage(1),
      makePage(2),
      makePage(3),
      makePage(4),
    ])
  })

  describe('for total count 20', () => {
    const totalCount = 20

    it('has gap after tree pages', () => {
      expect(paginate({ currentPage: 0, totalCount })).toEqual([
        makePage(0, true),
        makePage(1),
        makePage(2),
        makePage(3),
        makeGap(),
        makePage(19),
      ])
    })

    it('has gap before and after', () => {
      expect(paginate({ currentPage: 10, totalCount })).toEqual([
        makePage(0),
        makeGap(),
        makePage(7),
        makePage(8),
        makePage(9),
        makePage(10, true),
        makePage(11),
        makePage(12),
        makePage(13),
        makeGap(),
        makePage(19),
      ])
    })

    it('has gap before pages', () => {
      expect(paginate({ currentPage: 19, totalCount })).toEqual([
        makePage(0),
        makeGap(),
        makePage(16),
        makePage(17),
        makePage(18),
        makePage(19, true),
      ])
    })
  })
})
