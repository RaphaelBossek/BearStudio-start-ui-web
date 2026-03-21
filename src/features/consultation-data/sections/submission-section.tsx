import { DrawerContentSection } from '@/components/drawer-navigation';
import { DataList } from '@/components/ui/datalist';
import { ConsultationStateBadge } from '../components/consultation-state-badge';
import { DataListItem } from '../components/data-list-item';
import { FieldEditTextarea, FieldEditToggle } from '../components/field-edit';
import {
  asBoolText,
  asRecord,
  asString,
  type ConsultationData,
  formatDateTime,
  formatSecondsTime,
} from '../types';

type SubmissionSectionProps = {
  consultation: ConsultationData;
  isEditMode: boolean;
  effectiveComment: string;
  effectiveRequireReporting: boolean;
  commentDraft: string;
  onCommentChange: (v: string) => void;
  requireReportingDraft: boolean;
  onRequireReportingToggle: () => void;
};

export const SubmissionSection = ({
  consultation,
  isEditMode,
  effectiveComment,
  effectiveRequireReporting,
  commentDraft,
  onCommentChange,
  requireReportingDraft,
  onRequireReportingToggle,
}: SubmissionSectionProps) => (
  <DrawerContentSection
    variant="card"
    title="Submission"
    description="Finalization, reporting and sign-off information."
  >
    <div className="space-y-4">
      <DataList>
        <DataListItem label="End" value={formatSecondsTime(consultation.timeEnd)} />
        <DataListItem
          label="Require reporting"
          value={asBoolText(isEditMode ? requireReportingDraft : effectiveRequireReporting)}
        />
        <DataListItem
          label="Signed off by"
          value={asString(asRecord(consultation.signedOffBy).name)}
        />
        <DataListItem label="Signed off at" value={formatDateTime(consultation.dateSignedOff)} />
        <DataListItem label="State" value={<ConsultationStateBadge state={consultation.state} />} />
      </DataList>
      {isEditMode ? (
        <div className="space-y-3">
          <FieldEditTextarea
            label="Comment override"
            id="comment-override"
            value={commentDraft}
            onChange={onCommentChange}
            rows={5}
          />
          <FieldEditToggle
            value={requireReportingDraft}
            onToggle={onRequireReportingToggle}
            trueLabel="Reporting required"
            falseLabel="Reporting not required"
          />
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-sm font-medium">Comment</p>
          <p className="text-sm whitespace-pre-wrap">{asString(effectiveComment)}</p>
        </div>
      )}
    </div>
  </DrawerContentSection>
);
