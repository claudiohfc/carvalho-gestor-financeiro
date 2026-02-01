import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  dreData,
  generateDREInsights,
  formatCurrency,
  formatPercentage,
} from '@/data/mockAnalyticsData';
import { cn } from '@/lib/utils';

export default function DREGerencial() {
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['receita', 'custo', 'despesa', 'resultado']));

  const insights = useMemo(() => generateDREInsights(dreData), []);

  const receitaBruta = dreData.find(d => d.id === 'dre-1')!;
  const lucroLiquido = dreData.find(d => d.id === 'dre-33')!;
  const ebitda = dreData.find(d => d.id === 'dre-27')!;
  const lucroBruto = dreData.find(d => d.id === 'dre-12')!;

  const margemBruta = (lucroBruto.currentMonth / receitaBruta.currentMonth) * 100;
  const margemEbitda = (ebitda.currentMonth / receitaBruta.currentMonth) * 100;
  const margemLiquida = (lucroLiquido.currentMonth / receitaBruta.currentMonth) * 100;

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getVariation = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const getAdherence = (current: number, planned: number) => {
    if (planned === 0) return 0;
    return (current / planned) * 100;
  };

  const groupedData = useMemo(() => {
    const groups: Record<string, typeof dreData> = {
      receita: [],
      deducao: [],
      custo: [],
      despesa: [],
      resultado: [],
    };

    dreData.forEach(line => {
      groups[line.category].push(line);
    });

    return groups;
  }, []);

  const categoryLabels: Record<string, string> = {
    receita: 'Receitas',
    deducao: 'Deduções',
    custo: 'Custos',
    despesa: 'Despesas',
    resultado: 'Resultados',
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Header title="DRE Gerencial" subtitle="Demonstração de Resultado do Exercício" />
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="DRE Gerencial"
        subtitle="Demonstração de Resultado orientada à decisão"
      />

      <div className="p-8 space-y-8">
        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Bruta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(receitaBruta.currentMonth)}
              </p>
              <div className="mt-1 flex items-center gap-2">
                {getVariation(receitaBruta.currentMonth, receitaBruta.previousMonth) >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={cn(
                  'text-sm',
                  getVariation(receitaBruta.currentMonth, receitaBruta.previousMonth) >= 0 
                    ? 'text-success' : 'text-destructive'
                )}>
                  {getVariation(receitaBruta.currentMonth, receitaBruta.previousMonth).toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">vs anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Margem Bruta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {margemBruta.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Lucro Bruto: {formatCurrency(lucroBruto.currentMonth)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                EBITDA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn(
                'text-2xl font-bold',
                ebitda.currentMonth >= 0 ? 'text-success' : 'text-destructive'
              )}>
                {formatCurrency(ebitda.currentMonth)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Margem EBITDA: {margemEbitda.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className={cn(
            'border-2',
            lucroLiquido.currentMonth >= 0 
              ? 'bg-success/5 border-success/30' 
              : 'bg-destructive/5 border-destructive/30'
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lucro Líquido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={cn(
                'text-2xl font-bold',
                lucroLiquido.currentMonth >= 0 ? 'text-success' : 'text-destructive'
              )}>
                {formatCurrency(lucroLiquido.currentMonth)}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Margem Líquida: {margemLiquida.toFixed(1)}%
                </span>
                <Badge variant={margemLiquida >= 15 ? 'default' : 'destructive'}>
                  {margemLiquida >= 15 ? 'Saudável' : 'Baixa'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">
                Insights Automáticos
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {insights.map((insight) => {
                const Icon = insight.type === 'positive' ? CheckCircle :
                            insight.type === 'negative' ? AlertTriangle :
                            insight.type === 'warning' ? AlertTriangle : Info;
                const iconColor = insight.type === 'positive' ? 'text-success' :
                                 insight.type === 'negative' ? 'text-destructive' :
                                 insight.type === 'warning' ? 'text-warning' : 'text-primary';
                
                return (
                  <div 
                    key={insight.id}
                    className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', iconColor)} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{insight.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tabela DRE */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">
                  DRE Detalhada - Comparativo
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedCategories(new Set(['receita', 'deducao', 'custo', 'despesa', 'resultado']))}
                >
                  Expandir Tudo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedCategories(new Set())}
                >
                  Recolher Tudo
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground w-[40%]">Descrição</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Mês Atual</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Mês Anterior</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Variação</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Planejado</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Aderência</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedData).map(([category, lines]) => {
                    const isExpanded = expandedCategories.has(category);
                    
                    return (
                      <React.Fragment key={category}>
                        {/* Category Header */}
                        <tr 
                          className="bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleCategory(category)}
                        >
                          <td colSpan={6} className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-sm font-semibold text-foreground">
                                {categoryLabels[category]}
                              </span>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Lines */}
                        {isExpanded && lines.map((line) => {
                          const variation = getVariation(line.currentMonth, line.previousMonth);
                          const adherence = getAdherence(line.currentMonth, line.planned);
                          const isNegative = line.currentMonth < 0;
                          
                          return (
                            <tr 
                              key={line.id}
                              className={cn(
                                'border-b border-border/30 transition-colors',
                                line.isTotal 
                                  ? 'bg-muted/20 font-semibold' 
                                  : 'hover:bg-muted/10'
                              )}
                            >
                              <td className={cn(
                                'py-2.5 px-4 text-sm',
                                line.level === 2 && 'pl-8',
                                line.level === 3 && 'pl-12',
                                line.isTotal ? 'font-semibold text-foreground' : 'text-muted-foreground'
                              )}>
                                {line.description}
                              </td>
                              <td className={cn(
                                'py-2.5 px-4 text-sm text-right tabular-nums',
                                line.isTotal ? 'font-semibold' : '',
                                isNegative ? 'text-destructive' : 'text-foreground'
                              )}>
                                {formatCurrency(Math.abs(line.currentMonth))}
                                {isNegative && !line.isTotal && <span className="text-muted-foreground ml-1">(−)</span>}
                              </td>
                              <td className="py-2.5 px-4 text-sm text-right text-muted-foreground tabular-nums">
                                {formatCurrency(Math.abs(line.previousMonth))}
                              </td>
                              <td className="py-2.5 px-4 text-sm text-right">
                                <span className={cn(
                                  'inline-flex items-center gap-1',
                                  // Para custos e despesas, variação positiva é ruim
                                  (category === 'custo' || category === 'despesa' || category === 'deducao')
                                    ? (variation > 0 ? 'text-destructive' : 'text-success')
                                    : (variation >= 0 ? 'text-success' : 'text-destructive')
                                )}>
                                  {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-sm text-right text-muted-foreground tabular-nums">
                                {formatCurrency(Math.abs(line.planned))}
                              </td>
                              <td className="py-2.5 px-4 text-sm text-right">
                                <Badge 
                                  variant={
                                    adherence >= 95 ? 'default' :
                                    adherence >= 80 ? 'secondary' : 'destructive'
                                  }
                                  className="text-xs"
                                >
                                  {adherence.toFixed(0)}%
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legenda */}
        <Card className="border-border bg-muted/20">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success"></div>
                <span>Aderência ≥ 95%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground"></div>
                <span>Aderência 80-95%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive"></div>
                <span>Aderência &lt; 80%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-destructive">(−)</span>
                <span>Valor de dedução/custo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
