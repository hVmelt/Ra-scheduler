/**
 * Distribute one weekend shift per week across the roster.
 * Non-Thu RAs each target 1 shift. Thu RAs split the remainder evenly.
 * Only RAs who marked weekends available are eligible.
 * Spreads across the semester by preferring people with fewer shifts
 * and earlier last-shift week.
 *
 * @param {Array} ras
 * @param {Object} assignment - weeknight assignment map
 * @param {number} weeks
 * @returns {{ weekends: number[], completed: Object }}
 */
export function distributeWeekends(ras, assignment, weeks) {
  const thuIds = ras
    .filter((r) => assignment[r.id] === 'thu')
    .map((r) => r.id);
  const nonThu = ras.filter((r) => assignment[r.id] !== 'thu');

  const total = weeks;
  const nonThuWknd = nonThu.filter((r) => r.avail.weekend);
  const targets = {};
  nonThuWknd.forEach((r) => (targets[r.id] = 1));

  const remaining = total - nonThuWknd.length;
  const thuAvailable = thuIds.filter((id) => {
    const r = ras.find((x) => x.id === id);
    return r?.avail.weekend;
  });
  const perThu =
    thuAvailable.length > 0 ? Math.floor(remaining / thuAvailable.length) : 0;
  const extra =
    thuAvailable.length > 0 ? remaining % thuAvailable.length : 0;
  thuAvailable.forEach((id, i) => {
    targets[id] = perThu + (i < extra ? 1 : 0);
  });

  const completed = {};
  ras.forEach((r) => (completed[r.id] = 0));
  const lastWeek = {};

  const pick = () => {
    let candidates = ras.filter(
      (r) => r.avail.weekend && completed[r.id] < (targets[r.id] || 0)
    );
    // Fallback: everyone available who wants the weekend
    if (candidates.length === 0) {
      candidates = ras.filter((r) => r.avail.weekend);
    }
    if (candidates.length === 0) return null;

    candidates.sort((a, b) => {
      const ca = completed[a.id];
      const cb = completed[b.id];
      if (ca !== cb) return ca - cb;
      const la = lastWeek[a.id] ?? -999;
      const lb = lastWeek[b.id] ?? -999;
      if (la !== lb) return la - lb;
      return a.id - b.id;
    });
    return candidates[0].id;
  };

  const result = [];
  for (let w = 0; w < weeks; w++) {
    const person = pick();
    if (person != null) {
      completed[person] += 1;
      lastWeek[person] = w;
    }
    result.push(person);
  }
  return { weekends: result, completed };
}
