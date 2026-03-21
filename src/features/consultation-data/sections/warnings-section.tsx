import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { Separator } from '@/components/ui/separator';
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

type WarningsSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const WarningsSection = ({ consultation, isEditMode }: WarningsSectionProps) => {
  const warningRows = asArray(consultation.warnings);
  const grouped = warningRows.reduce<Record<string, Record<string, unknown>[]>>((acc, item) => {
    const warning = asRecord(item.warning);
    const type = String(warning.type ?? 'OTHER');
    acc[type] = [...(acc[type] ?? []), item];
    return acc;
  }, {});

  return (
    <DrawerContentSection
      variant="card"
      title="Warnings"
      description="All recorded warnings grouped by warning type."
    >
      <DataList>
        <EditableField
          label="No warnings"
          readOnlyValue={asBoolText(consultation.noWarnings)}
          name="noWarnings"
          isEditMode={isEditMode}
          type="boolean"
        />
      </DataList>
      <Separator className="my-4" />
      <div className="space-y-4">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-sm text-muted-foreground">No warning entries.</p>
        ) : (
          Object.entries(grouped).map(([warningType, rows]) => (
            <div key={warningType} className="space-y-2">
              <p className="text-sm font-semibold">{warningType}</p>
              {rows.map((row, index) => {
                const warning = asRecord(row.warning);
                return (
                  <EntryCard
                    key={`warning-${warningType}-${index}`}
                    title={asString(warning.name)}
                    subtitle={`Applies: ${asBoolText(row.applies)} · Start: ${formatDate(row.dateStart)} · End: ${formatDate(row.dateEnd)}`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{asString(row.comment)}</p>
                  </EntryCard>
                );
              })}
            </div>
          ))
        )}
      </div>
    </DrawerContentSection>
  );
};
