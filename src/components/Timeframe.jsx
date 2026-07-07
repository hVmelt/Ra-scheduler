import { card, sectionLabel, fieldLabel, input } from '../styles.js';

export default function Timeframe({ weeks, startDate, onWeeks, onStartDate }) {
  return (
    <div style={card}>
      <h2 style={{ ...sectionLabel, marginBottom: 20 }}>02 — Timeframe</h2>
      <div
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <label style={fieldLabel}>Weeks</label>
          <input
            type="number"
            min="1"
            max="52"
            value={weeks}
            onChange={(e) => onWeeks(Math.max(1, parseInt(e.target.value) || 1))}
            style={input}
          />
        </div>
        <div>
          <label style={fieldLabel}>Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDate(e.target.value)}
            style={{ ...input, width: 160 }}
          />
        </div>
      </div>
    </div>
  );
}
