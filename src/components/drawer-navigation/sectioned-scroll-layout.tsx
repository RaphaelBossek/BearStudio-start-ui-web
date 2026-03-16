import type { LucideIcon } from 'lucide-react';
import { MenuIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useContainerWidth } from '@/hooks/use-container-width';
import { cn } from '@/lib/tailwind/utils';

/** Panel width at which the full sidebar (icon + label) is shown */
const SIDEBAR_FULL_THRESHOLD = 420;
/** Panel width at which the icon-only sidebar is shown (below -> hamburger) */
const SIDEBAR_ICON_THRESHOLD = 220;

/**
 * Configuration for a single section in the scroll layout.
 *
 * The `sections` prop passed to `SectionedScrollLayout` **must** be wrapped in
 * `useMemo` in every consumer. If it is not, the IntersectionObserver will be
 * torn down and rebuilt on every render, causing flickering active-state.
 */
export type SectionConfig = {
  /** Unique ID -- used for anchor scrolling and scroll-spy. Must be stable (not random). */
  id: string;
  /** Display label shown in nav sidebar and sheet */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Content rendered unconditionally -- do NOT lazy-render. */
  content: React.ReactNode;
};

type SectionedScrollLayoutProps = {
  title: string;
  description?: string;
  sections: SectionConfig[];
  /** Optional className on root element */
  className?: string;
};

export const SectionedScrollLayout = ({
  title,
  description,
  sections,
  className,
}: SectionedScrollLayoutProps) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const [sheetOpen, setSheetOpen] = useState(false);
  const { ref: containerRef, width } = useContainerWidth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll-spy via IntersectionObserver
  const sectionIds = sections.map((s) => s.id).join(',');

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only re-run when section IDs change, not when content/icons change
  useEffect(() => {
    const scrollRoot = scrollAreaRef.current;
    if (!scrollRoot) return;

    // The IntersectionObserver root must be the actual scrollable viewport
    // inside shadcn ScrollArea, which is [data-slot="scroll-area-viewport"]
    const viewportEl = scrollRoot.querySelector<HTMLDivElement>(
      '[data-slot="scroll-area-viewport"]'
    );
    if (!viewportEl) return;

    const observers: IntersectionObserver[] = [];

    for (const section of sections) {
      const el = sectionRefs.current.get(section.id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setActiveId(section.id);
          }
        },
        {
          root: viewportEl,
          // Trigger when section enters the top 40% of the scroll viewport
          rootMargin: '0px 0px -60% 0px',
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => {
      for (const o of observers) {
        o.disconnect();
      }
    };
  }, [sectionIds]);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = sectionRefs.current.get(sectionId);
    if (!el) return;
    // Scroll within the ScrollArea viewport, not window
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(sectionId);
    setSheetOpen(false);
  }, []);

  const navState: 'full' | 'icons-only' | 'hamburger' =
    width === undefined
      ? 'full'
      : width >= SIDEBAR_FULL_THRESHOLD
        ? 'full'
        : width >= SIDEBAR_ICON_THRESHOLD
          ? 'icons-only'
          : 'hamburger';

  return (
    <div ref={containerRef} className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex-none flex items-start justify-between px-6 py-4 border-b gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {navState === 'hamburger' && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open section navigation"
            onClick={() => setSheetOpen(true)}
          >
            <MenuIcon className="size-4" />
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar nav (full or icon-only) */}
        {navState !== 'hamburger' && (
          <nav
            aria-label="Section navigation"
            className={cn(
              'flex-none flex flex-col gap-1 py-2 border-r overflow-y-auto',
              navState === 'full' ? 'w-42 px-2' : 'w-10 px-1'
            )}
          >
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = section.id === activeId;
              const btnClassName = cn(
                'flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              );

              if (navState === 'icons-only') {
                return (
                  <Tooltip key={section.id}>
                    <TooltipTrigger
                      onClick={() => scrollToSection(section.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={btnClassName}
                    >
                      <Icon className="size-4 shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent side="right">{section.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={btnClassName}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Scrollable content -- all sections rendered at once */}
        <div ref={scrollAreaRef} className="flex-1 min-w-0">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-4">
              {sections.map((section) => (
                <div
                  key={section.id}
                  ref={(el) => {
                    if (el) sectionRefs.current.set(section.id, el);
                    else sectionRefs.current.delete(section.id);
                  }}
                >
                  {section.content}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Sheet (hamburger state) */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-56 p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-sm font-semibold">Navigate to</SheetTitle>
          </SheetHeader>
          <nav aria-label="Section navigation" className="flex flex-col gap-1 p-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = section.id === activeId;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};
