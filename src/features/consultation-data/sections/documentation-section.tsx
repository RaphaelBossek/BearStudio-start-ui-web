import { DrawerContentSection } from '@/components/drawer-navigation';
import { asRecord, asString, type ConsultationData } from '../types';

type DocumentationSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const DocumentationSection = ({
  consultation,
  isEditMode: _isEditMode,
}: DocumentationSectionProps) => {
  const document = asRecord(consultation.document);
  return (
    <DrawerContentSection
      variant="card"
      title="Documentation"
      description="Free text documentation from document consultations."
    >
      <p className="text-sm whitespace-pre-wrap">{asString(document.documentation)}</p>
    </DrawerContentSection>
  );
};
