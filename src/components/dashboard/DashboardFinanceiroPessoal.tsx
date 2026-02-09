import { Users, DollarSign, Award, Briefcase, Bus, Gift, Umbrella } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardFinanceiroPessoalProps {
  payrollSummary: {
    prolabore: number;
    distribuicao: number;
    comissoes: number;
    salarios: number;
    vt: number;
    decimo: number;
    ferias: number;
  };
  formatCurrency: (value: number) => string;
}

const pessoalItems = [
  { key: 'prolabore' as const, label: 'Pró-labore', icon: Users, colorClass: 'text-primary' },
  { key: 'distribuicao' as const, label: 'Distribuição de Lucros', icon: DollarSign, colorClass: 'text-success' },
  { key: 'comissoes' as const, label: 'Comissões', icon: Award, colorClass: 'text-warning' },
  { key: 'salarios' as const, label: 'Salários', icon: Briefcase, colorClass: 'text-primary' },
  { key: 'vt' as const, label: 'Vale Transporte', icon: Bus, colorClass: 'text-muted-foreground' },
  { key: 'decimo' as const, label: '13º Salário', icon: Gift, colorClass: 'text-success' },
  { key: 'ferias' as const, label: 'Férias', icon: Umbrella, colorClass: 'text-primary' },
];

export function DashboardFinanceiroPessoal({ payrollSummary, formatCurrency }: DashboardFinanceiroPessoalProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-foreground">Despesas com Pessoal</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {pessoalItems.map(({ key, label, icon: Icon, colorClass }) => (
          <Card key={key} className="bg-card border-border hover:border-primary/30 transition-all">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
                <span className="text-[11px] text-muted-foreground">{label}</span>
              </div>
              <p className="text-base font-bold text-foreground">{formatCurrency(payrollSummary[key])}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
