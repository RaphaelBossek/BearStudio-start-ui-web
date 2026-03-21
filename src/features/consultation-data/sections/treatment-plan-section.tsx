import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { Separator } from '@/components/ui/separator';
import { EditableField } from '../components/editable-field';
import { EntryCard } from '../components/entry-card';
import { asArray, asRecord, asString, type ConsultationData, formatDate } from '../types';

type TreatmentPlanSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const TreatmentPlanSection = ({ consultation, isEditMode }: TreatmentPlanSectionProps) => {
  const treatment = asRecord(consultation.treatment);
  const historyRows = asArray(treatment.history);
  return (
    <DrawerContentSection
      variant="card"
      title="Treatment Plan"
      description="Psychotherapy consultation treatment fields."
    >
      <DataList>
        <EditableField
          label="Diagnosis Comment"
          readOnlyValue={asString(asRecord(treatment.diagnosis).comment)}
          name="doctor.comment"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Anamnesis Social"
          readOnlyValue={asString(treatment.anamnesisSocial)}
          name="treatment.anamnesisSocial"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Anamnesis Education/Job"
          readOnlyValue={asString(treatment.anamnesisEducationJob)}
          name="treatment.anamnesisEducationJob"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Anamnesis Family"
          readOnlyValue={asString(treatment.anamnesisFamily)}
          name="treatment.anamnesisFamily"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Anamnesis Self"
          readOnlyValue={asString(treatment.anamnesisSelf)}
          name="treatment.anamnesisSelf"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Specific disease development"
          readOnlyValue={asString(treatment.specificDiseaseDevelopment)}
          name="treatment.specificDiseaseDevelopment"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Anamnesis vegetative"
          readOnlyValue={asString(treatment.anamnesisVegetative)}
          name="treatment.anamnesisVegetative"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Anamnesis substance"
          readOnlyValue={asString(treatment.anamnesisSubstance)}
          name="treatment.anamnesisSubstance"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Anamnesis delinquency"
          readOnlyValue={asString(treatment.anamnesisDelinquency)}
          name="treatment.anamnesisDelinquency"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Medication"
          readOnlyValue={asString(treatment.medication)}
          name="treatment.medication"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Psych diagnostic report"
          readOnlyValue={asString(treatment.reportPsychDiagnostic)}
          name="treatment.reportPsychDiagnostic"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Psychopathological admission"
          readOnlyValue={asString(treatment.reportsPsychopathologicalAdmission)}
          name="treatment.reportsPsychopathologicalAdmission"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Telepsychotherapy admission"
          readOnlyValue={asString(treatment.medicalAdmissiontelepsychotherapy)}
          name="treatment.medicalAdmissiontelepsychotherapy"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Further treatment recommendations"
          readOnlyValue={asString(treatment.furtherTreatmentRecommendations)}
          name="treatment.furtherTreatmentRecommendations"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Further goals"
          readOnlyValue={asString(treatment.furtherGoals)}
          name="treatment.furtherGoals"
          isEditMode={isEditMode}
        />
      </DataList>
      <Separator className="my-4" />
      <div className="space-y-2">
        <p className="text-sm font-medium">Treatment history</p>
        {historyRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history entries.</p>
        ) : (
          historyRows.map((entry, index) => (
            <EntryCard key={`treatment-history-${index}`} title={formatDate(entry.date)}>
              <p className="text-sm whitespace-pre-wrap">{asString(entry.content)}</p>
            </EntryCard>
          ))
        )}
      </div>
    </DrawerContentSection>
  );
};
