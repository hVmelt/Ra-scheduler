import { DAYS, WEEKNIGHT_KEYS } from '../constants.js';
import { getWeekDates } from './dates.js';

export function exportText({ schedule, ras, assignment, startDate, nameFor }) {
  if (!schedule) return '';
  const lines = ['RA On-Duty Schedule', ''];

  lines.push('Weeknight assignments:');
  WEEKNIGHT_KEYS.forEach((k) => {
    const day = DAYS.find((d) => d.key === k);
    const names = ras
      .filter((r) => assignment[r.id] === k)
      .map((r) => nameFor(r.id))
      .join(', ');
    lines.push(`  ${day.full}: ${names}`);
  });
  lines.push('');

  schedule.weeks.forEach((wk) => {
    const dates = getWeekDates(startDate, wk.week);
    lines.push(
      `Week ${wk.week}${dates ? ` (${dates.sun}–${dates.sat})` : ''}`
    );
    ['sun', 'mon', 'tue', 'wed', 'thu'].forEach((d) => {
      const day = DAYS.find((x) => x.key === d);
      const dateStr = dates ? ` ${dates[d]}` : '';
      const names = wk[d].map(nameFor).join(', ') || '—';
      lines.push(`  ${day.label}${dateStr}: ${names}`);
    });
    const wknDate = dates ? ` ${dates.weekend}` : '';
    lines.push(
      `  Weekend${wknDate}: ${wk.weekend.map(nameFor).join(', ') || '—'}`
    );
    lines.push('');
  });

  return lines.join('\n');
}
