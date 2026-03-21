import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { EditableField } from '../components/editable-field';
import { asBoolText, asRecord, asString, type ConsultationData, formatDate } from '../types';

type FurtherTreatmentSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const FurtherTreatmentSection = ({
  consultation,
  isEditMode,
}: FurtherTreatmentSectionProps) => {
  const base = asRecord(consultation.base);
  const referral = asRecord(consultation.referral);
  return (
    <DrawerContentSection
      variant="card"
      title="Further Treatment"
      description="Follow-up planning and psychotherapy referral."
    >
      <DataList>
        <EditableField
          label="Further treatment"
          readOnlyValue={asString(base.furtherTreatment)}
          name="base.furtherTreatment"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Follow-up date"
          readOnlyValue={formatDate(base.dateFurtherTreatment)}
          name="base.dateFurtherTreatment"
          isEditMode={isEditMode}
          type="text"
        />
        <EditableField
          label="Psychotherapy recommended"
          readOnlyValue={asBoolText(referral.referPsychotherapy)}
          name="referral.referPsychotherapy"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Reasoning"
          readOnlyValue={asString(asRecord(referral.psychoTherapy).comment)}
          name="doctor.comment"
          isEditMode={isEditMode}
        />
      </DataList>
    </DrawerContentSection>
  );
};
