import { DrawerContentSection } from '@/components/drawer-navigation';
import { asArray, asRecord, asString, type ConsultationData, formatDate } from '../types';

type WorkIncapacitySectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const WorkIncapacitySection = ({
  consultation,
  isEditMode: _isEditMode,
}: WorkIncapacitySectionProps) => {
  const standard = asRecord(consultation.standard);
  const rows = asArray(standard.workIncapacity);
  return (
    <DrawerContentSection
      variant="card"
      title="Work Incapacity"
      description="Recorded incapacity periods."
    >
      <div className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No work incapacity entries.</p>
        ) : (
          rows.map((entry, index) => (
            <div key={`work-incapacity-${index}`} className="rounded border px-3 py-2 text-sm">
              <div>
                {formatDate(entry.start)} - {formatDate(entry.end)}
              </div>
              {entry.documentation !== undefined && entry.documentation !== null && (
                <div className="mt-1 text-muted-foreground">{asString(entry.documentation)}</div>
              )}
            </div>
          ))
        )}
      </div>
    </DrawerContentSection>
  );
};
