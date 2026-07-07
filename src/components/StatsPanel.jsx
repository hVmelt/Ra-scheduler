import { colors, mono } from '../styles.js';

export default function StatsPanel({ ras, stats, nameFor }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: colors.mute,
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        Shift totals
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 8,
          fontSize: 13,
        }}
      >
        {ras.map((ra) => {
          const s = stats[ra.id];
          return (
            <div
              key={ra.id}
              style={{
                padding: '8px 10px',
                background: colors.soft,
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontWeight: 500 }}>{nameFor(ra.id)}</span>
              <span
                style={{
                  color: colors.mute,
                  fontFamily: mono,
                  fontSize: 11,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {s.wk}wn · {s.we}we ·{' '}
                <strong style={{ color: colors.ink }}>{s.wk + s.we}</strong>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
