import { incrementTime } from '../date-time'

describe('DateTime', () => {
  describe('#incrementTime', () => {
    it('should increment time by 1 second', () => {
      expect(incrementTime(16, 'seconds')).toBe(17)
    })

    it('should increment time by 60 seconds', () => {
      expect(incrementTime(240, 'minutes')).toBe(300)
    })

    it('should increment time by 3600', () => {
      expect(incrementTime(3600, 'hours')).toBe(7200)
    })
  })
})
