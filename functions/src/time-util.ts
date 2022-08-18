export const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000;

export const TIMEZONE_OFFSET = -5 * 3600 * 1000; // in millis

export interface Timerange {
  start_time: number; // in millis
  end_time: number; // in millis
}

// function to get the enclosing interval of all many time ranges
export function get_timerange_enclosing_all_timeranges(timeranges: Timerange[]): Timerange {
  let start_time = Number.MAX_SAFE_INTEGER;
  let end_time = Number.MIN_SAFE_INTEGER;
  for (const timerange of timeranges) {
    if (timerange.start_time < start_time) {
      start_time = timerange.start_time;
    }
    if (timerange.end_time > end_time) {
      end_time = timerange.end_time;
    }
  }
  if (timeranges.length === 0) {
    throw new Error("timeranges is empty");
  }
  return {
    start_time,
    end_time,
  };
}

/**
 * max an integer k , such that d * k - T <= now
 * @param now 
 */
export function getYesterdayRangeInMillis(now: number) {

  const k = Math.floor((now + TIMEZONE_OFFSET) / ONE_DAY_IN_MILLIS);
  const end = ONE_DAY_IN_MILLIS * k - TIMEZONE_OFFSET;
  return {
    start: end - ONE_DAY_IN_MILLIS,
    end: end,
  }
}
