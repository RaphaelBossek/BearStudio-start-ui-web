import { DrawerContentSection } from '@/components/drawer-navigation';
import { EntryCard } from '../components/entry-card';
import { asArray, asRecord, asString, type ConsultationData } from '../types';

type FindingsSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const FindingsSection = ({
  consultation,
  isEditMode: _isEditMode,
}: FindingsSectionProps) => {
  const standard = asRecord(consultation.standard);
  const rows = asArray(standard.patientReport);
  return (
    <DrawerContentSection variant="card" title="Findings" description="Patient report entries.">
      <div className="space-y-4">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No finding entries.</p>
        ) : (
          rows.map((entry, index) => (
            <EntryCard
              key={`finding-${index}`}
              title={`Finding ${index + 1}`}
              subtitle={asString(entry.type)}
            >
              <p className="text-sm whitespace-pre-wrap">{asString(entry.documentation)}</p>
            </EntryCard>
          ))
        )}
      </div>
    </DrawerContentSection>
  );
};
