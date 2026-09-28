import { describe, it, expect } from 'vitest';
import { waPhone } from './phone';

describe('waPhone', () => {
  it('keeps stored international numbers intact', () => {
    expect(waPhone('60123456789')).toBe('60123456789');
    expect(waPhone('886912345678')).toBe('886912345678');
  });
  it('maps a legacy Indonesian mobile leading zero to Indonesia', () => {
    expect(waPhone('08123456789')).toBe('628123456789');
  });
  it('does not prefix 62 onto a non-Indonesian leading-zero number', () => {
    // Taiwan local number: 0 trunk prefix is not 08, so no wrong 62.
    expect(waPhone('0901436845')).toBe('0901436845');
  });
});
