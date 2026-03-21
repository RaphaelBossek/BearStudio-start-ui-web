import { useQuery } from '@tanstack/react-query';
import { DrawerContentSection } from '@/components/drawer-navigation';
import { orpc } from '@/lib/orpc/client';

const formatTimestamp = (value: unknown): string => {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatValue = (value: string | null): string => {
  if (value === null) return '(empty)';
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'object' && parsed !== null) {
      return JSON.stringify(parsed, null, 2);
    }
    return String(parsed);
  } catch {
    return value;
  }
};

export const AuditTrailSection = ({ consultationId }: { consultationId: string }) => {
  const auditQuery = useQuery(
    orpc.consultationAuditLog.list.queryOptions({
      input: { consultationId, limit: 50 },
      enabled: !!consultationId,
    })
  );

  const entries = auditQuery.data?.items ?? [];

  return (
    <DrawerContentSection
      variant="card"
      title="Change History"
      description="Audit trail of all annotation changes"
    >
      {auditQuery.isPending ? (
        <p className="text-sm text-muted-foreground">Loading audit trail...</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No changes recorded.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(
            (entry: {
              id: string;
              userName: string;
              action: string;
              fieldPath: string | null;
              oldValue: string | null;
              newValue: string | null;
              createdAt: string;
            }) => (
              <div key={entry.id} className="border-l-2 border-muted pl-3 text-sm">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium">{entry.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(entry.createdAt)}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  <span className="font-mono text-xs">{entry.action}</span>
                  {entry.fieldPath && (
                    <span className="ml-1 font-mono text-xs">on {entry.fieldPath}</span>
                  )}
                </div>
                {entry.oldValue !== null || entry.newValue !== null ? (
                  <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">From: </span>
                      <span className="break-all">{formatValue(entry.oldValue)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">To: </span>
                      <span className="break-all">{formatValue(entry.newValue)}</span>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          )}
        </div>
      )}
    </DrawerContentSection>
  );
};
