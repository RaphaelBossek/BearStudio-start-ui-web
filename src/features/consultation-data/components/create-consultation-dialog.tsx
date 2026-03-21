import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Radio, RadioGroup } from '@/components/ui/radio-group';
import { orpc } from '@/lib/orpc/client';
import { consultationTypes } from '../types';

export const CreateConsultationDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>(consultationTypes[0]);

  const createMutation = useMutation(
    orpc.consultationAnnotation.upsert.mutationOptions({
      onSuccess: (data) => {
        onOpenChange(false);
        if (data?.consultationMongoId) {
          router.navigate({
            to: '/manager/consultations/$id',
            params: { id: data.consultationMongoId },
          });
        }
      },
    })
  );

  const handleCreate = () => {
    const draftId = `draft-${Date.now()}`;
    createMutation.mutate({
      consultationMongoId: draftId,
      typeOverride: selectedType,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Consultation</DialogTitle>
          <DialogDescription>Select a consultation type to create.</DialogDescription>
        </DialogHeader>

        <RadioGroup value={selectedType} onValueChange={setSelectedType}>
          {consultationTypes.map((type) => (
            <Radio key={type} value={type}>
              {type.replace(/_/g, ' ')}
            </Radio>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
