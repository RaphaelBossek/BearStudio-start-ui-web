import { DrawerContentSection } from '@/components/drawer-navigation';
import { FilterableTable } from '../components/filterable-table';
import { asArray, asRecord, type ConsultationData, formatDate } from '../types';

type BasiswebMedicationsSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const BasiswebMedicationsSection = ({
  consultation,
  isEditMode: _isEditMode,
}: BasiswebMedicationsSectionProps) => {
  const history = asRecord(consultation.history);
  const rows = asArray(history.medication);
  return (
    <DrawerContentSection
      variant="card"
      title="BasisWEB Medication"
      description="Medication records from BasisWEB."
    >
      <FilterableTable
        title="medications"
        rows={rows}
        columns={[
          {
            key: 'date',
            label: 'Date',
            render: (row) => formatDate(row.date),
          },
          {
            key: 'until',
            label: 'Until',
            render: (row) => formatDate(row.until),
          },
          { key: 'type', label: 'Type' },
          { key: 'entry', label: 'Medication' },
          { key: 'extra', label: 'Dosage' },
          { key: 'note', label: 'Unit/Route' },
          { key: 'content', label: 'Notes' },
        ]}
      />
    </DrawerContentSection>
  );
};
