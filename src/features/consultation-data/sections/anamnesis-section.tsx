import { DrawerContentSection } from '@/components/drawer-navigation';
import { EntryCard } from '../components/entry-card';
import { asArray, asRecord, asString, type ConsultationData } from '../types';

type AnamnesisSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const AnamnesisSection = ({
  consultation,
  isEditMode: _isEditMode,
}: AnamnesisSectionProps) => {
  const standard = asRecord(consultation.standard);
  const rows = asArray(standard.anamnesis);
  return (
    <DrawerContentSection
      variant="card"
      title="Anamnesis"
      description="Medication anamnesis and anamnesis entries."
    >
      <div className="space-y-4">
        <EntryCard title="Medication Anamnesis">
          <p className="text-sm whitespace-pre-wrap">
            {asString(asRecord(standard.medicationAnamnesis).documentation)}
          </p>
        </EntryCard>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No anamnesis entries.</p>
        ) : (
          rows.map((entry, index) => (
            <EntryCard
              key={`anamnesis-${index}`}
              title={`Entry ${index + 1}`}
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
