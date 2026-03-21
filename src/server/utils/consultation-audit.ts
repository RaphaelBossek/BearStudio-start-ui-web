type AuditEntry = {
  consultationId: string;
  userId: string;
  userName: string;
  action: string;
  fieldPath: string | null;
  oldValue: string | null;
  newValue: string | null;
};

const OVERRIDE_FIELDS = [
  'commentOverride',
  'requireReportingOverride',
  'bookNumberOverride',
  'dateOverride',
  'typeOverride',
  'noWarningsOverride',
  'archivedOverride',
  'bodyOverride',
  'baseOverride',
  'onboardingOverride',
  'incarcerationOverride',
  'treatmentOverride',
  'standardOverride',
  'referralOverride',
  'warningsOverride',
];

export function computeAnnotationDiff(
  existing: Record<string, unknown> | null,
  incoming: Record<string, unknown>,
  consultationId: string,
  userId: string,
  userName: string,
  action: string
): AuditEntry[] {
  const entries: AuditEntry[] = [];

  for (const field of OVERRIDE_FIELDS) {
    const oldVal = existing?.[field] ?? null;
    const newVal = incoming[field];

    // Skip fields not in incoming payload
    if (newVal === undefined) continue;

    const oldStr = oldVal === null || oldVal === undefined ? null : JSON.stringify(oldVal);
    const newStr = newVal === null || newVal === undefined ? null : JSON.stringify(newVal);

    if (oldStr !== newStr) {
      entries.push({
        consultationId,
        userId,
        userName,
        action,
        fieldPath: field.replace('Override', ''),
        oldValue: oldStr,
        newValue: newStr,
      });
    }
  }

  return entries;
}
