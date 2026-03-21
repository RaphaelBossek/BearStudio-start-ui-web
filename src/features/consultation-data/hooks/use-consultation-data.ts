import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc/client';

export const useConsultationData = (id: string) => {
  return useQuery(
    orpc.consultationDataMongo.get.queryOptions({
      input: { id },
      enabled: !!id,
    })
  );
};
