/**
 * Compares form section to MongoDB source section.
 * Returns the override object with only changed fields, or null if no changes.
 */
export function buildSectionDiff(
  formSection: Record<string, unknown> | undefined | null,
  mongoSection: unknown
): Record<string, unknown> | null {
  if (!formSection) return null;

  const source =
    mongoSection && typeof mongoSection === 'object' && !Array.isArray(mongoSection)
      ? (mongoSection as Record<string, unknown>)
      : {};

  const diff: Record<string, unknown> = {};
  let hasChanges = false;

  for (const [key, value] of Object.entries(formSection)) {
    if (JSON.stringify(value) !== JSON.stringify(source[key])) {
      diff[key] = value;
      hasChanges = true;
    }
  }

  return hasChanges ? diff : null;
}
