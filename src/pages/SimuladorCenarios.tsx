import { useState, useMemo } from 'react';
import { 
  Calculator, 
  Users, 
  TrendingUp, 
  UserMinus,
  ArrowRight,
  DollarSign,
  Target,
  Clock,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  scenarioTemplates,
  calculateScenario,
  formatCurrency,
  formatPercentage,
} from '@/data/mockAnalyticsData';
import { cn } from '@/lib/utils';

export default function SimuladorCenarios() {
  const [activeScenario, setActiveScenario] = useState(scenarioTemplates[0].id);
  const [inputValues, setInputValues] = useState<Record<string, Record<string, number>>>({});

  const currentScenario = scenarioTemplates.find(s => s.id === activeScenario)!;

  const getInputValue = (scenarioId: string, key: string, defaultValue: number) => {
    return inputValues[scenarioId]?.[key] ?? defaultValue;
  };

  const setInputValue = (scenarioId: string, key: string, value: number) => {
    setInputValues(prev => ({
      ...prev,
      [scenarioId]: {
        ...prev[scenarioId],
        [key]: value,
      },
    }));
  };

  const resetInputs = (scenarioId: string) => {
    const scenario = scenarioTemplates.find(s => s.id === scenarioId);
    if (scenario) {
      const defaults: Record<string, number> = {};
      scenario.inputs.forEach(input => {
        defaults[input.key] = input.defaultValue;
      });
      setInputValues(prev => ({
        ...prev,
        [scenarioId]: defaults,
      }));
    }
  };

  const currentInputs = useMemo(() => {
    const inputs: Record<string, number> = {};
    currentScenario.inputs.forEach(input => {
      inputs[input.key] = getInputValue(currentScenario.id, input.key, input.defaultValue);
    });
    return inputs;
  }, [currentScenario, inputValues]);

  const result = useMemo(() => {
    return calculateScenario(currentScenario, currentInputs);
  }, [currentScenario, currentInputs]);

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'contratacao': return Users;
      case 'preco': return TrendingUp;
      case 'cliente': return UserMinus;
      default: return Calculator;
    }
  };

  const formatInputValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return value.toLocaleString('pt-BR');
      case 'percentage':
        return value.toString();
      default:
        return value.toString();
    }
  };

  const parseInputValue = (value: string, type: string) => {
    const cleaned = value.replace(/[^\d,.]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  // Valores base para comparação
  const baseValues = {
    cash: 45230,
    profit: 61940,
    margin: 18.5,
  };

  return (
    <MainLayout>
      <Header
        title="Simulador de Cenários"
        subtitle="Simule decisões estratégicas sem risco operacional"
      />

      <div className="p-8 space-y-8">
        {/* Seletor de Cenário */}
        <Tabs value={activeScenario} onValueChange={setActiveScenario}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            {scenarioTemplates.map((scenario) => {
              const Icon = getScenarioIcon(scenario.type);
              return (
                <TabsTrigger 
                  key={scenario.id} 
                  value={scenario.id}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{scenario.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {scenarioTemplates.map((scenario) => (
            <TabsContent key={scenario.id} value={scenario.id} className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Painel de Inputs */}
                <Card className="lg:col-span-1 border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const Icon = getScenarioIcon(scenario.type);
                          return <Icon className="h-5 w-5 text-primary" />;
                        })()}
                        <CardTitle className="text-base">{scenario.name}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => resetInputs(scenario.id)}
                        title="Resetar valores"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {scenario.inputs.map((input) => (
                      <div key={input.key} className="space-y-2">
                        <Label htmlFor={input.key} className="text-sm">
                          {input.label}
                          {input.type === 'percentage' && ' (%)'}
                        </Label>
                        <div className="relative">
                          {input.type === 'currency' && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              R$
                            </span>
                          )}
                          <Input
                            id={input.key}
                            type="text"
                            value={formatInputValue(
                              getInputValue(scenario.id, input.key, input.defaultValue),
                              input.type
                            )}
                            onChange={(e) => setInputValue(
                              scenario.id,
                              input.key,
                              parseInputValue(e.target.value, input.type)
                            )}
                            className={cn(
                              input.type === 'currency' && 'pl-9'
                            )}
                          />
                          {input.type === 'percentage' && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              %
                            </span>
                          )}
                        </div>
                        {input.min !== undefined && input.max !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            Faixa: {input.type === 'currency' ? formatCurrency(input.min) : input.min} 
                            {' '}-{' '}
                            {input.type === 'currency' ? formatCurrency(input.max) : input.max}
                            {input.type === 'percentage' && '%'}
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Painel de Resultados */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Comparativo Antes x Depois */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Antes */}
                    <Card className="border-border bg-muted/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Situação Atual
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Caixa</span>
                          <span className="text-sm font-medium text-foreground">
                            {formatCurrency(baseValues.cash)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Lucro Mensal</span>
                          <span className="text-sm font-medium text-foreground">
                            {formatCurrency(baseValues.profit)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Margem</span>
                          <span className="text-sm font-medium text-foreground">
                            {baseValues.margin}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Depois */}
                    <Card className={cn(
                      'border-2',
                      result.cashImpact >= 0 
                        ? 'border-success/50 bg-success/5' 
                        : 'border-destructive/50 bg-destructive/5'
                    )}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Após Cenário
                          </CardTitle>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Caixa Projetado</span>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'text-sm font-medium',
                              result.cashImpact >= 0 ? 'text-success' : 'text-destructive'
                            )}>
                              {formatCurrency(baseValues.cash + result.cashImpact)}
                            </span>
                            <Badge variant={result.cashImpact >= 0 ? 'default' : 'destructive'}>
                              {result.cashImpact >= 0 ? '+' : ''}{formatCurrency(result.cashImpact)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Lucro Mensal</span>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'text-sm font-medium',
                              result.profitImpact >= 0 ? 'text-success' : 'text-destructive'
                            )}>
                              {formatCurrency(baseValues.profit + result.profitImpact)}
                            </span>
                            <Badge variant={result.profitImpact >= 0 ? 'default' : 'destructive'}>
                              {result.profitImpact >= 0 ? '+' : ''}{formatCurrency(result.profitImpact)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Margem</span>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'text-sm font-medium',
                              result.marginImpact >= 0 ? 'text-success' : 'text-destructive'
                            )}>
                              {(baseValues.margin + result.marginImpact).toFixed(1)}%
                            </span>
                            <Badge variant={result.marginImpact >= 0 ? 'default' : 'destructive'}>
                              {result.marginImpact >= 0 ? '+' : ''}{result.marginImpact.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cards de Impacto */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-border">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-lg',
                            result.cashImpact >= 0 ? 'bg-success/10' : 'bg-destructive/10'
                          )}>
                            <DollarSign className={cn(
                              'h-6 w-6',
                              result.cashImpact >= 0 ? 'text-success' : 'text-destructive'
                            )} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Impacto no Caixa</p>
                            <p className={cn(
                              'text-xl font-bold',
                              result.cashImpact >= 0 ? 'text-success' : 'text-destructive'
                            )}>
                              {result.cashImpact >= 0 ? '+' : ''}{formatCurrency(result.cashImpact)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-lg',
                            result.profitImpact >= 0 ? 'bg-success/10' : 'bg-destructive/10'
                          )}>
                            <TrendingUp className={cn(
                              'h-6 w-6',
                              result.profitImpact >= 0 ? 'text-success' : 'text-destructive'
                            )} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Impacto no Lucro/Mês</p>
                            <p className={cn(
                              'text-xl font-bold',
                              result.profitImpact >= 0 ? 'text-success' : 'text-destructive'
                            )}>
                              {result.profitImpact >= 0 ? '+' : ''}{formatCurrency(result.profitImpact)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-lg',
                            result.marginImpact >= 0 ? 'bg-success/10' : 'bg-destructive/10'
                          )}>
                            <Target className={cn(
                              'h-6 w-6',
                              result.marginImpact >= 0 ? 'text-success' : 'text-destructive'
                            )} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Impacto na Margem</p>
                            <p className={cn(
                              'text-xl font-bold',
                              result.marginImpact >= 0 ? 'text-success' : 'text-destructive'
                            )}>
                              {result.marginImpact >= 0 ? '+' : ''}{result.marginImpact.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Breakeven (se aplicável) */}
                  {result.breakeven && (
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tempo para Breakeven</p>
                            <p className="text-xl font-bold text-primary">
                              {result.breakeven} {result.breakeven === 1 ? 'mês' : 'meses'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Insights do Cenário */}
                  <Card className="border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Análise do Cenário</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {scenario.type === 'contratacao' && (
                          <>
                            <p className="text-sm text-muted-foreground">
                              {result.profitImpact > 0 ? (
                                <span className="text-success">
                                  ✓ A contratação é financeiramente viável. O colaborador gerará retorno positivo
                                  {result.breakeven && ` a partir do ${result.breakeven}º mês`}.
                                </span>
                              ) : (
                                <span className="text-destructive">
                                  ✗ A contratação não é viável nas condições atuais. A receita esperada não cobre os custos.
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Custo total mensal estimado: {formatCurrency(
                                currentInputs.salary * (1 + currentInputs.charges / 100) + currentInputs.benefits
                              )}
                            </p>
                          </>
                        )}
                        
                        {scenario.type === 'preco' && (
                          <>
                            <p className="text-sm text-muted-foreground">
                              {result.cashImpact > 0 ? (
                                <span className="text-success">
                                  ✓ O aumento de preços é benéfico mesmo considerando a perda estimada de clientes.
                                </span>
                              ) : (
                                <span className="text-destructive">
                                  ✗ O aumento de preços não compensa a perda de clientes estimada.
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Nova receita mensal estimada: {formatCurrency(
                                currentInputs.currentRevenue * (1 + currentInputs.increase / 100) * (1 - currentInputs.churn / 100)
                              )}
                            </p>
                          </>
                        )}
                        
                        {scenario.type === 'cliente' && (
                          <>
                            <p className="text-sm text-muted-foreground text-destructive">
                              ✗ A perda do cliente impactará negativamente o resultado. Considere estratégias de retenção.
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Perda de margem líquida: {formatCurrency(
                                currentInputs.clientRevenue - currentInputs.directCost
                              )}/mês durante {currentInputs.monthsToReplace} meses
                            </p>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
}
