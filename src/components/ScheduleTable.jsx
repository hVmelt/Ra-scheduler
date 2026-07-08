import { Copy, Download } from 'lucide-react';
import { getWeekDates } from '../utils/dates.js';
import {
  card,
  sectionLabel,
  thStyle,
  tdStyle,
  btnSecondary,
  colors,
  mono,
} from '../styles.js';

const ALL_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'weekend'];

function BreakCell({ background }) {
  return (
    <td
      style={{
        ...tdStyle,
        background,
        color: colors.faint,
        fontStyle: 'italic',
        fontSize: 11,
      }}
    >
      —
    </td>
  );
}

export default function ScheduleTable({
  schedule,
  startDate,
  nameFor,
  onCopy,
  onDownload,
  copied,
}) {
  return (
    <div style={card}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h2 style={sectionLabel}>03 — Schedule</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCopy} style={btnSecondary}>
            <Copy size={13} /> {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={onDownload} style={btnSecondary}>
            <Download size={13} /> Download
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: mono,
            fontSize: 12,
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Wk</th>
              <th style={thStyle}>Sun</th>
              <th style={thStyle}>Mon</th>
              <th style={thStyle}>Tue</th>
              <th style={thStyle}>Wed</th>
              <th style={{ ...thStyle, background: colors.thu }}>Thu</th>
              <th style={{ ...thStyle, background: colors.weekend }}>
                Weekend
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.weeks.map((wk) => {
              const dates = getWeekDates(startDate, wk.week);
              const allBreak = ALL_DAYS.every((d) => wk.breakDays.has(d));

              if (allBreak) {
                const label = wk.breakLabels.join(', ') || 'Break';
                return (
                  <tr
                    key={wk.week}
                    style={{
                      borderBottom: `1px solid ${colors.borderSoft}`,
                      background: colors.soft,
                    }}
                  >
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: 700,
                        color: colors.faint,
                      }}
                    >
                      {wk.week}
                      {dates && (
                        <div
                          style={{
                            fontSize: 10,
                            color: colors.faint,
                            fontWeight: 400,
                          }}
                        >
                          {dates.sun}
                        </div>
                      )}
                    </td>
                    <td
                      colSpan={6}
                      style={{
                        ...tdStyle,
                        fontStyle: 'italic',
                        color: colors.mute,
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                        fontSize: 11,
                      }}
                    >
                      Break — {label}
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={wk.week}
                  style={{ borderBottom: `1px solid ${colors.borderSoft}` }}
                >
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: 700,
                      color: colors.mute,
                    }}
                  >
                    {wk.week}
                    {dates && (
                      <div
                        style={{
                          fontSize: 10,
                          color: colors.faint,
                          fontWeight: 400,
                        }}
                      >
                        {dates.sun}
                      </div>
                    )}
                  </td>
                  {['sun', 'mon', 'tue', 'wed'].map((d) =>
                    wk.breakDays.has(d) ? (
                      <BreakCell key={d} background={colors.soft} />
                    ) : (
                      <td key={d} style={tdStyle}>
                        {wk[d].map(nameFor).join(', ')}
                      </td>
                    )
                  )}
                  {wk.breakDays.has('thu') ? (
                    <BreakCell background={colors.soft} />
                  ) : (
                    <td style={{ ...tdStyle, background: colors.thuTint }}>
                      {wk.thu.map(nameFor).join(', ')}
                    </td>
                  )}
                  {wk.breakDays.has('weekend') ? (
                    <BreakCell background={colors.soft} />
                  ) : (
                    <td style={{ ...tdStyle, background: colors.weekendTint }}>
                      {wk.weekend.map(nameFor).join(', ') || (
                        <span style={{ color: '#dc2626' }}>—</span>
                      )}
                      {dates && wk.weekend.length > 0 && (
                        <div
                          style={{
                            fontSize: 10,
                            color: colors.faint,
                            fontWeight: 400,
                            marginTop: 2,
                          }}
                        >
                          {dates.weekend}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
