import { DrawerContentSection } from '@/components/drawer-navigation';
import { asArray, asRecord, asString, type ConsultationData, formatDate } from '../types';

type AttachmentsSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
};

const formatFileSize = (value: unknown): string => {
  const bytes = Number(value);
  if (Number.isNaN(bytes) || bytes <= 0) return asString(value);
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

export const AttachmentsSection = ({
  consultation,
  isEditMode: _isEditMode,
}: AttachmentsSectionProps) => {
  const rows = asArray((consultation as Record<string, unknown>).attachments);
  return (
    <DrawerContentSection
      variant="card"
      title="Attachments"
      description="Files attached to this consultation."
    >
      <div className="space-y-2">
        {rows.map((entry, index) => {
          const file = asRecord(entry.file);
          return (
            <div key={`attachment-${index}`} className="rounded border px-3 py-2 text-sm">
              <div className="font-medium">{asString(file.name)}</div>
              <div className="text-muted-foreground">
                {asString(file.mime)} · {formatFileSize(file.size)} · {formatDate(file.dateCreated)}
              </div>
            </div>
          );
        })}
      </div>
    </DrawerContentSection>
  );
};
