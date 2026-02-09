import { useState } from 'react';
import { LucideIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/data/mockHomeData';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'default' | 'success' | 'warning' | 'danger';
  count?: number;
  subtitle?: string;
  explanation?: string;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  variant,
  count,
  subtitle,
  explanation,
}: SummaryCardProps) {
  const [open, setOpen] = useState(false);

  const variantStyles = {
    default: 'border-border bg-card',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-destructive/30 bg-destructive/5',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  };

  const valueStyles = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          'rounded-xl border p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] animate-fade-in',
          variantStyles[variant]
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
              {explanation && (
                <CollapsibleTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                    {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </CollapsibleTrigger>
              )}
            </div>
            <p className={cn('mt-1.5 text-xl font-semibold tracking-tight', valueStyles[variant])}>
              {formatCurrency(value)}
            </p>
            {count !== undefined && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {count} {count === 1 ? 'conta' : 'contas'}
              </p>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0', iconStyles[variant])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {explanation && (
          <CollapsibleContent>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[11px] text-muted-foreground leading-relaxed">{explanation}</p>
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
}
