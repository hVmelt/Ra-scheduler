export const colors = {
  bg: '#f5f2ec',
  card: '#fff',
  border: '#e7e5e4',
  borderSoft: '#f5f5f4',
  ink: '#0c0a09',
  text: '#1c1917',
  mute: '#78716c',
  faint: '#a8a29e',
  soft: '#fafaf9',
  thu: '#fef3c7',
  thuTint: '#fffbeb',
  weekend: '#dbeafe',
  weekendTint: '#eff6ff',
  accent: '#1c1917',
  accentBlue: '#3b82f6',
  danger: '#991b1b',
  dangerBg: '#fef2f2',
  dangerBorder: '#fecaca',
  warn: '#92400e',
};

export const font =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const mono =
  '"SF Mono", ui-monospace, Menlo, Consolas, monospace';

export const card = {
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: 4,
  padding: 28,
  marginBottom: 24,
};

export const sectionLabel = {
  fontSize: 12,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: colors.ink,
  margin: 0,
  fontWeight: 700,
};

export const fieldLabel = {
  fontSize: 11,
  color: colors.mute,
  display: 'block',
  marginBottom: 6,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
  fontWeight: 600,
};

export const input = {
  border: '1px solid #d6d3d1',
  borderRadius: 3,
  padding: '8px 10px',
  fontSize: 15,
  outline: 'none',
  fontVariantNumeric: 'tabular-nums',
  fontFamily: 'inherit',
  width: 100,
};

export const btnSecondary = {
  background: colors.card,
  color: colors.text,
  border: '1px solid #d6d3d1',
  padding: '6px 12px',
  fontSize: 13,
  borderRadius: 3,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'inherit',
};

export const thStyle = {
  padding: '10px 12px',
  textAlign: 'left',
  fontSize: 10,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: colors.mute,
  fontWeight: 700,
  borderBottom: `2px solid ${colors.accent}`,
  background: colors.soft,
};

export const tdStyle = {
  padding: '10px 12px',
  verticalAlign: 'top',
  color: colors.text,
};

export const thTight = {
  padding: '8px 6px',
  fontSize: 10,
  letterSpacing: 1,
  textTransform: 'uppercase',
  color: colors.mute,
  fontWeight: 700,
  borderBottom: `1px solid ${colors.border}`,
};

export const tdTight = { padding: '6px 6px', verticalAlign: 'middle' };
