import { CalendarIcon, DatabaseIcon, InfoIcon, MapPinIcon, UserIcon } from 'lucide-react';
import type * as React from 'react';
import { useState } from 'react';
import { CategorizedDrawerLayout, DrawerContentSection } from '@/components/drawer-navigation';
import { Badge } from '@/components/ui/badge';
import {
  DataList,
  DataListCell,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '@/components/ui/datalist';
import { Separator } from '@/components/ui/separator';

interface AppointmentDrawerProps {
  appointment: any;
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

const getStateVariant = (state: string | null | undefined) => {
  switch (state) {
    case 'ACTIVE':
      return 'positive';
    case 'DONE':
    case 'CLOSED':
      return 'secondary';
    case 'CANCELED':
    case 'STORNO':
      return 'negative';
    case 'LOCKEDIN':
      return 'warning';
    case 'REQUESTED':
      return 'warning';
    default:
      return 'secondary';
  }
};

export const AppointmentDrawer = ({ appointment }: AppointmentDrawerProps) => {
  const [activeCategory, setActiveCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'General', icon: InfoIcon },
    { id: 'timing', label: 'Timing', icon: CalendarIcon },
    { id: 'participants', label: 'Participants', icon: UserIcon },
    { id: 'location', label: 'Location/Job', icon: MapPinIcon },
    { id: 'raw', label: 'Raw Data', icon: DatabaseIcon },
  ];

  const renderContent = (categoryId: string) => {
    switch (categoryId) {
      case 'general':
        return (
          <DrawerContentSection
            variant="card"
            title="General Information"
            description="Basic appointment details."
          >
            <DataList>
              <DataListItem label="ID" value={appointment.id} />
              <DataListItem label="Title" value={appointment.title} />
              <DataListItem
                label="State"
                value={
                  appointment.state ? (
                    <Badge variant={getStateVariant(appointment.state)}>{appointment.state}</Badge>
                  ) : null
                }
              />
              <DataListItem
                label="Type"
                value={
                  appointment.type ? <Badge variant="secondary">{appointment.type}</Badge> : null
                }
              />
              <DataListItem label="Comment" value={appointment.comment} />
            </DataList>
          </DrawerContentSection>
        );
      case 'timing':
        return (
          <DrawerContentSection
            variant="card"
            title="Timing Details"
            description="Planned and actual times."
          >
            <DataList>
              <DataListItem
                label="Start"
                value={appointment.start ? new Date(appointment.start).toLocaleString() : null}
              />
              <DataListItem
                label="Until"
                value={appointment.until ? new Date(appointment.until).toLocaleString() : null}
              />
              <DataListItem
                label="Created"
                value={
                  appointment.dateCreated
                    ? new Date(appointment.dateCreated).toLocaleString()
                    : null
                }
              />
              <DataListItem
                label="Changed"
                value={
                  appointment.dateChanged
                    ? new Date(appointment.dateChanged).toLocaleString()
                    : null
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
            description="Involved customer and assigned staff."
          >
            <DataList>
              <DataListItem label="Customer" value={appointment.customer?.name} />
              <DataListItem label="Assigned Display Name" value={appointment.assignedDisplayName} />
              <DataListItem label="Required Staff" value={appointment.requiredStaffCount} />
              <DataListItem label="Actual Patients" value={appointment.actualPatients} />
            </DataList>
          </DrawerContentSection>
        );
      case 'location':
        return (
          <DrawerContentSection
            variant="card"
            title="Location & Job"
            description="Where and what service is provided."
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Location</h4>
                <DataList>
                  <DataListItem label="Name" value={appointment.location?.name} />
                  <DataListItem label="Address" value={appointment.location?.address} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Job</h4>
                <DataList>
                  <DataListItem label="Title" value={appointment.job?.title} />
                  <DataListItem label="Expert Title" value={appointment.job?.expertTitle} />
                  <DataListItem label="Code" value={appointment.job?.code} />
                </DataList>
              </div>
            </div>
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
                {JSON.stringify(appointment, null, 2)}
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
      title="Appointment Details"
      description="Associated appointment for this treatment."
      categories={categories}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      renderContent={renderContent}
    />
  );
};
