import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { Separator } from '@/components/ui/separator';
import { EditableField } from '../components/editable-field';
import { asBoolText, asRecord, asString, type ConsultationData } from '../types';

type OnboardingSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const OnboardingSection = ({ consultation, isEditMode }: OnboardingSectionProps) => {
  const body = asRecord(consultation.body);
  const onboarding = asRecord(consultation.onboarding);
  return (
    <DrawerContentSection
      variant="card"
      title="Onboarding Examination"
      description="Health and suitability fields from onboarding consultations."
    >
      <DataList>
        <EditableField
          label="General state"
          readOnlyValue={asString(onboarding.generalState)}
          name="onboarding.generalState"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Weight state"
          readOnlyValue={asString(onboarding.weightState)}
          name="onboarding.weightState"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Incarceration suitability"
          readOnlyValue={asBoolText(onboarding.incarcerationSuitability)}
          name="onboarding.incarcerationSuitability"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Work suitability"
          readOnlyValue={asString(onboarding.workSuitability)}
          name="onboarding.workSuitability"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Sport suitability"
          readOnlyValue={asString(onboarding.sportSuitability)}
          name="onboarding.sportSuitability"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Suicidal"
          readOnlyValue={asBoolText(onboarding.suicidal)}
          name="onboarding.suicidal"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Dangerous"
          readOnlyValue={asBoolText(onboarding.dangerous)}
          name="onboarding.dangerous"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Body height"
          readOnlyValue={asString(body.bodyHeight)}
          name="body.bodyHeight"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Body weight"
          readOnlyValue={asString(body.bodyWeight)}
          name="body.bodyWeight"
          isEditMode={isEditMode}
        />
        <EditableField
          label="RR"
          readOnlyValue={asString(body.rr)}
          name="body.rr"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Pulse"
          readOnlyValue={asString(body.pulse)}
          name="body.pulse"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Hepatitis"
          readOnlyValue={asString(onboarding.hepatitis)}
          name="onboarding.hepatitis"
          isEditMode={isEditMode}
        />
        <EditableField
          label="STD"
          readOnlyValue={asString(onboarding.std)}
          name="onboarding.std"
          isEditMode={isEditMode}
        />
        <EditableField
          label="HIV"
          readOnlyValue={asString(onboarding.hiv)}
          name="onboarding.hiv"
          isEditMode={isEditMode}
        />
      </DataList>

      <Separator className="my-4" />
      <p className="mb-2 text-sm font-semibold">Previous / Pre-existing Conditions</p>
      <DataList>
        <EditableField
          label="Previous physician"
          readOnlyValue={asString(onboarding.previousPhysician)}
          name="onboarding.previousPhysician"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Pre-existing state"
          readOnlyValue={asString(onboarding.preexistingState)}
          name="onboarding.preexistingState"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Pre-existing condition"
          readOnlyValue={asString(onboarding.preexistingCondition)}
          name="onboarding.preexistingCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Allergies"
          readOnlyValue={asBoolText(onboarding.allergies)}
          name="onboarding.allergies"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Current state"
          readOnlyValue={asString(onboarding.currentState)}
          name="onboarding.currentState"
          isEditMode={isEditMode}
        />
        <EditableField
          label="State info"
          readOnlyValue={asString(onboarding.stateInfo)}
          name="onboarding.stateInfo"
          isEditMode={isEditMode}
        />
      </DataList>

      <Separator className="my-4" />
      <p className="mb-2 text-sm font-semibold">Infectious Diseases</p>
      <DataList>
        <EditableField
          label="Lung tuberculosis"
          readOnlyValue={asString(onboarding.lungTuberculosis)}
          name="onboarding.lungTuberculosis"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Transmittal info"
          readOnlyValue={asString(onboarding.transmittalInfo)}
          name="onboarding.transmittalInfo"
          isEditMode={isEditMode}
        />
      </DataList>

      <Separator className="my-4" />
      <p className="mb-2 text-sm font-semibold">Physical Examination</p>
      <DataList>
        <EditableField
          label="Skin"
          readOnlyValue={asString(onboarding.skinCondition)}
          name="onboarding.skinCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Senses"
          readOnlyValue={asString(onboarding.senseCondition)}
          name="onboarding.senseCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Eyes"
          readOnlyValue={asString(onboarding.eyeCondition)}
          name="onboarding.eyeCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Ears"
          readOnlyValue={asString(onboarding.earCondition)}
          name="onboarding.earCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Heart"
          readOnlyValue={asString(onboarding.heartCondition)}
          name="onboarding.heartCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Lungs"
          readOnlyValue={asString(onboarding.lungCondition)}
          name="onboarding.lungCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Abdomen"
          readOnlyValue={asString(onboarding.abdomenCondition)}
          name="onboarding.abdomenCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Kidneys"
          readOnlyValue={asString(onboarding.kidneyCondition)}
          name="onboarding.kidneyCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Extremities"
          readOnlyValue={asString(onboarding.extremitiesCondition)}
          name="onboarding.extremitiesCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Central nervous system"
          readOnlyValue={asString(onboarding.centralNerveSystemCondition)}
          name="onboarding.centralNerveSystemCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Psychological"
          readOnlyValue={asString(onboarding.psychologicalCondition)}
          name="onboarding.psychologicalCondition"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Other conditions"
          readOnlyValue={asString(onboarding.otherConditions)}
          name="onboarding.otherConditions"
          isEditMode={isEditMode}
        />
      </DataList>

      <Separator className="my-4" />
      <p className="mb-2 text-sm font-semibold">Substance Use</p>
      <DataList>
        <EditableField
          label="Alcohol"
          readOnlyValue={asString(onboarding.alcoholUsage)}
          name="onboarding.alcoholUsage"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Tobacco"
          readOnlyValue={asString(onboarding.tabaccoUsage)}
          name="onboarding.tabaccoUsage"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Drugs"
          readOnlyValue={asString(onboarding.drugUsage)}
          name="onboarding.drugUsage"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Additional prescription"
          readOnlyValue={asBoolText(onboarding.additionalPrescription)}
          name="onboarding.additionalPrescription"
          isEditMode={isEditMode}
          type="boolean"
        />
      </DataList>

      <Separator className="my-4" />
      <p className="mb-2 text-sm font-semibold">Suitability</p>
      <DataList>
        <EditableField
          label="Single room suitability"
          readOnlyValue={asBoolText(onboarding.singleRoomSuitability)}
          name="onboarding.singleRoomSuitability"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Outdoor work suitability"
          readOnlyValue={asBoolText(onboarding.outDoorWorkSuitability)}
          name="onboarding.outDoorWorkSuitability"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Requires treatment"
          readOnlyValue={asBoolText(onboarding.requireTreatment)}
          name="onboarding.requireTreatment"
          isEditMode={isEditMode}
          type="boolean"
        />
        <EditableField
          label="Treatment info"
          readOnlyValue={asString(onboarding.treatmentInfo)}
          name="onboarding.treatmentInfo"
          isEditMode={isEditMode}
        />
        <EditableField
          label="Suitability info"
          readOnlyValue={asString(onboarding.suitabilityInfo)}
          name="onboarding.suitabilityInfo"
          isEditMode={isEditMode}
        />
      </DataList>
    </DrawerContentSection>
  );
};
