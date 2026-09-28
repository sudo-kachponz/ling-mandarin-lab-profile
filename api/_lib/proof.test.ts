import { describe, it, expect } from 'vitest';
import { proofFileExists } from './proof.js';

describe('proofFileExists', () => {
  const ref = 'LCL-M-123-45';
  it('true only on an exact object-name match', () => {
    expect(proofFileExists([{ name: ref }], `proofs/${ref}`)).toBe(true);
  });
  it('false when the folder is empty (QRIS generated, never uploaded)', () => {
    expect(proofFileExists([], `proofs/${ref}`)).toBe(false);
    expect(proofFileExists(null, `proofs/${ref}`)).toBe(false);
  });
  it('false on a mere prefix/substring, not an exact name', () => {
    expect(proofFileExists([{ name: `${ref}-2` }], `proofs/${ref}`)).toBe(false);
  });
  it('false when proofPath is missing', () => {
    expect(proofFileExists([{ name: ref }], null)).toBe(false);
  });
});
