import { ReactNode, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'positive' | 'negative';
  explanation?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default',
  explanation,
}: KPICardProps) {
  const [open, setOpen] = useState(false);

  const variantClasses = {
    default: 'kpi-card',
    positive: 'kpi-card-positive',
    negative: 'kpi-card-negative',
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className={cn(variantClasses[variant], 'animate-fade-in')}>
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
            <p className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">{value}</p>
            {subtitle && <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>}
          </div>
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
              {icon}
            </div>
          )}
        </div>
        {trend && trendValue && (
          <div className={cn('mt-3 flex items-center gap-1 text-xs', trendColors[trend])}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{trendValue}</span>
          </div>
        )}
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
