/**
 * Normalize an already-stored number to wa.me digits. Strips non-digits and
 * maps a legacy leading 0 to Indonesia (62) for numbers saved before the
 * country picker existed. New numbers arrive as E.164 (+62…), already prefixed.
 */
export function waPhone(raw: string): string {
  let d = (raw || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '62' + d.slice(1);
  return d;
}
