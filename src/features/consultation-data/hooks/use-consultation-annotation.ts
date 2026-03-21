import { useMutation, useQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc/client';

export const useConsultationAnnotation = (consultationMongoId: string) => {
  const query = useQuery(
    orpc.consultationAnnotation.get.queryOptions({
      input: { id: consultationMongoId },
      enabled: !!consultationMongoId,
    })
  );

  const upsert = useMutation(orpc.consultationAnnotation.upsert.mutationOptions());

  return {
    query,
    upsert,
  };
};
