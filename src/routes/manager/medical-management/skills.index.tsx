import { createFileRoute } from '@tanstack/react-router';
import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
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

export const Route = createFileRoute('/manager/medical-management/skills')({
  component: SkillsPage,
});

function SkillsPage() {
  const { data: skills, isLoading } = orpc.medicalManagement.getAllSkills.useQuery({});

  return (
    <Page>
      <Page.Header title="Skills & Certificates" />
      <Page.Body>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Cert. Required</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : skills?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No skills found.
                  </TableCell>
                </TableRow>
              ) : (
                skills?.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{skill.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {skill.certificateRequired ? (
                        <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 text-gray-300" />
                      )}
                    </TableCell>
                    <TableCell>
                      {skill.active ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
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
