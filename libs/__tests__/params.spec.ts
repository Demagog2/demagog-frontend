import { getBooleanParam } from "../query-params";

describe('Params', () => {
  describe('#getBooleanParam', () =>  {
    it('returns false if param is missing', () => {
      expect(getBooleanParam()).toBe(false)
    });

    it('returns true if param is present and is true', () => {
      expect(getBooleanParam('true')).toBe(true)
    });

    it('returns true if param is present and is true', () => {
      expect(getBooleanParam('false')).toBe(false)
    });
  });
});
