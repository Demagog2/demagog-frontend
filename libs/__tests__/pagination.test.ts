import { makeGap, makePage, paginate } from '../pagination'

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
