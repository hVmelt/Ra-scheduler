import { DAYS, WEEKNIGHT_KEYS } from '../constants.js';
import { getWeekDates } from './dates.js';

const ALL_DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'weekend'];

export function slug(s) {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildFilename(building, semesterName) {
  const parts = [slug(building), slug(semesterName)].filter(Boolean);
  parts.push('schedule');
  return `${parts.join('-')}.txt`;
}

export function exportText({
  schedule,
  ras,
  assignment,
  startDate,
  nameFor,
  building,
  semesterName,
}) {
  if (!schedule) return '';
  const lines = [];

  const header = [building, semesterName].filter(Boolean).join(' — ');
  lines.push(header ? `RA On-Duty Schedule · ${header}` : 'RA On-Duty Schedule');
  lines.push('');

  lines.push('Weeknight assignments (pair alternates weekly):');
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
    const range = dates ? ` (${dates.sun}–${dates.sat})` : '';
    const allBreak = ALL_DAY_KEYS.every((d) => wk.breakDays.has(d));

    if (allBreak) {
      const label = wk.breakLabels.join(', ') || 'Break';
      lines.push(`Week ${wk.week}${range} — BREAK: ${label}`);
      lines.push('');
      return;
    }

    lines.push(`Week ${wk.week}${range}`);
    ['sun', 'mon', 'tue', 'wed', 'thu'].forEach((d) => {
      const day = DAYS.find((x) => x.key === d);
      const dateStr = dates ? ` ${dates[d]}` : '';
      if (wk.breakDays.has(d)) {
        lines.push(`  ${day.label}${dateStr}: — break`);
      } else {
        const names = wk[d].map(nameFor).join(', ') || '—';
        lines.push(`  ${day.label}${dateStr}: ${names}`);
      }
    });
    const wknDate = dates ? ` ${dates.weekend}` : '';
    if (wk.breakDays.has('weekend')) {
      lines.push(`  Weekend${wknDate}: — break`);
    } else {
      lines.push(
        `  Weekend${wknDate}: ${wk.weekend.map(nameFor).join(', ') || '—'}`
      );
    }
    lines.push('');
  });

  return lines.join('\n');
}
