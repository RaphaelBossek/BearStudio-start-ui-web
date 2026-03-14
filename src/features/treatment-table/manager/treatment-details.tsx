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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DataList,
  DataListCell,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '@/components/ui/datalist';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/tailwind/utils';

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
  const [activeTab, setActiveTab] = useState('general');

  const categories = [
    { id: 'general', label: 'General', icon: InfoIcon },
    { id: 'timing', label: 'Timing', icon: CalendarIcon },
    { id: 'participants', label: 'Participants', icon: UserIcon },
    { id: 'location', label: 'Location/Job', icon: MapPinIcon },
    { id: 'counts', label: 'Counts', icon: FileTextIcon },
    { id: 'raw', label: 'Raw Data', icon: DatabaseIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic treatment details.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );
      case 'timing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Timing Details</CardTitle>
              <CardDescription>Treatment dates and scheduling.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataList>
                <DataListItem
                  label="Date Start"
                  value={
                    treatment.dateStart ? new Date(treatment.dateStart).toLocaleString() : null
                  }
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
            </CardContent>
          </Card>
        );
      case 'participants':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>Assigned staff and customer information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        );
      case 'location':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Location & Job</CardTitle>
              <CardDescription>Customer, location and job details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
          </Card>
        );
      case 'counts':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Count Information</CardTitle>
              <CardDescription>Treatment statistics and report counts.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );
      case 'raw':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Raw Document Data</CardTitle>
              <CardDescription>Full unformatted JSON data from MongoDB.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-muted/30 p-4">
                <pre className="text-[10px] font-mono leading-tight whitespace-pre-wrap break-all h-[500px] overflow-auto">
                  {JSON.stringify(treatment, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6 h-full p-1">
      <aside className="w-48 shrink-0 flex flex-col gap-1 border-r pr-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={activeTab === cat.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-2 h-9 text-sm',
                activeTab === cat.id && 'bg-secondary font-medium'
              )}
              onClick={() => setActiveTab(cat.id)}
            >
              <Icon className="size-4 shrink-0" />
              {cat.label}
            </Button>
          );
        })}
      </aside>
      <div className="flex-1 min-w-0 pb-10">{renderContent()}</div>
    </div>
  );
};
