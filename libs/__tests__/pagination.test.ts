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

function paginate({
  currentPage,
  totalCount,
}: {
  currentPage: number
  totalCount: number
}): (Page | Gap)[] {
  // If we need to generate a gap
  if (currentPage + GAP_WINDOW + 1 < totalCount) {
    return [
      ...range(0, currentPage).map((page) => makePage(page, false)),
      ...range(currentPage, currentPage + GAP_WINDOW).map((page) =>
        makePage(page, page === currentPage)
      ),
      makeGap(),
      makePage(totalCount - 1, false),
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

  describe('for total count 10', () => {
    it('generates gap after 3 following pages with page 0 active', () => {
      expect(paginate({ currentPage: 0, totalCount: 10 })).toEqual([
        makePage(0, true),
        makePage(1),
        makePage(2),
        makePage(3),
        makeGap(),
        makePage(9),
      ])
    })

    it('generates gap after 3 following pages with page 1 active', () => {
      expect(paginate({ currentPage: 1, totalCount: 10 })).toEqual([
        makePage(0),
        makePage(1, true),
        makePage(2),
        makePage(3),
        makePage(4),
        makeGap(),
        makePage(9),
      ])
    })

    it('generates gap after 3 following pages with page 2 active', () => {
      expect(paginate({ currentPage: 2, totalCount: 10 })).toEqual([
        makePage(0),
        makePage(1),
        makePage(2, true),
        makePage(3),
        makePage(4),
        makePage(5),
        makeGap(),
        makePage(9),
      ])
    })

    it('generates gap after 3 following pages with page 3 active', () => {
      expect(paginate({ currentPage: 3, totalCount: 10 })).toEqual([
        makePage(0),
        makePage(1),
        makePage(2),
        makePage(3, true),
        makePage(4),
        makePage(5),
        makePage(6),
        makeGap(),
        makePage(9),
      ])
    })

    it('generates gap after 3 following pages with page 4 active', () => {
      expect(paginate({ currentPage: 4, totalCount: 10 })).toEqual([
        makePage(0),
        makePage(1),
        makePage(2),
        makePage(3),
        makePage(4, true),
        makePage(5),
        makePage(6),
        makePage(7),
        makeGap(),
        makePage(9),
      ])
    })

    it('generates gap after 3 following pages with page 5 active', () => {
      expect(paginate({ currentPage: 5, totalCount: 10 })).toEqual([
        makePage(0),
        makeGap(),
        makePage(5, true),
        makePage(6),
        makePage(7),
        makePage(9),
        makePage(9),
      ])
    })
  })
})
