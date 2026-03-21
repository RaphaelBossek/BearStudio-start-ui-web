/**
 * Deep merges Neon annotation overrides onto MongoDB source data.
 * Neon values take precedence. NULL annotation values fall back to MongoDB.
 */
export function mergeConsultationData(
  mongoData: Record<string, unknown>,
  annotation: Record<string, unknown> | null
): Record<string, unknown> {
  if (!annotation) return mongoData;

  const result = { ...mongoData };

  // Scalar overrides
  const scalarMap: Record<string, string> = {
    bookNumberOverride: 'bookNumber',
    dateOverride: 'date',
    typeOverride: 'type',
    commentOverride: 'comment',
    requireReportingOverride: 'requireReporting',
    noWarningsOverride: 'noWarnings',
    archivedOverride: 'archived',
  };

  for (const [annotationKey, mongoKey] of Object.entries(scalarMap)) {
    const val = annotation[annotationKey];
    if (val !== null && val !== undefined) {
      result[mongoKey] = val;
    }
  }

  // Section-level JSONB overrides (deep merge within section)
  const sectionMap: Record<string, string> = {
    bodyOverride: 'body',
    baseOverride: 'base',
    onboardingOverride: 'onboarding',
    incarcerationOverride: 'incarceration',
    treatmentOverride: 'treatment',
    standardOverride: 'standard',
    referralOverride: 'referral',
    warningsOverride: 'warnings',
  };

  for (const [annotationKey, mongoKey] of Object.entries(sectionMap)) {
    const override = annotation[annotationKey];
    if (override !== null && override !== undefined && typeof override === 'object') {
      const source =
        result[mongoKey] && typeof result[mongoKey] === 'object'
          ? (result[mongoKey] as Record<string, unknown>)
          : {};
      result[mongoKey] = { ...source, ...(override as Record<string, unknown>) };
    }
  }

  // Inject annotation metadata
  result._annotationId = annotation.id;
  result._hasAnnotation = true;

  return result;
}
