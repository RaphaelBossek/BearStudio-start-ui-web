import {
  BriefcaseIcon,
  ContactIcon,
  CreditCardIcon,
  DatabaseIcon,
  Settings2Icon,
  ShieldCheckIcon,
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
import { cn } from '@/lib/tailwind/utils';

type UserDetailsSettingsProps = {
  user: any;
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

export const UserDetailsSettings = ({ user }: UserDetailsSettingsProps) => {
  const sections = useMemo<SectionConfig[]>(
    () => [
      {
        id: 'general',
        label: 'General',
        icon: UserIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="General Profile"
            description="Basic information about the user."
          >
            <DataList>
              <DataListItem label="Salutation" value={user.userProfile?.salutation} />
              <DataListItem label="Title" value={user.userProfile?.title} />
              <DataListItem label="First Name" value={user.userProfile?.firstName} />
              <DataListItem label="Last Name" value={user.userProfile?.lastName} />
              <DataListItem label="Display Name" value={user.userProfile?.displayName} />
              <DataListItem
                label="Birthday"
                value={
                  user.userProfile?.birthday
                    ? new Date(user.userProfile.birthday).toLocaleDateString()
                    : null
                }
              />
              <DataListItem label="Gender" value={user.userProfile?.gender} />
            </DataList>
          </DrawerContentSection>
        ),
      },
      {
        id: 'contact',
        label: 'Contact',
        icon: ContactIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Contact Information"
            description="Address and communication details."
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Email & Phone</h4>
                <DataList>
                  <DataListItem label="Main Email" value={user.email} />
                  <DataListItem label="Secondary Email" value={user.employeeProfile?.email2} />
                  <DataListItem label="Mobile" value={user.userProfile?.cellularNumber} />
                  <DataListItem label="Phone (Shift)" value={user.userProfile?.shiftPhoneNumber} />
                  <DataListItem label="Phone (Home)" value={user.userProfile?.homePhone} />
                  <DataListItem label="Phone (Work)" value={user.userProfile?.workPhone} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Main Address</h4>
                <DataList>
                  <DataListItem label="Street" value={user.userProfile?.mainAddress?.address} />
                  <DataListItem label="Address 2" value={user.userProfile?.mainAddress?.address2} />
                  <DataListItem label="ZIP" value={user.userProfile?.mainAddress?.zip} />
                  <DataListItem label="City" value={user.userProfile?.mainAddress?.city} />
                  <DataListItem label="Country" value={user.userProfile?.mainAddress?.country} />
                </DataList>
              </div>
            </div>
          </DrawerContentSection>
        ),
      },
      {
        id: 'account',
        label: 'Account',
        icon: Settings2Icon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Account & System"
            description="System-level account status and metadata."
          >
            <DataList>
              <DataListItem label="Username" value={user.username} />
              <DataListItem label="Role" value={user.role} />
              <DataListItem
                label="Status"
                value={
                  user.enabled ? (
                    <span className="text-green-600 font-medium">Enabled</span>
                  ) : (
                    <span className="text-red-600 font-medium">Disabled</span>
                  )
                }
              />
              <DataListItem
                label="Created At"
                value={user.dateCreated ? new Date(user.dateCreated).toLocaleString() : null}
              />
              <DataListItem
                label="Changed At"
                value={user.dateChanged ? new Date(user.dateChanged).toLocaleString() : null}
              />
              <DataListItem label="Logins" value={user.countLogin} />
              <DataListItem
                label="Last Login"
                value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : null}
              />
              <DataListItem label="Last IP" value={user.lastIP} />
            </DataList>
          </DrawerContentSection>
        ),
      },
      {
        id: 'professional',
        label: 'Professional',
        icon: BriefcaseIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Professional Profile"
            description="Bank details and certification info."
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Bank Details</h4>
                <DataList>
                  <DataListItem label="Bank Name" value={user.employeeProfile?.bank} />
                  <DataListItem label="IBAN" value={user.employeeProfile?.iban} />
                  <DataListItem label="BIC" value={user.employeeProfile?.bic} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Tax & ID</h4>
                <DataList>
                  <DataListItem label="Tax ID" value={user.employeeProfile?.taxid} />
                  <DataListItem label="UID" value={user.employeeProfile?.uid} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Skills (Top 3)</h4>
                <div className="space-y-2">
                  {user.employeeProfile?.skills?.slice(0, 3).map((skill: any, i: number) => (
                    <div
                      key={i}
                      className="text-sm flex justify-between border-b pb-1 last:border-0"
                    >
                      <span>{skill.id}</span>
                      <span
                        className={cn(
                          'text-xs',
                          skill.active ? 'text-green-600' : 'text-muted-foreground'
                        )}
                      >
                        {skill.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  )) || <span className="text-sm text-muted-foreground">No skills assigned.</span>}
                </div>
              </div>
            </div>
          </DrawerContentSection>
        ),
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: CreditCardIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Billing & Employer"
            description="Employer-specific settings and billing info."
          >
            <DataList>
              <DataListItem label="Konto" value={user.employerProfile?.konto} />
              <DataListItem label="Level" value={user.employerProfile?.level} />
              <DataListItem
                label="Active Since"
                value={
                  user.employerProfile?.activeSince
                    ? new Date(user.employerProfile.activeSince).toLocaleDateString()
                    : null
                }
              />
              <DataListItem label="Current Income" value={user.employerProfile?.currentIncome} />
              <DataListItem label="Inactive Reason" value={user.employerProfile?.inctiveReason} />
            </DataList>
          </DrawerContentSection>
        ),
      },
      {
        id: 'security',
        label: 'Security',
        icon: ShieldCheckIcon,
        content: (
          <DrawerContentSection
            variant="card"
            title="Security & Authentication"
            description="TOTP and login event history."
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">TOTP Status</h4>
                <DataList>
                  <DataListItem label="Required" value={user.requireTotp ? 'Yes' : 'No'} />
                  <DataListItem
                    label="Activated"
                    value={
                      user.totpDevice?.activated
                        ? new Date(user.totpDevice.activated).toLocaleString()
                        : 'Not set'
                    }
                  />
                  <DataListItem label="Device IP" value={user.totpDevice?.ip} />
                </DataList>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 px-1.5">Blocked Logins (Top 3)</h4>
                <div className="space-y-3">
                  {user.invalidLogins?.slice(0, 3).map((event: any, i: number) => (
                    <div key={i} className="text-xs space-y-1 bg-muted/30 p-2 rounded-sm">
                      <div className="flex justify-between font-medium">
                        <span>{event.ip}</span>
                        <span>{event.date ? new Date(event.date).toLocaleString() : ''}</span>
                      </div>
                      <div className="text-muted-foreground truncate" title={event.ua}>
                        {event.ua}
                      </div>
                      <div className="text-right">Attempts: {event.count}</div>
                    </div>
                  )) || (
                    <span className="text-sm text-muted-foreground">
                      No blocked logins recorded.
                    </span>
                  )}
                </div>
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
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </DrawerContentSection>
        ),
      },
    ],
    [user]
  );

  return (
    <SectionedScrollLayout
      title="User Details"
      description="Full inspection of the user document from the legacy MongoDB."
      sections={sections}
    />
  );
};
