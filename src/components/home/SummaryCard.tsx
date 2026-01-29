import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/data/mockHomeData';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'default' | 'success' | 'warning' | 'danger';
  count?: number;
  subtitle?: string;
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  variant,
  count,
  subtitle,
}: SummaryCardProps) {
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
    <div
      className={cn(
        'rounded-xl border p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.02] animate-fade-in',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn('mt-2 text-2xl font-semibold tracking-tight', valueStyles[variant])}>
            {formatCurrency(value)}
          </p>
          {count !== undefined && (
            <p className="mt-1 text-xs text-muted-foreground">
              {count} {count === 1 ? 'conta' : 'contas'}
            </p>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
