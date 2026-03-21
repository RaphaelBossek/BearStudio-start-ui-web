import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DataListCell,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '@/components/ui/datalist';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/tailwind/utils';

type EditableFieldProps = {
  name: string;
  label: string;
  isEditMode: boolean;
  type?: 'text' | 'textarea' | 'number' | 'boolean' | 'select';
  options?: { label: string; value: string }[];
  readOnlyValue?: React.ReactNode;
};

export const EditableField = ({
  name,
  label,
  isEditMode,
  type = 'text',
  options,
  readOnlyValue,
}: EditableFieldProps) => {
  const form = useFormContext();

  if (!isEditMode) {
    return (
      <DataListRow className="py-0.5">
        <DataListCell className="w-52 flex-none py-1">
          <DataListTextHeader>{label}</DataListTextHeader>
        </DataListCell>
        <DataListCell className="py-1">
          <DataListText className="font-medium">{readOnlyValue ?? '—'}</DataListText>
        </DataListCell>
      </DataListRow>
    );
  }

  return (
    <DataListRow className="py-1">
      <DataListCell className="w-52 flex-none py-2">
        <DataListTextHeader>{label}</DataListTextHeader>
      </DataListCell>
      <DataListCell className="py-1 w-full max-w-md">
        <Controller
          control={form.control}
          name={name}
          render={({ field, fieldState }) => (
            <div className="w-full relative">
              {type === 'text' || type === 'number' ? (
                <Input
                  className={cn(fieldState.error && 'border-destructive')}
                  type={type}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(
                      type === 'number' ? (val === '' ? undefined : Number(val)) : val
                    );
                  }}
                />
              ) : type === 'textarea' ? (
                <Textarea
                  className={cn(fieldState.error && 'border-destructive')}
                  {...field}
                  value={field.value ?? ''}
                />
              ) : type === 'boolean' ? (
                <div className="flex items-center h-10">
                  <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                </div>
              ) : type === 'select' ? (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger className={cn(fieldState.error && 'border-destructive')}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
              {fieldState.error && (
                <p className="text-xs text-destructive absolute -bottom-5 left-0">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </DataListCell>
    </DataListRow>
  );
};
