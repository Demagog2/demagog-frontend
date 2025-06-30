import { incrementTime } from '../date-time'
import { decrementTime } from '../date-time'

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
  })
  describe('#decrementTime', () => {
    describe('seconds decrement', () => {
      it('should decrement', () => {
        expect(decrementTime(35, 'seconds')).toBe(34)
      })
      it('should decrement to 0', () => {
        expect(decrementTime(1, 'seconds')).toBe(0)
      })
      it('should rollover from 0 to 59', () => {
        expect(decrementTime(0, 'seconds')).toBe(59)
      })
      it('should rollover in complex time', () => {
        expect(decrementTime(14340, 'seconds')).toBe(14399)
      })
    })
    describe('minutes decrement', () => {
      it('should decrement', () => {
        expect(decrementTime(120, 'minutes')).toBe(60)
      })
      it('should decrement to 0', () => {
        expect(decrementTime(60, 'minutes')).toBe(0)
      })
      it('should rollover', () => {
        expect(decrementTime(0, 'minutes')).toBe(3540)
      })
      it('should rollover in complex time', () => {
        expect(decrementTime(14408, 'minutes')).toBe(17948)
      })
      it('should preserve seconds when decrementing minutes', () => {
        expect(decrementTime(64, 'minutes')).toBe(4)
      })
    })
    describe('hours decrement', () => {
      it('should decrement', () => {
        expect(decrementTime(7200, 'hours')).toBe(3600)
      })
      it('should decrement to 0', () => {
        expect(decrementTime(3600, 'hours')).toBe(0)
      })
      it('should rollover', () => {
        expect(decrementTime(0, 'hours')).toBe(82800)
      })
      it('should rollover in complex time', () => {
        expect(decrementTime(2318, 'hours')).toBe(85118)
      })
      it('should preserve minutes and seconds when decrementing hours', () => {
        expect(decrementTime(14348, 'hours')).toBe(10748)
      })
    })
  })
})
