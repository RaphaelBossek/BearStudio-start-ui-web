import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { EditableField } from '../components/editable-field';
import { asBoolText, asRecord, asString, type ConsultationData } from '../types';

type IncarcerationSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const IncarcerationSection = ({ consultation, isEditMode }: IncarcerationSectionProps) => {
  const incarceration = asRecord(consultation.incarceration);
  return (
    <DrawerContentSection
      variant="card"
      title="Incarceration Assessment"
      description="Custody-specific assessment fields."
    >
      <DataList>
        <EditableField
          label="Type"
          readOnlyValue={asString(incarceration.type)}
          name="incarceration.type"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Incarceration capability"
          readOnlyValue={asBoolText(incarceration.incarcerationCapability)}
          name="incarceration.incarcerationCapability"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Checkup requirement"
          readOnlyValue={asString(incarceration.checkupRequirement)}
          name="incarceration.checkupRequirement"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Intoxication"
          readOnlyValue={asString(incarceration.intoxication)}
          name="incarceration.intoxication"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Require video"
          readOnlyValue={asBoolText(incarceration.requireVideo)}
          name="incarceration.requireVideo"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Consumed alcohol"
          readOnlyValue={asBoolText(incarceration.consumedAlcohol)}
          name="incarceration.consumedAlcohol"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Consumed medication"
          readOnlyValue={asBoolText(incarceration.consumedMedication)}
          name="incarceration.consumedMedication"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Documentation"
          readOnlyValue={asString(incarceration.documentation)}
          name="incarceration.documentation"
          isEditMode={isEditMode}
        />
      </DataList>
    </DrawerContentSection>
  );
};
