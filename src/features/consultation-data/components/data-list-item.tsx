import {
  DataListCell,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '@/components/ui/datalist';

type DataListItemProps = {
  label: string;
  value: React.ReactNode;
};

export const DataListItem = ({ label, value }: DataListItemProps) => (
  <DataListRow className="py-0.5">
    <DataListCell className="w-52 flex-none py-1">
      <DataListTextHeader>{label}</DataListTextHeader>
    </DataListCell>
    <DataListCell className="py-1">
      <DataListText className="font-medium">{value ?? '—'}</DataListText>
    </DataListCell>
  </DataListRow>
);
