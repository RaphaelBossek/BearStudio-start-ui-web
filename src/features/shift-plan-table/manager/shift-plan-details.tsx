import { CalendarIcon, ClockIcon, DatabaseIcon, InfoIcon, UserIcon } from 'lucide-react';
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

type ShiftPlanDetailsProps = {
  shiftPlan: any;
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
            description="Basic shift plan details."
          >
            <DataList>
              <DataListItem label="ID" value={shiftPlan.id} />
              <DataListItem label="Name" value={shiftPlan.name} />
              <DataListItem label="Version" value={shiftPlan.version} />
              <DataListItem label="Price Type" value={shiftPlan.priceType} />
              <DataListItem label="Comment" value={shiftPlan.comment} />
            </DataList>
          </DrawerContentSection>
        ),
      },
      {
        id: 'schedule',
        label: 'Schedule',
        icon: CalendarIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Schedule Details"
            description="Recurrence and scheduling information."
          >
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
          </DrawerContentSection>
        ),
      },
      {
        id: 'timing',
        label: 'Timing',
        icon: ClockIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Timing Details"
            description="Start and end times for the shift."
          >
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
          </DrawerContentSection>
        ),
      },
      {
        id: 'people',
        label: 'People',
        icon: UserIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="People & Job"
            description="Creator, modifier, and job information."
          >
            <div className="space-y-6">
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
            </div>
          </DrawerContentSection>
        ),
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
                {JSON.stringify(shiftPlan, null, 2)}
              </pre>
            </div>
          </DrawerContentSection>
        ),
      },
    ],
    [shiftPlan]
  );

  return (
    <SectionedScrollLayout
      title="Shift Plan Details"
      description="Full inspection of the shift plan document from MongoDB."
      sections={sections}
    />
  );
};
