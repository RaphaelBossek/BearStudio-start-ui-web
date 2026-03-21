import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { EditableField } from '../components/editable-field';
import { asBoolText, asRecord, asString, type ConsultationData } from '../types';

type BasicsSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const BasicsSection = ({ consultation, isEditMode }: BasicsSectionProps) => {
  const base = asRecord(consultation.base);
  return (
    <DrawerContentSection
      variant="card"
      title="Consultation Basics"
      description="Communication and context metadata."
    >
      <DataList>
        <EditableField
          label="Communication Type"
          readOnlyValue={asString(base.communicationType)}
          name="base.communicationType"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Medical trained personnel"
          readOnlyValue={asBoolText(base.medicalTrainedPersonel)}
          name="base.medicalTrainedPersonel"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="First contact"
          readOnlyValue={asString(base.timeContact)}
          name="base.timeContact"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Specialization"
          readOnlyValue={asString(asRecord(consultation.job).title)}
          name="doctor.title"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Location"
          readOnlyValue={asString(asRecord(consultation.location).name)}
          name="doctor.name"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Customer"
          readOnlyValue={asString(asRecord(asRecord(consultation.location).customer).name)}
          name="doctor.customer).name"
          isEditMode={isEditMode}
        />
        <EditableField
          label="External Description"
          readOnlyValue={asString(asRecord(consultation.location).externalDescription)}
          name="doctor.externalDescription"
          isEditMode={isEditMode}
        />
      </DataList>
    </DrawerContentSection>
  );
};
