import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/**
 * Props for DrawerContentSection component
 */
interface DrawerContentSectionProps {
  /** Section title displayed at the top */
  title: string;
  /** Description text displayed below the title */
  description: string;
  /** Content to render in the section body */
  children: React.ReactNode;
  /** Visual variant - 'card' uses shadcn Card, 'plain' uses flat layout */
  variant?: 'card' | 'plain';
  /** Optional className for additional styling */
  className?: string;
}

/**
 * DrawerContentSection - Standardized wrapper for drawer content sections
 *
 * Provides consistent structure with:
 * - Title and description header
 * - Visual separation (Card border or Separator)
 * - Proper spacing and layout
 *
 * Variants:
 * - `card` (default): Uses shadcn Card component with CardHeader/CardContent
 *   Best for: Distinct, self-contained sections (e.g., "General Info", "Settings")
 *
 * - `plain`: Flat layout with title, separator, and content
 *   Best for: Full-width content, lighter visual hierarchy, or nested sections
 *
 * @example
 * ```tsx
 * // Card variant (default)
 * <DrawerContentSection
 *   variant="card"
 *   title="General Information"
 *   description="Basic details about the item."
 * >
 *   <DataList>
 *     <DataListItem label="Name" value="John Doe" />
 *     <DataListItem label="Email" value="john@example.com" />
 *   </DataList>
 * </DrawerContentSection>
 *
 * // Plain variant
 * <DrawerContentSection
 *   variant="plain"
 *   title="Advanced Settings"
 *   description="Configure advanced options."
 * >
 *   <SettingsForm />
 * </DrawerContentSection>
 * ```
 */
export const DrawerContentSection = ({
  title,
  description,
  children,
  variant = 'card',
  className,
}: DrawerContentSectionProps) => {
  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  }

  // Plain variant
  return (
    <div className={className}>
      <div className="flex-none">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Separator className="mt-4 flex-none" />
      <div className="pt-4">{children}</div>
    </div>
  );
};
