import { CalendarIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/tailwind/utils';

export type DatePickerButtonProps = ComponentProps<typeof Button>;

export const DatePickerButton = ({ className, children, ...props }: DatePickerButtonProps) => {
  const { t } = useTranslation(['components']);
  return (
    <Button
      variant="secondary"
      className={cn(
        'w-full max-w-60 justify-start text-left font-normal',
        !children && 'text-muted-foreground',
        className
      )}
      {...props}
    >
      <CalendarIcon />
      {children ?? t('components:datePickerButton.pickADate')}
    </Button>
  );
};
