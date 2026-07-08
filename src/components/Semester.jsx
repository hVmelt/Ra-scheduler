import { Plus, X } from 'lucide-react';
import {
  card,
  sectionLabel,
  fieldLabel,
  input,
  colors,
} from '../styles.js';

export default function Semester({
  building,
  semesterName,
  weeks,
  startDate,
  breaks,
  onBuilding,
  onSemesterName,
  onWeeks,
  onStartDate,
  onBreaks,
}) {
  const addBreak = () =>
    onBreaks([
      ...breaks,
      { id: Date.now(), label: '', start: '', end: '' },
    ]);

  const removeBreak = (id) =>
    onBreaks(breaks.filter((b) => b.id !== id));

  const updateBreak = (id, field, value) =>
    onBreaks(
      breaks.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );

  return (
    <div style={card}>
      <h2 style={{ ...sectionLabel, marginBottom: 20 }}>02 — Semester</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <label style={fieldLabel}>Building</label>
          <input
            type="text"
            value={building}
            onChange={(e) => onBuilding(e.target.value)}
            placeholder="e.g. Towers North"
            style={{ ...input, width: '100%' }}
          />
        </div>
        <div>
          <label style={fieldLabel}>Semester</label>
          <input
            type="text"
            value={semesterName}
            onChange={(e) => onSemesterName(e.target.value)}
            placeholder="e.g. Fall 2026"
            style={{ ...input, width: '100%' }}
          />
        </div>
        <div>
          <label style={fieldLabel}>Weeks</label>
          <input
            type="number"
            min="1"
            max="52"
            value={weeks}
            onChange={(e) =>
              onWeeks(Math.max(1, parseInt(e.target.value) || 1))
            }
            style={{ ...input, width: '100%' }}
          />
        </div>
        <div>
          <label style={fieldLabel}>Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDate(e.target.value)}
            style={{ ...input, width: '100%' }}
          />
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${colors.border}`,
          paddingTop: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <label style={{ ...fieldLabel, marginBottom: 0 }}>
            Breaks
          </label>
          <button
            onClick={addBreak}
            style={{
              background: 'transparent',
              border: `1px solid ${colors.border}`,
              padding: '4px 10px',
              fontSize: 12,
              borderRadius: 3,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: colors.text,
            }}
          >
            <Plus size={12} /> Add
          </button>
        </div>

        {breaks.length === 0 && (
          <div style={{ fontSize: 12, color: colors.faint }}>
            No breaks. Add a date range for fall break, Thanksgiving, etc.
          </div>
        )}

        {breaks.map((b) => (
          <div
            key={b.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: 8,
              marginBottom: 8,
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={b.label}
              onChange={(e) => updateBreak(b.id, 'label', e.target.value)}
              placeholder="Label (e.g. Thanksgiving)"
              style={{ ...input, width: '100%', fontSize: 13 }}
            />
            <input
              type="date"
              value={b.start}
              onChange={(e) => updateBreak(b.id, 'start', e.target.value)}
              style={{ ...input, width: '100%', fontSize: 13 }}
            />
            <input
              type="date"
              value={b.end}
              onChange={(e) => updateBreak(b.id, 'end', e.target.value)}
              style={{ ...input, width: '100%', fontSize: 13 }}
            />
            <button
              onClick={() => removeBreak(b.id)}
              aria-label="Remove break"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: colors.mute,
                padding: 6,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
