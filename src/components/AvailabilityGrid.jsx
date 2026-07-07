import { AlertCircle } from 'lucide-react';
import { DAYS, WEEKNIGHT_KEYS } from '../constants.js';
import {
  card,
  sectionLabel,
  thTight,
  tdTight,
  colors,
} from '../styles.js';

export default function AvailabilityGrid({
  ras,
  assignment,
  availWarnings,
  onToggle,
  onSetName,
  onSetOverride,
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
        <h2 style={sectionLabel}>01 — Availability</h2>
        <div style={{ fontSize: 12, color: colors.mute }}>
          Capacity: Sun/Mon/Tue/Wed × 2 · Thu × 3 · Wknd × 1
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}
        >
          <thead>
            <tr>
              <th style={{ ...thTight, width: 24 }}></th>
              <th style={{ ...thTight, textAlign: 'left', minWidth: 140 }}>
                Name
              </th>
              {DAYS.map((d) => (
                <th key={d.key} style={{ ...thTight, textAlign: 'center' }}>
                  {d.label}
                </th>
              ))}
              <th style={{ ...thTight, textAlign: 'left', minWidth: 100 }}>
                Assigned
              </th>
            </tr>
          </thead>
          <tbody>
            {ras.map((ra) => {
              const assigned = assignment?.[ra.id];
              return (
                <tr
                  key={ra.id}
                  style={{ borderBottom: `1px solid ${colors.borderSoft}` }}
                >
                  <td
                    style={{
                      ...tdTight,
                      color: colors.faint,
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: 11,
                    }}
                  >
                    {String(ra.id).padStart(2, '0')}
                  </td>
                  <td style={tdTight}>
                    <input
                      value={ra.name}
                      onChange={(e) => onSetName(ra.id, e.target.value)}
                      placeholder="Name"
                      style={{
                        border: '1px solid transparent',
                        background: colors.soft,
                        fontSize: 14,
                        padding: '6px 8px',
                        borderRadius: 3,
                        outline: 'none',
                        width: '100%',
                        fontFamily: 'inherit',
                      }}
                    />
                  </td>
                  {DAYS.map((d) => {
                    const isWeekend = d.key === 'weekend';
                    return (
                      <td
                        key={d.key}
                        style={{ ...tdTight, textAlign: 'center' }}
                      >
                        <button
                          onClick={() => onToggle(ra.id, d.key)}
                          aria-label={`${ra.name || 'RA ' + ra.id} ${d.full}`}
                          style={{
                            width: 28,
                            height: 24,
                            borderRadius: 3,
                            border: 'none',
                            cursor: 'pointer',
                            background: ra.avail[d.key]
                              ? isWeekend
                                ? colors.accentBlue
                                : colors.accent
                              : colors.border,
                            color: ra.avail[d.key] ? '#fff' : colors.faint,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {ra.avail[d.key] ? '✓' : ''}
                        </button>
                      </td>
                    );
                  })}
                  <td style={tdTight}>
                    <select
                      value={ra.override || (assigned || '')}
                      onChange={(e) => onSetOverride(ra.id, e.target.value)}
                      style={{
                        fontSize: 12,
                        border: `1px solid ${colors.border}`,
                        background: assigned ? colors.card : colors.dangerBg,
                        padding: '4px 6px',
                        borderRadius: 3,
                        color: assigned ? '#44403c' : colors.danger,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">— auto —</option>
                      {WEEKNIGHT_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {DAYS.find((d) => d.key === k).full}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!assignment && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: colors.dangerBg,
            border: `1px solid ${colors.dangerBorder}`,
            borderRadius: 3,
            fontSize: 13,
            color: colors.danger,
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            Can't cover all nights with current availability. Someone needs
            to open up more nights, or check if overrides are conflicting.
          </div>
        </div>
      )}

      {availWarnings.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: colors.warn }}>
          {availWarnings.map((w, i) => (
            <div key={i}>⚠ {w}</div>
          ))}
        </div>
      )}
    </div>
  );
}
