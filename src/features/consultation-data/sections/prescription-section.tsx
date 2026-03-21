import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { EditableField } from '../components/editable-field';
import { EntryCard } from '../components/entry-card';
import {
  asArray,
  asBoolText,
  asRecord,
  asString,
  type ConsultationData,
  formatDate,
} from '../types';

type PrescriptionSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const PrescriptionSection = ({ consultation, isEditMode }: PrescriptionSectionProps) => {
  const standard = asRecord(consultation.standard);
  const rows = asArray(standard.prescription);
  return (
    <DrawerContentSection
      variant="card"
      title="Prescription"
      description="Medication prescriptions and dosage schedules."
    >
      <div className="space-y-4">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No prescription entries.</p>
        ) : (
          rows.map((entry, index) => (
            <EntryCard
              key={`prescription-${index}`}
              title={`${asString(entry.type)} · ${asString(entry.packaging)}`}
              subtitle={`Unit: ${asString(entry.unit)} · Dosage amount: ${asString(entry.dosageAmount)}`}
            >
              <DataList>
                <EditableField
                  label="Schedule"
                  readOnlyValue={`M:${asString(entry.morning)} · L:${asString(entry.lunch)} · E:${asString(entry.evening)} · N:${asString(entry.night)}`}
                  name={`standard.prescription.${index}.morning`}
                  isEditMode={false}
                />
                <EditableField
                  label="Start"
                  readOnlyValue={formatDate(entry.start)}
                  name="entry.start"
                  isEditMode={isEditMode}
                  type="text"
                />
                <EditableField
                  label="End"
                  readOnlyValue={formatDate(entry.end)}
                  name="entry.end"
                  isEditMode={isEditMode}
                  type="text"
                />
                {entry.dosageRequirement !== undefined && entry.dosageRequirement !== null && (
                  <EditableField
                    label="Dosage requirement"
                    readOnlyValue={asString(entry.dosageRequirement)}
                    name="entry.dosageRequirement"
                    isEditMode={isEditMode}
                  />
                )}
                {entry.comment !== undefined && entry.comment !== null && (
                  <EditableField
                    label="Comment"
                    readOnlyValue={asString(entry.comment)}
                    name="entry.comment"
                    isEditMode={isEditMode}
                  />
                )}
                <EditableField
                  label="Initial dosage given"
                  readOnlyValue={asBoolText(entry.initialDosageGiven)}
                  name="entry.initialDosageGiven"
                  isEditMode={isEditMode}
                  type="boolean"
                />
                <EditableField
                  label="Allow substitute"
                  readOnlyValue={asBoolText(entry.allowSubstitute)}
                  name="entry.allowSubstitute"
                  isEditMode={isEditMode}
                  type="boolean"
                />
              </DataList>
            </EntryCard>
          ))
        )}
      </div>
    </DrawerContentSection>
  );
};
