import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  AlertTriangleIcon,
  ArchiveIcon,
  ArchiveRestoreIcon,
  ClipboardListIcon,
  FileTextIcon,
  HeartPulseIcon,
  HistoryIcon,
  InfoIcon,
  PaperclipIcon,
  PillIcon,
  SaveIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  UserRoundIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type SectionConfig, SectionedScrollLayout } from '@/components/drawer-navigation';
import { Form } from '@/components/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DataListErrorState, DataListLoadingState } from '@/components/ui/datalist';
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutTopBar,
  PageLayoutTopBarTitle,
} from '@/layout/manager/page-layout';
import { orpc } from '@/lib/orpc/client';
import { ConsultationStateBadge } from './components/consultation-state-badge';
import { ConsultationTypeBadge } from './components/consultation-type-badge';
import { useConsultationAnnotation } from './hooks/use-consultation-annotation';
import { useConsultationData } from './hooks/use-consultation-data';
import { consultationFormSchema } from './schema';
import { AnamnesisSection } from './sections/anamnesis-section';
import { AttachmentsSection } from './sections/attachments-section';
import { AuditTrailSection } from './sections/audit-trail-section';
import { BasicsSection } from './sections/basics-section';
import { BasiswebHistorySection } from './sections/basisweb-history-section';
import { BasiswebMedicationsSection } from './sections/basisweb-medications-section';
import { DiagnosisSection } from './sections/diagnosis-section';
import { DocumentationSection } from './sections/documentation-section';
import { FindingsSection } from './sections/findings-section';
import { FurtherTreatmentSection } from './sections/further-treatment-section';
import { IncarcerationSection } from './sections/incarceration-section';
import { OnboardingSection } from './sections/onboarding-section';
import { PatientDataSection } from './sections/patient-data-section';
import { PrescriptionSection } from './sections/prescription-section';
import { SubmissionSection } from './sections/submission-section';
import { TreatmentPlanSection } from './sections/treatment-plan-section';
import { WarningsSection } from './sections/warnings-section';
import { WorkIncapacitySection } from './sections/work-incapacity-section';
import type { ConsultationData, ConsultationType } from './types';
import { buildSectionDiff } from './utils/build-section-diff';

const sectionVisibility: Record<string, ConsultationType[]> = {
  'patient-data': [
    'EXTERNAL',
    'STANDARD',
    'DOCUMENT',
    'ONBOARDING',
    'ONBOARDING_SHORT',
    'INCARCERATION',
    'TREATMENT',
  ],
  basics: [
    'EXTERNAL',
    'STANDARD',
    'DOCUMENT',
    'ONBOARDING',
    'ONBOARDING_SHORT',
    'INCARCERATION',
    'TREATMENT',
  ],
  anamnesis: ['STANDARD', 'DOCUMENT', 'ONBOARDING'],
  findings: ['STANDARD', 'DOCUMENT'],
  diagnosis: ['STANDARD', 'DOCUMENT', 'ONBOARDING', 'INCARCERATION'],
  prescription: ['STANDARD', 'ONBOARDING'],
  'work-incapacity': ['STANDARD'],
  onboarding: ['ONBOARDING', 'ONBOARDING_SHORT'],
  incarceration: ['INCARCERATION'],
  'treatment-plan': ['TREATMENT'],
  warnings: [
    'EXTERNAL',
    'STANDARD',
    'DOCUMENT',
    'ONBOARDING',
    'ONBOARDING_SHORT',
    'INCARCERATION',
    'TREATMENT',
  ],
  documentation: ['DOCUMENT'],
  'further-treatment': [
    'EXTERNAL',
    'STANDARD',
    'DOCUMENT',
    'ONBOARDING',
    'ONBOARDING_SHORT',
    'INCARCERATION',
    'TREATMENT',
  ],
  submission: [
    'EXTERNAL',
    'STANDARD',
    'DOCUMENT',
    'ONBOARDING',
    'ONBOARDING_SHORT',
    'INCARCERATION',
    'TREATMENT',
  ],
  'audit-trail': [
    'EXTERNAL',
    'STANDARD',
    'DOCUMENT',
    'ONBOARDING',
    'ONBOARDING_SHORT',
    'INCARCERATION',
    'TREATMENT',
  ],
};

const shouldShowSection = (
  sectionId: string,
  consultationType: ConsultationType,
  consultation: ConsultationData | undefined
) => {
  if (sectionId === 'basisweb-history' || sectionId === 'basisweb-medications') {
    return !!consultation?.basisWebDataId;
  }
  if (sectionId === 'attachments') {
    const attachments = (consultation as Record<string, unknown> | undefined)?.attachments;
    return Array.isArray(attachments) && attachments.length > 0;
  }
  const allowedTypes = sectionVisibility[sectionId] ?? [];
  return allowedTypes.includes(consultationType);
};

export const ConsultationDataPage = ({ consultationId }: { consultationId: string }) => {
  const consultationQuery = useConsultationData(consultationId);
  const { query: annotationQuery } = useConsultationAnnotation(consultationId);

  const saveAnnotation = useMutation(
    orpc.consultationAnnotation.upsert.mutationOptions({
      onSuccess: async () => {
        await Promise.all([consultationQuery.refetch(), annotationQuery.refetch()]);
      },
    })
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [requireReportingDraft, setRequireReportingDraft] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

  const consultation = consultationQuery.data;
  const annotation = annotationQuery.data;

  const effectiveComment =
    annotation?.commentOverride ?? (consultation ? String(consultation.comment ?? '') : '');
  const effectiveRequireReporting =
    annotation?.requireReportingOverride ?? Boolean(consultation?.requireReporting);

  const consultationType = String(consultation?.type ?? 'EXTERNAL') as ConsultationType;
  const canEdit = consultation?.state !== 'CLOSED';
  const isArchived = Boolean(consultation?.archived);

  const form = useForm({
    resolver: zodResolver(consultationFormSchema) as ExplicitAny,
    defaultValues: consultation as ExplicitAny,
  });

  useEffect(() => {
    if (consultation && !isEditMode) {
      form.reset(consultation as ExplicitAny);
    }
  }, [consultation, isEditMode, form]);

  const allSections: SectionConfig[] = useMemo(
    () => [
      {
        id: 'patient-data',
        label: 'Patient Data',
        icon: UserRoundIcon,
        content: (
          <PatientDataSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'basics',
        label: 'Basics',
        icon: InfoIcon,
        content: (
          <BasicsSection consultation={consultation as ConsultationData} isEditMode={isEditMode} />
        ),
      },
      {
        id: 'basisweb-history',
        label: 'BasisWEB History',
        icon: HistoryIcon,
        content: (
          <BasiswebHistorySection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'basisweb-medications',
        label: 'BasisWEB Medications',
        icon: PillIcon,
        content: (
          <BasiswebMedicationsSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'anamnesis',
        label: 'Anamnesis',
        icon: ClipboardListIcon,
        content: (
          <AnamnesisSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'findings',
        label: 'Findings',
        icon: StethoscopeIcon,
        content: (
          <FindingsSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'diagnosis',
        label: 'Diagnosis',
        icon: ShieldAlertIcon,
        content: (
          <DiagnosisSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'prescription',
        label: 'Prescription',
        icon: PillIcon,
        content: (
          <PrescriptionSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'work-incapacity',
        label: 'Work Incapacity',
        icon: AlertTriangleIcon,
        content: (
          <WorkIncapacitySection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'onboarding',
        label: 'Onboarding',
        icon: ShieldCheckIcon,
        content: (
          <OnboardingSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'incarceration',
        label: 'Incarceration',
        icon: ShieldAlertIcon,
        content: (
          <IncarcerationSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'treatment-plan',
        label: 'Treatment Plan',
        icon: HeartPulseIcon,
        content: (
          <TreatmentPlanSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'warnings',
        label: 'Warnings',
        icon: AlertTriangleIcon,
        content: (
          <WarningsSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'documentation',
        label: 'Documentation',
        icon: FileTextIcon,
        content: (
          <DocumentationSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'further-treatment',
        label: 'Further Treatment',
        icon: HeartPulseIcon,
        content: (
          <FurtherTreatmentSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'attachments',
        label: 'Attachments',
        icon: PaperclipIcon,
        content: (
          <AttachmentsSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        id: 'submission',
        label: 'Submission',
        icon: SaveIcon,
        content: (
          <SubmissionSection
            consultation={consultation as ConsultationData}
            isEditMode={isEditMode}
            effectiveComment={effectiveComment}
            effectiveRequireReporting={effectiveRequireReporting}
            commentDraft={commentDraft}
            onCommentChange={setCommentDraft}
            requireReportingDraft={requireReportingDraft}
            onRequireReportingToggle={() => setRequireReportingDraft((prev) => !prev)}
          />
        ),
      },
      {
        id: 'audit-trail',
        label: 'Change History',
        icon: HistoryIcon,
        content: <AuditTrailSection consultationId={consultationId} />,
      },
    ],
    [
      consultation,
      consultationId,
      isEditMode,
      effectiveComment,
      effectiveRequireReporting,
      commentDraft,
      requireReportingDraft,
    ]
  );

  const sections = useMemo(
    () =>
      allSections.filter((section) =>
        shouldShowSection(section.id, consultationType, consultation)
      ),
    [allSections, consultationType, consultation]
  );

  useEffect(() => {
    if (!consultation) return;
    if (isEditMode) return;
    setCommentDraft(effectiveComment);
    setRequireReportingDraft(effectiveRequireReporting);
  }, [consultation, effectiveComment, effectiveRequireReporting, isEditMode]);

  if (consultationQuery.status === 'pending') {
    return (
      <PageLayout>
        <PageLayoutTopBar>
          <PageLayoutTopBarTitle>Consultation #{consultationId}</PageLayoutTopBarTitle>
        </PageLayoutTopBar>
        <PageLayoutContent noContainer className="h-full p-4">
          <DataListLoadingState />
        </PageLayoutContent>
      </PageLayout>
    );
  }

  if (consultationQuery.status === 'error') {
    return (
      <PageLayout>
        <PageLayoutTopBar>
          <PageLayoutTopBarTitle>Consultation #{consultationId}</PageLayoutTopBarTitle>
        </PageLayoutTopBar>
        <PageLayoutContent noContainer className="h-full p-4">
          <DataListErrorState retry={() => consultationQuery.refetch()} />
        </PageLayoutContent>
      </PageLayout>
    );
  }

  if (!consultation) {
    return (
      <PageLayout>
        <PageLayoutTopBar>
          <PageLayoutTopBarTitle>Consultation #{consultationId}</PageLayoutTopBarTitle>
        </PageLayoutTopBar>
        <PageLayoutContent noContainer className="h-full p-4">
          <div className="text-sm text-muted-foreground">Consultation not found.</div>
        </PageLayoutContent>
      </PageLayout>
    );
  }

  const handleCancelEdit = () => {
    setCommentDraft(effectiveComment);
    setRequireReportingDraft(effectiveRequireReporting);
    form.reset(consultation as ExplicitAny);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    const formData = form.getValues();
    const mongoSource = consultation as unknown as Record<string, unknown>;

    const annotationPayload = {
      consultationMongoId: consultationId,
      commentOverride:
        commentDraft.trim() === String(mongoSource.comment ?? '').trim() ? null : commentDraft,
      requireReportingOverride:
        requireReportingDraft === Boolean(mongoSource.requireReporting)
          ? null
          : requireReportingDraft,
      bookNumberOverride:
        formData.bookNumber !== mongoSource.bookNumber ? (formData.bookNumber ?? null) : null,
      bodyOverride: buildSectionDiff(formData.body as Record<string, unknown>, mongoSource.body),
      baseOverride: buildSectionDiff(formData.base as Record<string, unknown>, mongoSource.base),
      onboardingOverride: buildSectionDiff(
        formData.onboarding as Record<string, unknown>,
        mongoSource.onboarding
      ),
      incarcerationOverride: buildSectionDiff(
        formData.incarceration as Record<string, unknown>,
        mongoSource.incarceration
      ),
      treatmentOverride: buildSectionDiff(
        formData.treatment as Record<string, unknown>,
        mongoSource.treatment
      ),
      standardOverride: buildSectionDiff(
        formData.standard as Record<string, unknown>,
        mongoSource.standard
      ),
      referralOverride: buildSectionDiff(
        formData.referral as Record<string, unknown>,
        mongoSource.referral
      ),
      warningsOverride: buildSectionDiff(
        formData.warnings as Record<string, unknown>,
        mongoSource.warnings
      ),
    };

    await saveAnnotation.mutateAsync(annotationPayload);
    setIsEditMode(false);
  };

  const handleArchiveToggle = async () => {
    await saveAnnotation.mutateAsync({
      consultationMongoId: consultationId,
      archivedOverride: !isArchived,
    });
    setShowArchiveConfirm(false);
  };

  return (
    <PageLayout>
      <PageLayoutTopBar
        endActions={
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saveAnnotation.isPending}>
                  {saveAnnotation.isPending ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <>
                {canEdit && (
                  <Button variant="secondary" size="sm" onClick={() => setIsEditMode(true)}>
                    Edit
                  </Button>
                )}
                {canEdit && (
                  <Button variant="secondary" size="sm" onClick={() => setShowArchiveConfirm(true)}>
                    {isArchived ? (
                      <>
                        <ArchiveRestoreIcon className="mr-1.5 size-4" />
                        Unarchive
                      </>
                    ) : (
                      <>
                        <ArchiveIcon className="mr-1.5 size-4" />
                        Archive
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        }
      >
        <div className="flex min-w-0 items-center gap-3">
          <PageLayoutTopBarTitle>Consultation #{consultationId}</PageLayoutTopBarTitle>
          <ConsultationTypeBadge type={consultation.type} />
          <ConsultationStateBadge state={consultation.state} />
        </div>
      </PageLayoutTopBar>
      <PageLayoutContent noContainer className="h-full">
        <Form {...(form as ExplicitAny)} noHtmlForm>
          <SectionedScrollLayout
            title="Consultation Details"
            description="Clinical data from MongoDB with annotation overrides stored in Neon."
            sections={sections}
          />
        </Form>
      </PageLayoutContent>

      <AlertDialog open={showArchiveConfirm} onOpenChange={setShowArchiveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArchived ? 'Unarchive Consultation' : 'Archive Consultation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArchived
                ? 'This will restore the consultation from the archive.'
                : 'This will archive the consultation. It can be restored later.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveToggle}>
              {isArchived ? 'Unarchive' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};
