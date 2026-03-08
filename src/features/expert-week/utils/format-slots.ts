/**
 * Converts an array of hours (1-24) into a human readable time range string.
 * Example: [8, 9, 10, 13, 14, 18, 19, 20, 21] -> "8-11, 13-15, 18-22"
 * Note: An hour typically covers the interval from X to X+1, hence 8,9,10 becomes 8-11.
 * @param slots Array of integer hours
 * @returns Formatted time range string or 'N/A'
 */
export function formatSlotRanges(slots: number[] | null | undefined): string {
  if (!slots || slots.length === 0) {
    return 'N/A';
  }

  // Sort and remove duplicates just in case
  const sortedSlots = Array.from(new Set(slots)).sort((a, b) => a - b);

  const ranges: string[] = [];
  const startSlot = sortedSlots[0];

  if (startSlot === undefined) return 'N/A';

  let start = startSlot;
  let current = startSlot;

  for (let i = 1; i < sortedSlots.length; i++) {
    const next = sortedSlots[i];
    if (next === undefined) continue;

    if (next === current + 1) {
      current = next;
    } else {
      // The interval covers the slot hour up to the end of the slot hour (+1)
      ranges.push(`${start}-${current + 1}`);
      start = next;
      current = next;
    }
  }

  // push final range
  ranges.push(`${start}-${current + 1}`);

  return ranges.join(', ');
}
