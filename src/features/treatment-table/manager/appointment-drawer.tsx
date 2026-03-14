import { CalendarIcon, DatabaseIcon, InfoIcon, MapPinIcon, UserIcon, XIcon } from 'lucide-react';
import type * as React from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DataList,
  DataListCell,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '@/components/ui/datalist';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/tailwind/utils';

interface AppointmentDrawerProps {
  appointment: any;
  onClose: () => void;
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

export const AppointmentDrawer = ({ appointment, onClose }: AppointmentDrawerProps) => {
  const [activeTab, setActiveTab] = useState('general');

  const categories = [
    { id: 'general', label: 'General', icon: InfoIcon },
    { id: 'timing', label: 'Timing', icon: CalendarIcon },
    { id: 'participants', label: 'Participants', icon: UserIcon },
    { id: 'location', label: 'Location/Job', icon: MapPinIcon },
    { id: 'raw', label: 'Raw Data', icon: DatabaseIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic appointment details.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataList>
                <DataListItem label="ID" value={appointment.id} />
                <DataListItem label="Title" value={appointment.title} />
                <DataListItem
                  label="State"
                  value={
                    appointment.state ? (
                      <Badge variant={getStateVariant(appointment.state)}>
                        {appointment.state}
                      </Badge>
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
            </CardContent>
          </Card>
        );
      case 'timing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Timing Details</CardTitle>
              <CardDescription>Planned and actual times.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );
      case 'participants':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>Involved customer and assigned staff.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataList>
                <DataListItem label="Customer" value={appointment.customer?.name} />
                <DataListItem
                  label="Assigned Display Name"
                  value={appointment.assignedDisplayName}
                />
                <DataListItem label="Required Staff" value={appointment.requiredStaffCount} />
                <DataListItem label="Actual Patients" value={appointment.actualPatients} />
              </DataList>
            </CardContent>
          </Card>
        );
      case 'location':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Location & Job</CardTitle>
              <CardDescription>Where and what service is provided.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  {JSON.stringify(appointment, null, 2)}
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">Appointment Details</h2>
          <p className="text-sm text-muted-foreground">
            Associated appointment for this treatment.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="size-4" />
        </Button>
      </div>
      <div className="flex gap-6 flex-1 overflow-hidden p-6">
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
        <ScrollArea className="flex-1 min-w-0">
          <div className="pr-4">{renderContent()}</div>
        </ScrollArea>
      </div>
    </div>
  );
};
