import { Link, type LinkProps } from '@tanstack/react-router';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/tailwind/utils';

function ButtonLink({
  className,
  children,
  variant,
  size,
  ...props
}: VariantProps<typeof buttonVariants> & ComponentProps<'a'> & LinkProps & { className?: string }) {
  return (
    <Link {...props} className={cn(buttonVariants({ variant, size, className }))}>
      <span className={'flex min-w-0 flex-1 items-center justify-center'}>{children}</span>
    </Link>
  );
}

export { ButtonLink };
