import { makeGap, makePage, paginate, fromPageToCursor } from '../pagination'

describe('pagination', () => {
  describe('#paginate', () => {
    it('handles an empty array', () => {
      expect(paginate({ currentPage: 0, totalPages: 0 })).toEqual([])
    })

    it('generates pages for small total count', () => {
      expect(paginate({ currentPage: 0, totalPages: 5 })).toEqual([
        makePage(0, true),
        makePage(1),
        makePage(2),
        makePage(3),
        makePage(4),
      ])
    })

    describe('for total count 20', () => {
      const totalPages = 20

      it('has gap after tree pages', () => {
        expect(paginate({ currentPage: 0, totalPages })).toEqual([
          makePage(0, true),
          makePage(1),
          makePage(2),
          makePage(3),
          makeGap(),
          makePage(19),
        ])
      })

      it('has gap before and after', () => {
        expect(paginate({ currentPage: 10, totalPages })).toEqual([
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
        expect(paginate({ currentPage: 19, totalPages })).toEqual([
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

  describe('#fromPageToCursor', () => {
    it('returns null for page 1', () => {
      expect(fromPageToCursor(1, 10)).toEqual({ after: null, first: 10 })
    })

    it('returns cursor for page 2', () => {
      expect(fromPageToCursor(2, 10)).toEqual({ after: 'MTA=', first: 10 })
    })

    it('returns cursor for page 3', () => {
      expect(fromPageToCursor(3, 10)).toEqual({ after: 'MjA=', first: 10 })
    })
  })
})
