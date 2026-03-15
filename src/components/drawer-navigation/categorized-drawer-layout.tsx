import type { LucideIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/tailwind/utils';
import { ResponsiveDrawerNav } from './responsive-drawer-nav';

/**
 * Category configuration for drawer navigation
 */
export interface DrawerCategory {
  /** Unique identifier for the category */
  id: string;
  /** Display label for the category */
  label: string;
  /** Lucide icon component for the category */
  icon: LucideIcon;
}

/**
 * Props for CategorizedDrawerLayout component
 */
interface CategorizedDrawerLayoutProps {
  /** Main drawer title displayed in the header */
  title: string;
  /** Optional description displayed under the title */
  description?: string;
  /** Array of category configurations for navigation */
  categories: DrawerCategory[];
  /** Currently active category ID */
  activeCategory: string;
  /** Callback fired when the active category changes */
  onCategoryChange: (categoryId: string) => void;
  /** Render function that returns content based on the active category */
  renderContent: (categoryId: string) => React.ReactNode;
  /** Optional className for the root element */
  className?: string;
}

/**
 * CategorizedDrawerLayout - A complete drawer layout with header, responsive navigation, and content area
 *
 * Provides a consistent structure for drawer content with:
 * - Fixed header with title and description
 * - Responsive navigation (Select dropdown on mobile, button sidebar on desktop)
 * - Scrollable content area
 *
 * @example
 * ```tsx
 * const [activeCategory, setActiveCategory] = useState('general');
 *
 * const categories = [
 *   { id: 'general', label: 'General', icon: InfoIcon },
 *   { id: 'details', label: 'Details', icon: FileIcon },
 * ];
 *
 * const renderContent = (categoryId: string) => {
 *   switch (categoryId) {
 *     case 'general':
 *       return <div>General content</div>;
 *     case 'details':
 *       return <div>Details content</div>;
 *     default:
 *       return null;
 *   }
 * };
 *
 * <CategorizedDrawerLayout
 *   title="Item Details"
 *   description="View and manage item information"
 *   categories={categories}
 *   activeCategory={activeCategory}
 *   onCategoryChange={setActiveCategory}
 *   renderContent={renderContent}
 * />
 * ```
 */
export const CategorizedDrawerLayout = ({
  title,
  description,
  categories,
  activeCategory,
  onCategoryChange,
  renderContent,
  className,
}: CategorizedDrawerLayoutProps) => {
  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {/* Body: Navigation + Content */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 flex-1 overflow-hidden p-4 md:p-6">
        {/* Responsive Navigation */}
        <ResponsiveDrawerNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />

        {/* Content Area */}
        <ScrollArea className="flex-1 min-w-0">
          <div className="md:pr-4">{renderContent(activeCategory)}</div>
        </ScrollArea>
      </div>
    </div>
  );
};
