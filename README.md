# RA Duty Rotation

Availability-based scheduler for RA on-duty rotations. Handles a team of 11 covering Sun–Thu weeknights and one RA per weekend across a semester.

## Rules encoded

- **Sun / Mon / Tue / Wed**: 2 RAs each, fixed for the semester
- **Thursday**: 3 RAs rotating one per week
- **Weekend (Fri–Sat)**: 1 RA takes the full weekend
- Every non-Thu RA gets 1 weekend shift; Thu RAs split the rest evenly

## Run

```bash
npm install
npm run dev
```

## How it works

Everyone submits which nights they're free. A backtracking solver picks the most constrained RA first (fewest available nights) and assigns each person to exactly one weeknight where capacity allows. Manual overrides are respected — set a dropdown and the rest re-solves around it.

Weekend distribution runs after weeknight assignment: non-Thu RAs each get 1 shift, Thu RAs split the remainder. Only people who marked weekends available get picked.

## Structure

```
src/
├── App.jsx              # top-level state + layout
├── constants.js         # DAYS, WEEKNIGHT_KEYS, CAPS
├── styles.js            # shared inline style objects
├── scheduler/
│   ├── model.js         # default RA data
│   ├── solve.js         # weeknight backtracking solver
│   └── weekends.js      # weekend distribution
├── utils/
│   ├── dates.js         # week → date range helper
│   └── export.js        # plain-text export
└── components/
    ├── AvailabilityGrid.jsx
    ├── Timeframe.jsx
    ├── ScheduleTable.jsx
    └── StatsPanel.jsx
```

## Defaults

Set for a 17-week fall semester starting Aug 24. Adjust in the Timeframe section.
