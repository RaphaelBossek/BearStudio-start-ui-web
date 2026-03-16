import {
  CalendarIcon,
  DatabaseIcon,
  FileTextIcon,
  InfoIcon,
  ListIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';
import type * as React from 'react';
import { useMemo } from 'react';
import type { SectionConfig } from '@/components/drawer-navigation';
import { DrawerContentSection, SectionedScrollLayout } from '@/components/drawer-navigation';
import {
  DataList,
  DataListCell,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '@/components/ui/datalist';
import { Separator } from '@/components/ui/separator';
import type { Treatment } from '@/features/treatment-table/schema';

type TreatmentDetailsProps = {
  treatment: Treatment;
};

const DataListItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <DataListRow className="py-0.5">
    <DataListCell className="w-40 flex-none py-1">
      <DataListTextHeader>{label}</DataListTextHeader>
    </DataListCell>
    <DataListCell className="py-1">
      <DataListText className="font-medium">{value ?? '--'}</DataListText>
    </DataListCell>
  </DataListRow>
);

export const TreatmentDetails = ({ treatment }: TreatmentDetailsProps) => {
  const sections = useMemo<SectionConfig[]>(
    () => [
      {
        id: 'general',
        label: 'General',
        icon: InfoIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="General Information"
            description="Basic treatment details."
          >
            <DataList>
              <DataListItem label="ID" value={treatment.id} />
              <DataListItem label="Book Number" value={treatment.bookNumber} />
              <DataListItem label="J-Number" value={treatment.jNumber} />
              <DataListItem label="State" value={treatment.state} />
              <DataListItem label="Type" value={treatment.type} />
              <DataListItem label="Comment" value={treatment.comment} />
              <DataListItem label="Archived" value={treatment.archived ? 'Yes' : 'No'} />
              <DataListItem label="Reporting Path" value={treatment.reportingPath} />
            </DataList>
          </DrawerContentSection>
        ),
      },
      {
        id: 'timing',
        label: 'Timing',
        icon: CalendarIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Timing Details"
            description="Treatment dates and scheduling."
          >
            <DataList>
              <DataListItem
                label="Date Start"
                value={treatment.dateStart ? new Date(treatment.dateStart).toLocaleString() : null}
              />
              <DataListItem
                label="Date Started"
                value={
                  treatment.dateStarted ? new Date(treatment.dateStarted).toLocaleString() : null
                }
              />
              <DataListItem
                label="Date Initial"
                value={
                  treatment.dateInitial ? new Date(treatment.dateInitial).toLocaleString() : null
                }
              />
              <DataListItem
                label="Date Created"
                value={
                  treatment.dateCreated ? new Date(treatment.dateCreated).toLocaleString() : null
                }
              />
              <DataListItem
                label="Date Changed"
                value={
                  treatment.dateChanged ? new Date(treatment.dateChanged).toLocaleString() : null
                }
              />
              <DataListItem
                label="Last Appointment"
                value={
                  treatment.dateLastAppointment
                    ? new Date(treatment.dateLastAppointment).toLocaleString()
                    : null
                }
              />
              <DataListItem
                label="Closed"
                value={treatment.closed ? new Date(treatment.closed).toLocaleString() : null}
              />
              <DataListItem
                label="Storno"
                value={
                  treatment.dateStorno ? new Date(treatment.dateStorno).toLocaleString() : null
                }
              />
            </DataList>
          </DrawerContentSection>
        ),
      },
      {
        id: 'participants',
        label: 'Participants',
        icon: UserIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Participants"
            description="Assigned staff and customer information."
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Assigned</h4>
                <DataList>
                  <DataListItem label="Name" value={treatment.assigned?.name} />
                  <DataListItem label="Email" value={treatment.assigned?.email} />
                  <DataListItem
                    label="Display Name"
                    value={treatment.assigned?.formalDisplayName}
                  />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Created By</h4>
                <DataList>
                  <DataListItem label="Name" value={treatment.createdBy?.name} />
                  <DataListItem label="Email" value={treatment.createdBy?.email} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Changed By</h4>
                <DataList>
                  <DataListItem label="Name" value={treatment.changedBy?.name} />
                  <DataListItem label="Email" value={treatment.changedBy?.email} />
                </DataList>
              </div>
            </div>
          </DrawerContentSection>
        ),
      },
      {
        id: 'location',
        label: 'Location/Job',
        icon: MapPinIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Location & Job"
            description="Customer, location and job details."
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Customer</h4>
                <DataList>
                  <DataListItem label="Name" value={treatment.customer?.name} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Location</h4>
                <DataList>
                  <DataListItem label="Name" value={treatment.location?.name} />
                  <DataListItem
                    label="Patient Data Type"
                    value={treatment.location?.patientDataType}
                  />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Job</h4>
                <DataList>
                  <DataListItem label="Title" value={treatment.job?.title} />
                  <DataListItem label="Code" value={treatment.job?.code} />
                  <DataListItem label="Expert Title" value={treatment.job?.expertTitle} />
                  <DataListItem label="Type" value={treatment.job?.type} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Report Job</h4>
                <DataList>
                  <DataListItem label="Title" value={treatment.jobReport?.title} />
                  <DataListItem label="Code" value={treatment.jobReport?.code} />
                </DataList>
              </div>
            </div>
          </DrawerContentSection>
        ),
      },
      {
        id: 'counts',
        label: 'Counts',
        icon: FileTextIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Count Information"
            description="Treatment statistics and report counts."
          >
            <DataList>
              <DataListItem label="Total Count" value={treatment.countTotal} />
              <DataListItem label="Finished Count" value={treatment.countFinished} />
              <DataListItem label="Planned Count" value={treatment.countPlanned} />
              <DataListItem label="Initial Reports" value={treatment.reportCountInitial} />
              <DataListItem label="Rhythm Reports" value={treatment.reportCountRhytm} />
              <DataListItem label="Hour" value={treatment.hour} />
              <DataListItem label="Day" value={treatment.day} />
              <DataListItem label="Minutes" value={treatment.minutes} />
            </DataList>
          </DrawerContentSection>
        ),
      },
      {
        id: 'positions',
        label: 'Positions',
        icon: ListIcon,
        content: (() => {
          const positions = treatment.positions ?? [];
          return (
            <DrawerContentSection
              variant="card"
              title="Positions"
              description={`${positions.length} position${positions.length !== 1 ? 's' : ''} in this treatment.`}
            >
              <div className="max-h-[500px] overflow-y-auto space-y-4">
                {positions.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-1.5">No positions.</p>
                ) : (
                  positions.map((pos, index) => (
                    <div
                      key={pos.appointmentId ?? index}
                      className="rounded-md border p-3 space-y-2"
                    >
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Position {index + 1}
                      </p>
                      <DataList>
                        <DataListItem label="Appointment ID" value={pos.appointmentId} />
                        <DataListItem label="State" value={pos.state} />
                        <DataListItem
                          label="Start"
                          value={pos.start ? new Date(pos.start).toLocaleString() : null}
                        />
                        <DataListItem
                          label="Until"
                          value={pos.until ? new Date(pos.until).toLocaleString() : null}
                        />
                        <DataListItem
                          label="Require Report"
                          value={
                            pos.requireReport != null ? (pos.requireReport ? 'Yes' : 'No') : null
                          }
                        />
                        <DataListItem
                          label="Force Report"
                          value={pos.forceReport != null ? (pos.forceReport ? 'Yes' : 'No') : null}
                        />
                      </DataList>
                      {pos.report && (
                        <div className="pt-2">
                          <p className="text-xs font-medium mb-1 text-muted-foreground px-1">
                            Report
                          </p>
                          <DataList>
                            <DataListItem label="Type" value={pos.report.type} />
                            <DataListItem
                              label="Date"
                              value={
                                pos.report.date ? new Date(pos.report.date).toLocaleString() : null
                              }
                            />
                            <DataListItem
                              label="Date Start"
                              value={
                                pos.report.dateStart
                                  ? new Date(pos.report.dateStart).toLocaleString()
                                  : null
                              }
                            />
                            <DataListItem
                              label="Date End"
                              value={
                                pos.report.dateEnd
                                  ? new Date(pos.report.dateEnd).toLocaleString()
                                  : null
                              }
                            />
                            <DataListItem
                              label="Consultation ID"
                              value={pos.report.consultationId}
                            />
                            {pos.report.job && (
                              <DataListItem
                                label="Report Job"
                                value={pos.report.job.title ?? pos.report.job.code}
                              />
                            )}
                          </DataList>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </DrawerContentSection>
          );
        })(),
      },
      {
        id: 'raw',
        label: 'Raw Data',
        icon: DatabaseIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Raw Document Data"
            description="Full unformatted JSON data from MongoDB."
          >
            <div className="rounded-md border bg-muted/30 p-4">
              <pre className="text-[10px] font-mono leading-tight whitespace-pre-wrap break-all h-[500px] overflow-auto">
                {JSON.stringify(treatment, null, 2)}
              </pre>
            </div>
          </DrawerContentSection>
        ),
      },
    ],
    [treatment]
  );

  return (
    <SectionedScrollLayout
      title="Treatment Details"
      description="Full inspection of the treatment document from MongoDB."
      sections={sections}
    />
  );
};
