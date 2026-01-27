import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  type: 'positive' | 'negative' | 'warning' | 'info';
  title: string;
  description: string;
}

export function InsightCard({ type, title, description }: InsightCardProps) {
  const configs = {
    positive: {
      icon: TrendingUp,
      borderColor: 'border-l-success',
      iconColor: 'text-success',
      bgColor: 'bg-success/5',
    },
    negative: {
      icon: TrendingDown,
      borderColor: 'border-l-destructive',
      iconColor: 'text-destructive',
      bgColor: 'bg-destructive/5',
    },
    warning: {
      icon: AlertTriangle,
      borderColor: 'border-l-warning',
      iconColor: 'text-warning',
      bgColor: 'bg-warning/5',
    },
    info: {
      icon: Info,
      borderColor: 'border-l-primary',
      iconColor: 'text-primary',
      bgColor: 'bg-primary/5',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'glass-card rounded-xl p-5 border-l-4 animate-fade-in',
        config.borderColor,
        config.bgColor
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('rounded-lg p-2', config.bgColor)}>
          <Icon className={cn('h-5 w-5', config.iconColor)} />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
