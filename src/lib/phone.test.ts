import { describe, it, expect } from 'vitest';
import { waPhone } from './phone';

describe('waPhone', () => {
  it('keeps stored international numbers intact', () => {
    expect(waPhone('60123456789')).toBe('60123456789');
    expect(waPhone('886912345678')).toBe('886912345678');
  });
  it('maps a legacy leading zero to Indonesia', () => {
    expect(waPhone('08123456789')).toBe('628123456789');
  });
});
