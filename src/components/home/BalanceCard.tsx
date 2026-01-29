import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/data/mockHomeData';

interface BalanceCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  subtitle?: string;
  count?: number;
  isNegative?: boolean;
}

export function BalanceCard({
  title,
  value,
  icon: Icon,
  subtitle,
  count,
  isNegative = false,
}: BalanceCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-6 transition-all duration-200 hover:shadow-md animate-fade-in',
        isNegative ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          <p
            className={cn(
              'mt-3 text-3xl font-bold tracking-tight',
              isNegative ? 'text-destructive' : 'text-foreground'
            )}
          >
            {formatCurrency(value)}
          </p>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
          {count !== undefined && (
            <p className="mt-1 text-xs text-muted-foreground">
              {count} {count === 1 ? 'compromisso' : 'compromissos'} pendentes
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            isNegative ? 'bg-destructive/10' : 'bg-primary/10'
          )}
        >
          <Icon className={cn('h-6 w-6', isNegative ? 'text-destructive' : 'text-primary')} />
        </div>
      </div>
    </div>
  );
}
