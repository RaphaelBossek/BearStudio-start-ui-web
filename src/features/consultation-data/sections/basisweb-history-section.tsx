import { DrawerContentSection } from '@/components/drawer-navigation';
import { FilterableTable } from '../components/filterable-table';
import { asArray, asRecord, type ConsultationData, formatDateTime } from '../types';

type BasiswebHistorySectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

export const BasiswebHistorySection = ({
  consultation,
  isEditMode: _isEditMode,
}: BasiswebHistorySectionProps) => {
  const history = asRecord(consultation.history);
  const historyRows = asArray(history.history);
  return (
    <DrawerContentSection
      variant="card"
      title="BasisWEB History"
      description="Patient history entries from BasisWEB."
    >
      <FilterableTable
        title="history"
        rows={historyRows}
        columns={[
          {
            key: 'date',
            label: 'Date',
            render: (row) => formatDateTime(row.date),
          },
          { key: 'active', label: 'Actor' },
          { key: 'type', label: 'Type' },
          { key: 'entry', label: 'Entry' },
          { key: 'content', label: 'Content' },
        ]}
      />
    </DrawerContentSection>
  );
};
