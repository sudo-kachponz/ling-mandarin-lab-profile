/**
 * Normalize an already-stored number to wa.me digits. Strips non-digits and
 * maps a legacy Indonesian mobile leading 0 (08…) to 62 for numbers saved
 * before the country picker existed. New numbers arrive as E.164 (+62…, +886…),
 * already prefixed. A bare foreign local number (e.g. Taiwan 0901…) can't be
 * guessed from a leading 0, so it must be entered via the country picker.
 */
export function waPhone(raw: string): string {
  let d = (raw || '').replace(/\D/g, '');
  if (d.startsWith('08')) d = '62' + d.slice(1);
  return d;
}
