import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { EditableField } from '../components/editable-field';
import { asRecord, asString, type ConsultationData, formatDate, formatSecondsTime } from '../types';

type PatientDataSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const PatientDataSection = ({ consultation, isEditMode }: PatientDataSectionProps) => {
  const body = asRecord(consultation.body);
  return (
    <DrawerContentSection
      variant="card"
      title="Patient Data"
      description="Core patient and consultation identity fields."
    >
      <DataList>
        <EditableField
          label="Book Number"
          readOnlyValue={asString(consultation.bookNumber)}
          name="bookNumber"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Gender"
          readOnlyValue={asString(body.gender)}
          name="body.gender"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Birthday"
          readOnlyValue={formatDate(body.birthday)}
          name="body.birthday"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Age"
          readOnlyValue={asString(body.age)}
          name="body.age"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Consultation Day"
          readOnlyValue={formatDate(consultation.date)}
          name="date"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Start Time"
          readOnlyValue={formatSecondsTime(consultation.timeStart)}
          name="timeStart"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Treating Doctor"
          readOnlyValue={asString(asRecord(consultation.doctor).name)}
          name="doctor.name"
          isEditMode={isEditMode}
        />
      </DataList>
    </DrawerContentSection>
  );
};
