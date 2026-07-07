/**
 * Given a semester start date and a week number (1-indexed),
 * return { sun, mon, tue, wed, thu, fri, sat, weekend } as short M/D strings.
 * Snaps the start date back to Sunday if it doesn't already fall on one.
 */
export function getWeekDates(startDate, weekNum) {
  if (!startDate) return null;
  const start = new Date(startDate + 'T00:00:00');
  const dow = start.getDay();
  start.setDate(start.getDate() - dow + (weekNum - 1) * 7);
  const out = {};
  ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].forEach((d, i) => {
    const dt = new Date(start);
    dt.setDate(dt.getDate() + i);
    out[d] = `${dt.getMonth() + 1}/${dt.getDate()}`;
  });
  out.weekend = `${out.fri}–${out.sat}`;
  return out;
}
