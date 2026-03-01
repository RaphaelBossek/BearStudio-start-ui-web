import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Page } from '@/components/layout/page';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { orpc } from '@/lib/orpc/client';

export const Route = createFileRoute('/manager/medical-management/services')({
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useTranslation();
  const { data: services, isLoading } = orpc.medicalManagement.getAllServices.useQuery({});

  return (
    <Page>
      <Page.Header title="Medical Services" />
      <Page.Body>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short Name</TableHead>
                <TableHead>Internal Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Consultation Types</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : services?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No services found.
                  </TableCell>
                </TableRow>
              ) : (
                services?.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Badge style={{ backgroundColor: service.color }}>{service.shortName}</Badge>
                    </TableCell>
                    <TableCell>{service.internalName}</TableCell>
                    <TableCell>{service.department?.name}</TableCell>
                    <TableCell>{service.billingModality}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {service.consultationTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-[10px]">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Page.Body>
    </Page>
  );
}
