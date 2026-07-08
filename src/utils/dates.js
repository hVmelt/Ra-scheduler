/**
 * Snap a semester start date back to the Sunday of that week,
 * then advance to the Sunday of the requested (1-indexed) week.
 */
function getWeekStart(startDate, weekNum) {
  if (!startDate) return null;
  const start = new Date(startDate + 'T00:00:00');
  const dow = start.getDay();
  start.setDate(start.getDate() - dow + (weekNum - 1) * 7);
  return start;
}

/**
 * Given a semester start date and a week number (1-indexed),
 * return { sun, mon, ..., sat, weekend } as short M/D strings.
 */
export function getWeekDates(startDate, weekNum) {
  const start = getWeekStart(startDate, weekNum);
  if (!start) return null;
  const out = {};
  ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].forEach((d, i) => {
    const dt = new Date(start);
    dt.setDate(dt.getDate() + i);
    out[d] = `${dt.getMonth() + 1}/${dt.getDate()}`;
  });
  out.weekend = `${out.fri}–${out.sat}`;
  return out;
}

/**
 * For each week, return which specific days fall inside any break range.
 * The synthetic 'weekend' day is added if either Fri or Sat is a break.
 *
 * @returns Map<weekIndex, { days: Set<dayKey>, labels: Set<string> }>
 */
export function computeBreakDays(startDate, breaks, weeks) {
  const map = new Map();
  if (!startDate) return map;

  for (const brk of breaks) {
    if (!brk.start || !brk.end) continue;
    const brkStart = new Date(brk.start + 'T00:00:00');
    const brkEnd = new Date(brk.end + 'T00:00:00');
    if (brkEnd < brkStart) continue;
    const label = brk.label?.trim() || 'Break';

    for (let w = 0; w < weeks; w++) {
      const weekStart = getWeekStart(startDate, w + 1);
      if (!weekStart) continue;

      ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].forEach((d, i) => {
        const dayDate = new Date(weekStart);
        dayDate.setDate(dayDate.getDate() + i);
        if (dayDate >= brkStart && dayDate <= brkEnd) {
          if (!map.has(w)) {
            map.set(w, { days: new Set(), labels: new Set() });
          }
          const entry = map.get(w);
          entry.days.add(d);
          entry.labels.add(label);
        }
      });
    }
  }

  // Weekend shift is off if either Fri or Sat is a break day
  for (const entry of map.values()) {
    if (entry.days.has('fri') || entry.days.has('sat')) {
      entry.days.add('weekend');
    }
  }

  return map;
}
