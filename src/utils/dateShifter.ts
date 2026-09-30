import { ChartDataPoint } from '../types/insights';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/**
 * Parses an Instagram formatted date string like "29 Sept", "1 Oct", "12 Aug 2026", "2026-09-29"
 */
export function parseInstagramDate(dateStr: string, fallbackYear = 2026): Date {
  if (!dateStr || typeof dateStr !== 'string') return new Date();

  // Standard ISO date
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr.trim())) {
    const d = new Date(dateStr.trim());
    if (!isNaN(d.getTime())) return d;
  }

  // Parse "29 Sept" or "Sept 29" or "29 Sep 2026"
  const tokens = dateStr.trim().split(/[\s,.-]+/);
  let day: number | null = null;
  let month: number | null = null;
  let year = fallbackYear;

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (MONTH_MAP[lower] !== undefined) {
      month = MONTH_MAP[lower];
    } else if (/^\d{4}$/.test(token)) {
      year = parseInt(token, 10);
    } else if (/^\d{1,2}$/.test(token)) {
      day = parseInt(token, 10);
    }
  }

  if (day !== null && month !== null) {
    return new Date(year, month, day, 12, 0, 0);
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Formats a Date object to Instagram style "29 Sept" or "1 Oct"
 */
export function formatInstagramDate(date: Date): string {
  const day = date.getDate();
  const monthName = MONTH_NAMES[date.getMonth()];
  return `${day} ${monthName}`;
}

/**
 * Formats Date to HTML <input type="date"> "YYYY-MM-DD"
 */
export function formatToInputDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Shifts all graph dates and point labels back or forward by a specific number of days
 */
export function shiftTimelineByDays(
  dates: string[],
  points: ChartDataPoint[],
  daysToShift: number
): { dates: string[]; points: ChartDataPoint[] } {
  if (dates.length === 0) return { dates, points };

  // Parse all dates to preserve intervals
  const parsedDates = dates.map((d) => parseInstagramDate(d));
  const newParsedDates = parsedDates.map((d) => {
    const next = new Date(d);
    next.setDate(next.getDate() + daysToShift);
    return next;
  });

  const newDates = newParsedDates.map((d) => formatInstagramDate(d));

  // Map points proportionally or by label
  const newPoints = points.map((p, idx) => {
    const t = idx / (points.length - 1 || 1);
    // Interpolate date between start and end
    const startMs = newParsedDates[0].getTime();
    const endMs = newParsedDates[newParsedDates.length - 1].getTime();
    const ptMs = startMs + t * (endMs - startMs);
    const ptDate = new Date(ptMs);

    return {
      ...p,
      label: formatInstagramDate(ptDate),
    };
  });

  return { dates: newDates, points: newPoints };
}

/**
 * Shifts timeline to start at an explicit new start date
 */
export function shiftTimelineToStartDate(
  dates: string[],
  points: ChartDataPoint[],
  newStartDate: Date
): { dates: string[]; points: ChartDataPoint[] } {
  if (dates.length === 0) return { dates, points };

  const currentStart = parseInstagramDate(dates[0]);
  const diffMs = newStartDate.getTime() - currentStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return shiftTimelineByDays(dates, points, diffDays);
}

/**
 * Shifts the reel progress (magenta line) back to an earlier date / point index
 * Points after cutoffIndex will have hasData: false (future/unreached dates)
 */
export function shiftProgressToPointIndex(
  points: ChartDataPoint[],
  cutoffIndex: number
): ChartDataPoint[] {
  return points.map((p, idx) => ({
    ...p,
    hasData: idx <= cutoffIndex,
  }));
}
