import { parseStatementId } from '@/libs/ck-plugins/embed-statement'

describe('EmbedStatement', () => {
  describe('#parseStatementId', () => {
    it('returns null for empty string', () => {
      expect(parseStatementId('')).toBeNull()
    })

    it('returns number for numerical string', () => {
      ;['42', '12313123', '0'].forEach((num) => {
        expect(parseStatementId(num)).toEqual(Number(num))
      })
    })

    it('returns number for statement URL', () => {
      ;[['https://demagog.cz/vyrok/23606', 23606]].forEach(
        ([url, expected]) => {
          expect(parseStatementId(url as string)).toEqual(expected)
        }
      )
    })

    it('returns number for nonsensical string', () => {
      ;['Hello, World'].forEach((num) => {
        expect(parseStatementId(num)).toBeNull()
      })
    })
  })
})
