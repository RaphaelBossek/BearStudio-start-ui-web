import {
  CalendarIcon,
  DatabaseIcon,
  FileTextIcon,
  InfoIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';
import type * as React from 'react';
import { useState } from 'react';
import { CategorizedDrawerLayout, DrawerContentSection } from '@/components/drawer-navigation';
import {
  DataList,
  DataListCell,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '@/components/ui/datalist';
import { Separator } from '@/components/ui/separator';

interface TreatmentDetailsProps {
  treatment: any;
}

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
  const [activeCategory, setActiveCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'General', icon: InfoIcon },
    { id: 'timing', label: 'Timing', icon: CalendarIcon },
    { id: 'participants', label: 'Participants', icon: UserIcon },
    { id: 'location', label: 'Location/Job', icon: MapPinIcon },
    { id: 'counts', label: 'Counts', icon: FileTextIcon },
    { id: 'raw', label: 'Raw Data', icon: DatabaseIcon },
  ];

  const renderContent = (categoryId: string) => {
    switch (categoryId) {
      case 'general':
        return (
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
        );
      case 'timing':
        return (
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
        );
      case 'participants':
        return (
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
        );
      case 'location':
        return (
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
        );
      case 'counts':
        return (
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
        );
      case 'raw':
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <CategorizedDrawerLayout
      title="Treatment Details"
      description="Full inspection of the treatment document from MongoDB."
      categories={categories}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      renderContent={renderContent}
    />
  );
};
