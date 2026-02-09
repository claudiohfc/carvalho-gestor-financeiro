import { useState } from 'react';
import { LucideIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/data/mockHomeData';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface BalanceCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  subtitle?: string;
  count?: number;
  isNegative?: boolean;
  explanation?: string;
}

export function BalanceCard({
  title,
  value,
  icon: Icon,
  subtitle,
  count,
  isNegative = false,
  explanation,
}: BalanceCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          'rounded-xl border p-4 transition-all duration-200 hover:shadow-md animate-fade-in',
          isNegative ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'
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
            <p
              className={cn(
                'mt-2 text-2xl font-bold tracking-tight',
                isNegative ? 'text-destructive' : 'text-foreground'
              )}
            >
              {formatCurrency(value)}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            )}
            {count !== undefined && (
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {count} {count === 1 ? 'compromisso' : 'compromissos'} pendentes
              </p>
            )}
          </div>
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0',
              isNegative ? 'bg-destructive/10' : 'bg-primary/10'
            )}
          >
            <Icon className={cn('h-5 w-5', isNegative ? 'text-destructive' : 'text-primary')} />
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
