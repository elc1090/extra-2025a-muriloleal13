'use client';

import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { useThemeClasses } from '@/contexts/ThemeContext';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={300} skipDelayDuration={100}>
      {children}
    </TooltipPrimitive.Provider>
  );
}

export function Tooltip({ 
  children, 
  content, 
  side = 'top', 
  align = 'center',
  delayDuration = 300 
}: TooltipProps) {
  const themeClasses = useThemeClasses();

  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={8}
          className={`
            px-3 py-2 text-sm font-medium rounded-lg shadow-lg border
            max-w-xs z-50 animate-in fade-in-0 zoom-in-95
            ${themeClasses.bgPrimary} ${themeClasses.textPrimary} ${themeClasses.border}
            data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade
            data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade
            data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade
            data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade
          `}
        >
          {content}
          <TooltipPrimitive.Arrow 
            className={`fill-current ${themeClasses.textPrimary}`}
            width={12}
            height={6}
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

// Componente de conveniência para tooltips simples
export function SimpleTooltip({ 
  children, 
  tooltip, 
  ...props 
}: { 
  children: React.ReactNode; 
  tooltip: string;
} & Omit<TooltipProps, 'children' | 'content'>) {
  return (
    <Tooltip content={tooltip} {...props}>
      {children}
    </Tooltip>
  );
}
