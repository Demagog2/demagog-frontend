import { incrementTime } from '../date-time'

describe('DateTime', () => {
  describe('#incrementTime', () => {
    describe('seconds increment', () => {
      it('should increase', () => {
        expect(incrementTime(35, 'seconds')).toBe(36)
      })
      it('should increase from zero', () => {
        expect(incrementTime(0, 'seconds')).toBe(1)
      })
      it('should rollover', () => {
        expect(incrementTime(59, 'seconds')).toBe(0)
      })
      it('should rollover in complex time', () => {
        expect(incrementTime(3719, 'seconds')).toBe(3660)
      })
    })
    describe('minutes increment', () => {
      it('should increment', () => {
        expect(incrementTime(60, 'minutes')).toBe(120)
      })
      it('should increment from zero', () => {
        expect(incrementTime(0, 'minutes')).toBe(60)
      })
      it('should rollover minutes', () => {
        expect(incrementTime(3540, 'minutes')).toBe(0)
      })
      it('should rollover minutes in complex time', () => {
        expect(incrementTime(7199, 'minutes')).toBe(3659)
      })
      it('should preserve seconds when incrementing minutes', () => {
        expect(incrementTime(45285, 'minutes')).toBe(45345)
      })
    })
    describe('hours increment', () => {
      it('should increment hours from zero', () => {
        expect(incrementTime(0, 'hours')).toBe(3600)
      })
      it('should rollover hours', () => {
        expect(incrementTime(82800, 'hours')).toBe(0)
      })
      it('should rollover hours', () => {
        expect(incrementTime(86399, 'hours')).toBe(3599)
      })
      it('should preverse minutes and seconds when incrementing hours', () => {
        expect(incrementTime(45345, 'hours')).toBe(48945)
      })
    })
    describe('boundary cases', () => {
      it('boundary tests seconds incement', () => {
        expect(incrementTime(86399, 'seconds')).toBe(86340)
      })
      it('boundary tests minutes increment', () => {
        expect(incrementTime(86399, 'minutes')).toBe(82859)
      })
    })
  })
})
