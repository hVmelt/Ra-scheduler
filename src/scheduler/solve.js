import { CAPS, WEEKNIGHT_KEYS } from '../constants.js';

/**
 * Assign each RA to exactly one weeknight, respecting availability
 * and per-night capacities. Applies overrides first, then backtracks
 * on remaining RAs starting from the most-constrained.
 *
 * @param {Array} ras - list of { id, avail, override }
 * @returns {Object|null} { [raId]: weeknightKey } or null if no valid assignment
 */
export function solve(ras) {
  const remaining = { ...CAPS };
  const assignment = {};
  const flexible = [];

  for (const ra of ras) {
    if (ra.override && WEEKNIGHT_KEYS.includes(ra.override)) {
      if (remaining[ra.override] > 0) {
        assignment[ra.id] = ra.override;
        remaining[ra.override] -= 1;
      } else {
        flexible.push(ra);
      }
    } else {
      flexible.push(ra);
    }
  }

  // Most constrained first: fewest available weeknights
  flexible.sort((a, b) => {
    const availCount = (r) =>
      WEEKNIGHT_KEYS.filter((k) => r.avail[k]).length;
    return availCount(a) - availCount(b) || a.id - b.id;
  });

  const backtrack = (i) => {
    if (i === flexible.length) return true;
    const ra = flexible[i];
    for (const k of WEEKNIGHT_KEYS) {
      if (ra.avail[k] && remaining[k] > 0) {
        assignment[ra.id] = k;
        remaining[k] -= 1;
        if (backtrack(i + 1)) return true;
        remaining[k] += 1;
        delete assignment[ra.id];
      }
    }
    return false;
  };

  return backtrack(0) ? assignment : null;
}
