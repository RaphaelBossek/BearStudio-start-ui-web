import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { Separator } from '@/components/ui/separator';
import { EditableField } from '../components/editable-field';
import { EntryCard } from '../components/entry-card';
import { asArray, asRecord, asString, type ConsultationData } from '../types';

type DiagnosisSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const DiagnosisSection = ({ consultation, isEditMode }: DiagnosisSectionProps) => {
  const standard = asRecord(consultation.standard);
  const rows = asArray(standard.diagnosis);
  return (
    <DrawerContentSection
      variant="card"
      title="Diagnosis"
      description="ICD-10 diagnosis entries and referral metadata."
    >
      <div className="space-y-4">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No diagnosis entries.</p>
        ) : (
          rows.map((entry, index) => {
            const icd10 = asRecord(entry.icd10);
            return (
              <EntryCard
                key={`diagnosis-${index}`}
                title={`${asString(icd10.code)} ${asString(icd10.title)}`}
                subtitle={`Localization: ${asString(entry.localization)} · Level: ${asString(entry.level)}`}
              >
                <p className="text-sm whitespace-pre-wrap">{asString(entry.comment)}</p>
              </EntryCard>
            );
          })
        )}
        <Separator />
        <DataList>
          <EditableField
            label="Procedure Report"
            readOnlyValue={asString(standard.procedureReport)}
            name="standard.procedureReport"
            isEditMode={isEditMode}
          />
          <EditableField
            label="Referral To"
            readOnlyValue={asString(standard.referralTo)}
            name="standard.referralTo"
            isEditMode={isEditMode}
          />
        </DataList>
      </div>
    </DrawerContentSection>
  );
};
