import { CalendarIcon, ClockIcon, DatabaseIcon, InfoIcon, UserIcon } from 'lucide-react';
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

interface ShiftPlanDetailsProps {
  shiftPlan: any;
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

const formatTime = (time: number | null | undefined) => {
  if (!time) return '--';
  const timeStr = time.toString().padStart(4, '0');
  return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
};

const getDayLabel = (day: string | null | undefined) => {
  const dayMap: Record<string, string> = {
    MO: 'Monday',
    TU: 'Tuesday',
    WE: 'Wednesday',
    TH: 'Thursday',
    FR: 'Friday',
    SA: 'Saturday',
    SU: 'Sunday',
  };
  return day ? dayMap[day] || day : '--';
};

export const ShiftPlanDetails = ({ shiftPlan }: ShiftPlanDetailsProps) => {
  const [activeTab, setActiveTab] = useState('general');

  const categories = [
    { id: 'general', label: 'General', icon: InfoIcon },
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { id: 'timing', label: 'Timing', icon: ClockIcon },
    { id: 'people', label: 'People', icon: UserIcon },
    { id: 'raw', label: 'Raw Data', icon: DatabaseIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic shift plan details.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataList>
                <DataListItem label="ID" value={shiftPlan.id} />
                <DataListItem label="Name" value={shiftPlan.name} />
                <DataListItem label="Version" value={shiftPlan.version} />
                <DataListItem label="Price Type" value={shiftPlan.priceType} />
                <DataListItem label="Comment" value={shiftPlan.comment} />
              </DataList>
            </CardContent>
          </Card>
        );
      case 'schedule':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Schedule Details</CardTitle>
              <CardDescription>Recurrence and scheduling information.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataList>
                <DataListItem label="Day" value={getDayLabel(shiftPlan.day)} />
                <DataListItem label="Scheduling" value={shiftPlan.scheduling} />
                <DataListItem label="Multiplier" value={shiftPlan.schedulingMulitplier} />
                <DataListItem
                  label="Last Date"
                  value={
                    shiftPlan.lastDate ? new Date(shiftPlan.lastDate).toLocaleDateString() : null
                  }
                />
                <DataListItem label="Min Patients" value={shiftPlan.minPatients} />
                <DataListItem label="Count" value={shiftPlan.count} />
              </DataList>
            </CardContent>
          </Card>
        );
      case 'timing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Timing Details</CardTitle>
              <CardDescription>Start and end times for the shift.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataList>
                <DataListItem label="Start Time" value={formatTime(shiftPlan.timeStart)} />
                <DataListItem label="End Time" value={formatTime(shiftPlan.timeEnd)} />
                <DataListItem
                  label="Created"
                  value={
                    shiftPlan.dateCreated ? new Date(shiftPlan.dateCreated).toLocaleString() : null
                  }
                />
                <DataListItem
                  label="Changed"
                  value={
                    shiftPlan.dateChanged ? new Date(shiftPlan.dateChanged).toLocaleString() : null
                  }
                />
              </DataList>
            </CardContent>
          </Card>
        );
      case 'people':
        return (
          <Card>
            <CardHeader>
              <CardTitle>People & Job</CardTitle>
              <CardDescription>Creator, modifier, and job information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Created By</h4>
                <DataList>
                  <DataListItem label="Name" value={shiftPlan.createdBy?.name} />
                  <DataListItem label="Display Name" value={shiftPlan.createdBy?.displayName} />
                  <DataListItem label="Email" value={shiftPlan.createdBy?.email} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Changed By</h4>
                <DataList>
                  <DataListItem label="Name" value={shiftPlan.changedBy?.name} />
                  <DataListItem label="Display Name" value={shiftPlan.changedBy?.displayName} />
                  <DataListItem label="Email" value={shiftPlan.changedBy?.email} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Job</h4>
                <DataList>
                  <DataListItem label="Title" value={shiftPlan.job?.title} />
                  <DataListItem label="Expert Title" value={shiftPlan.job?.expertTitle} />
                  <DataListItem label="Code" value={shiftPlan.job?.code} />
                  <DataListItem label="Shortcode" value={shiftPlan.job?.shortcode} />
                  <DataListItem label="Type" value={shiftPlan.job?.type} />
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
                  {JSON.stringify(shiftPlan, null, 2)}
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
