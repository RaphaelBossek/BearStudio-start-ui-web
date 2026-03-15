import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/tailwind/utils';
import type { DrawerCategory } from './categorized-drawer-layout';

/**
 * Props for ResponsiveDrawerNav component
 */
interface ResponsiveDrawerNavProps {
  /** Array of categories to display in the navigation */
  categories: DrawerCategory[];
  /** Currently active category ID */
  activeCategory: string;
  /** Callback fired when a category is selected */
  onCategoryChange: (id: string) => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * ResponsiveDrawerNav - Adaptive navigation component for drawer categories
 *
 * Renders as:
 * - Select dropdown on mobile (<768px) - Touch-friendly, space-efficient
 * - Vertical button list on desktop (≥768px) - Scannable, always visible
 *
 * Features:
 * - Icon + label pattern for all categories
 * - Active state highlighting
 * - Keyboard accessible
 * - Automatic scrolling for long lists (desktop)
 *
 * @example
 * ```tsx
 * const categories = [
 *   { id: 'general', label: 'General', icon: InfoIcon },
 *   { id: 'settings', label: 'Settings', icon: SettingsIcon },
 * ];
 *
 * <ResponsiveDrawerNav
 *   categories={categories}
 *   activeCategory="general"
 *   onCategoryChange={setActiveCategory}
 * />
 * ```
 */
export const ResponsiveDrawerNav = ({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: ResponsiveDrawerNavProps) => {
  const activeCategoryLabel =
    categories.find((cat) => cat.id === activeCategory)?.label || 'Select category';

  return (
    <>
      {/* Mobile: Select Dropdown */}
      <div className="md:hidden">
        <Select value={activeCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder={activeCategoryLabel} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex gap-x-3 items-center">
                    <Icon className="size-4" />
                    <span>{cat.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Vertical Button List */}
      <ScrollArea
        orientation="vertical"
        className={cn(
          'hidden md:flex md:flex-col md:gap-1 md:w-48 md:shrink-0 md:border-r md:pr-4',
          className
        )}
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <Button
              key={cat.id}
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2 h-9 text-sm',
                isActive
                  ? 'bg-muted text-foreground hover:bg-muted font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => onCategoryChange(cat.id)}
            >
              <Icon className="size-4 shrink-0" />
              {cat.label}
            </Button>
          );
        })}
      </ScrollArea>
    </>
  );
};
