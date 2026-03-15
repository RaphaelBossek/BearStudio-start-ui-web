import type { SVGProps } from 'react';

import { cn } from '@/lib/tailwind/utils';

export const LogoMark = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="250"
      height="214"
      viewBox="0 0 250 214"
      {...props}
      className={cn('text-primary', props.className)}
    >
      <title>Videoclinic Logo Mark</title>
      <defs>
        <style>
          {`
            .logo-mark { fill: var(--color-primary-500, #049e9d); }
            .logo-text { fill: var(--color-foreground, #19354f); }
            
            .dark .logo-mark { fill: var(--color-primary-400, #049e9d); }
            .dark .logo-text { fill: var(--color-white, #ffffff); }
          `}
        </style>
      </defs>

      {/* Logo mark — shifted up by 24 units to match full logo vertical alignment */}
      <g id="logo-mark" transform="translate(0 -24)">
        <path
          d="M91.265,213.844l-59.611-.055L106.279,0h59.631Z"
          transform="translate(25.68 0)"
          className="logo-text"
        />
        <path
          d="M92.863,101.456l20.58-59.03h60.372L153.2,101.456Z"
          transform="translate(75.337 34.651)"
          className="logo-mark"
        />
        <path
          d="M0,101.456l20.58-59.03H80.951l-20.618,59.03Z"
          transform="translate(0 34.651)"
          className="logo-mark"
        />
      </g>
    </svg>
  );
};
