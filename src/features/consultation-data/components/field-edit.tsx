import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type FieldEditTextareaProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
};

export const FieldEditTextarea = ({
  label,
  id,
  value,
  onChange,
  rows = 5,
}: FieldEditTextareaProps) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium block" htmlFor={id}>
      {label}
    </label>
    <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
  </div>
);

type FieldEditToggleProps = {
  value: boolean;
  onToggle: () => void;
  trueLabel: string;
  falseLabel: string;
};

export const FieldEditToggle = ({
  value,
  onToggle,
  trueLabel,
  falseLabel,
}: FieldEditToggleProps) => (
  <Button size="sm" variant={value ? 'default' : 'secondary'} onClick={onToggle}>
    {value ? trueLabel : falseLabel}
  </Button>
);
