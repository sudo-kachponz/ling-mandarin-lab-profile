import { getSupabaseAdmin } from './supabaseAdmin.js';

/**
 * Did the buyer actually upload a payment proof for this order?
 *
 * An order is created (and its QRIS generated) with status
 * 'awaiting_verification' and a proof_path BEFORE the buyer uploads anything —
 * uploading is a separate step that never touches the DB. So proof_path being
 * set means nothing; the only ground truth is whether the object exists in
 * Storage. Admin listing + approval gate on this so a buyer who merely generated
 * a QR (never paid) can't slip into the queue or be approved.
 */

const PROOF_BUCKET = 'payment-proofs';

/** Pure: does a Storage listing contain the exact object for this path? */
export function proofFileExists(
  files: { name: string }[] | null | undefined,
  proofPath: string | null | undefined
): boolean {
  if (!proofPath) return false;
  const name = proofPath.slice(proofPath.lastIndexOf('/') + 1);
  return (files || []).some((f) => f.name === name);
}

/** Storage-backed check. Fails closed: any error → treated as "no proof". */
export async function proofUploaded(proofPath: string | null | undefined): Promise<boolean> {
  if (!proofPath) return false;
  const supabase = getSupabaseAdmin();
  const slash = proofPath.lastIndexOf('/');
  const folder = slash === -1 ? '' : proofPath.slice(0, slash);
  const name = proofPath.slice(slash + 1);
  const { data, error } = await supabase.storage
    .from(PROOF_BUCKET)
    .list(folder, { search: name, limit: 100 });
  if (error) return false;
  return proofFileExists(data, proofPath);
}
