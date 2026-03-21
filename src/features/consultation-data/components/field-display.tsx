import {
  DataListCell,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '@/components/ui/datalist';

export const FieldDisplay = ({ label, value }: { label: string; value: React.ReactNode }) => {
  return (
    <DataListRow className="py-0.5">
      <DataListCell className="w-52 flex-none py-1">
        <DataListTextHeader>{label}</DataListTextHeader>
      </DataListCell>
      <DataListCell className="py-1">
        <DataListText className="font-medium">{value ?? '—'}</DataListText>
      </DataListCell>
    </DataListRow>
  );
};
