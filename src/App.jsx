import { useState, useMemo } from 'react';
import { Info } from 'lucide-react';

import { WEEKNIGHT_KEYS } from './constants.js';
import { makeDefaultRAs } from './scheduler/model.js';
import { solve } from './scheduler/solve.js';
import { distributeWeekends } from './scheduler/weekends.js';
import { exportText, buildFilename } from './utils/export.js';
import { computeBreakDays } from './utils/dates.js';
import { colors, font } from './styles.js';

import AvailabilityGrid from './components/AvailabilityGrid.jsx';
import Semester from './components/Semester.jsx';
import ScheduleTable from './components/ScheduleTable.jsx';
import StatsPanel from './components/StatsPanel.jsx';

export default function App() {
  const [ras, setRAs] = useState(makeDefaultRAs);
  const [weeks, setWeeks] = useState(17);
  const [startDate, setStartDate] = useState('2026-08-24');
  const [building, setBuilding] = useState('');
  const [semesterName, setSemesterName] = useState('');
  const [breaks, setBreaks] = useState([]);
  const [copied, setCopied] = useState(false);

  const assignment = useMemo(() => solve(ras), [ras]);

  const breakDaysMap = useMemo(
    () => computeBreakDays(startDate, breaks, weeks),
    [startDate, breaks, weeks]
  );

  const availWarnings = useMemo(() => {
    const warnings = [];
    ras.forEach((r) => {
      const count = WEEKNIGHT_KEYS.filter((k) => r.avail[k]).length;
      if (count === 0 && r.name.trim()) {
        warnings.push(`${r.name.trim()} has no weeknight availability`);
      }
    });
    return warnings;
  }, [ras]);

  const schedule = useMemo(() => {
    if (!assignment) return null;
    const groups = { sun: [], mon: [], tue: [], wed: [], thu: [] };
    ras.forEach((r) => groups[assignment[r.id]].push(r.id));

    const isBreak = (w, d) => breakDaysMap.get(w)?.days.has(d) ?? false;

    // Count active weekends to size the distribution
    let activeWeekends = 0;
    for (let w = 0; w < weeks; w++) {
      if (!isBreak(w, 'weekend')) activeWeekends += 1;
    }

    const { weekends: weekendResult, completed } = distributeWeekends(
      ras,
      assignment,
      Math.max(0, activeWeekends)
    );

    // Per-day alternation counters — only advance on non-break days
    const counters = { sun: 0, mon: 0, tue: 0, wed: 0, thu: 0 };
    let weekendIdx = 0;

    const weeksOut = [];
    for (let w = 0; w < weeks; w++) {
      const entry = breakDaysMap.get(w);
      const breakDays = entry?.days ?? new Set();
      const breakLabels = entry?.labels ?? new Set();

      const wk = {
        week: w + 1,
        breakDays,
        breakLabels: [...breakLabels],
        sun: [],
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        weekend: [],
      };

      ['sun', 'mon', 'tue', 'wed', 'thu'].forEach((d) => {
        if (breakDays.has(d)) return;
        const pool = groups[d];
        if (pool.length === 0) return;
        wk[d] = [pool[counters[d] % pool.length]];
        counters[d] += 1;
      });

      if (!breakDays.has('weekend') && weekendResult[weekendIdx] != null) {
        wk.weekend = [weekendResult[weekendIdx]];
        weekendIdx += 1;
      }

      weeksOut.push(wk);
    }

    const stats = {};
    ras.forEach((r) => (stats[r.id] = { wk: 0, we: completed[r.id] || 0 }));
    weeksOut.forEach((wk) => {
      ['sun', 'mon', 'tue', 'wed', 'thu'].forEach((d) =>
        wk[d].forEach((id) => (stats[id].wk += 1))
      );
    });

    return { weeks: weeksOut, stats };
  }, [ras, weeks, assignment, breakDaysMap]);

  const nameFor = (id) => {
    const r = ras.find((x) => x.id === id);
    return r?.name?.trim() || `RA ${id}`;
  };

  const handleToggle = (id, day) => {
    setRAs(
      ras.map((r) =>
        r.id === id ? { ...r, avail: { ...r.avail, [day]: !r.avail[day] } } : r
      )
    );
  };

  const handleSetName = (id, name) => {
    setRAs(ras.map((r) => (r.id === id ? { ...r, name } : r)));
  };

  const handleSetOverride = (id, val) => {
    setRAs(ras.map((r) => (r.id === id ? { ...r, override: val || null } : r)));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        exportText({
          schedule,
          ras,
          assignment,
          startDate,
          nameFor,
          building,
          semesterName,
        })
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  const handleDownload = () => {
    const text = exportText({
      schedule,
      ras,
      assignment,
      startDate,
      nameFor,
      building,
      semesterName,
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = buildFilename(building, semesterName);
    a.click();
    URL.revokeObjectURL(url);
  };

  const headerLabel =
    building || semesterName
      ? [building, semesterName].filter(Boolean).join(' · ').toUpperCase()
      : 'Residential Life';

  return (
    <div
      style={{
        fontFamily: font,
        background: colors.bg,
        minHeight: '100vh',
        color: colors.text,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: colors.mute,
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {headerLabel}
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: -1.2,
              lineHeight: 1,
              margin: 0,
              color: colors.ink,
            }}
          >
            Duty Rotation
          </h1>
          <p
            style={{
              color: '#57534e',
              marginTop: 12,
              maxWidth: 640,
              lineHeight: 1.5,
              fontSize: 15,
            }}
          >
            Everyone checks off which nights they're available. Each of the
            11 RAs is assigned to one weeknight — Sun–Wed have 2 RAs paired
            (alternating weekly), Thu has 3 in rotation, and one RA covers
            each weekend.
          </p>
        </div>

        <AvailabilityGrid
          ras={ras}
          assignment={assignment}
          availWarnings={availWarnings}
          onToggle={handleToggle}
          onSetName={handleSetName}
          onSetOverride={handleSetOverride}
        />

        <Semester
          building={building}
          semesterName={semesterName}
          weeks={weeks}
          startDate={startDate}
          breaks={breaks}
          onBuilding={setBuilding}
          onSemesterName={setSemesterName}
          onWeeks={setWeeks}
          onStartDate={setStartDate}
          onBreaks={setBreaks}
        />

        {schedule && (
          <>
            <ScheduleTable
              schedule={schedule}
              startDate={startDate}
              nameFor={nameFor}
              onCopy={handleCopy}
              onDownload={handleDownload}
              copied={copied}
            />
            <div style={{ marginTop: -8 }}>
              <StatsPanel
                ras={ras}
                stats={schedule.stats}
                nameFor={nameFor}
              />
            </div>
          </>
        )}

        <div
          style={{
            fontSize: 12,
            color: colors.faint,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6,
            marginTop: 32,
            lineHeight: 1.5,
          }}
        >
          <Info size={12} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            Break days are skipped individually — each day's pair alternation
            picks up where it left off, so shifts stay balanced across the
            semester.
          </div>
        </div>
      </div>
    </div>
  );
}
