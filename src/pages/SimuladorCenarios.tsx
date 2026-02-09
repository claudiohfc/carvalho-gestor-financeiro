import { useState, useMemo } from 'react';
import { 
  Calculator, Users, TrendingUp, UserMinus, ArrowRight, DollarSign, Target, Clock, RefreshCw, Lightbulb, Briefcase, UserCheck,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/data/mockAnalyticsData';
import { cn } from '@/lib/utils';

// ===== Simulação de Pessoas =====
interface HiringInputs {
  type: 'socio' | 'funcionario' | 'terceiro';
  // Sócio
  prolabore: number;
  comissoesSocio: number;
  reembolsos: number;
  // Funcionário
  salario: number;
  vt: number;
  va: number;
  beneficios: number;
  fgtsPercent: number;
  inssPercent: number;
  irPercent: number;
  receitaEsperada: number;
  // Terceiro
  retiradas: number;
  comissoesTerceiro: number;
}

const defaultHiring: HiringInputs = {
  type: 'funcionario',
  prolabore: 10000, comissoesSocio: 2000, reembolsos: 500,
  salario: 5000, vt: 450, va: 600, beneficios: 350,
  fgtsPercent: 8, inssPercent: 11, irPercent: 15, receitaEsperada: 15000,
  retiradas: 4000, comissoesTerceiro: 1500,
};

// ===== Simulação de Preços =====
interface ProductPrice {
  name: string;
  currentPrice: number;
  adjustPercent: number;
}

const defaultProducts: ProductPrice[] = [
  { name: 'Consultoria Estratégica', currentPrice: 18000, adjustPercent: 0 },
  { name: 'Treinamentos', currentPrice: 8500, adjustPercent: 0 },
  { name: 'Assessoria Mensal', currentPrice: 12000, adjustPercent: 0 },
  { name: 'Software de Gestão', currentPrice: 1500, adjustPercent: 0 },
  { name: 'Diagnósticos', currentPrice: 8000, adjustPercent: 0 },
  { name: 'Workshops', currentPrice: 3000, adjustPercent: 0 },
];

// ===== Simulação Perda Cliente =====
interface ClientLossInputs {
  clientRevenue: number;
  directCost: number;
  prospectionCost: number;
  monthsToReplace: number;
}

const defaultClientLoss: ClientLossInputs = {
  clientRevenue: 25000, directCost: 8000, prospectionCost: 5000, monthsToReplace: 3,
};

const baseValues = { cash: 45230, profit: 61940, margin: 18.5, totalRevenue: 430000 };

export default function SimuladorCenarios() {
  const [activeTab, setActiveTab] = useState('pessoas');
  const [hiringType, setHiringType] = useState<'socio' | 'funcionario' | 'terceiro'>('funcionario');
  const [hiring, setHiring] = useState(defaultHiring);
  const [products, setProducts] = useState(defaultProducts);
  const [igpm, setIgpm] = useState(4.5);
  const [ipca, setIpca] = useState(3.8);
  const [customIndex, setCustomIndex] = useState(5.0);
  const [clientLoss, setClientLoss] = useState(defaultClientLoss);

  // ===== Cálculos Pessoas =====
  const hiringResult = useMemo(() => {
    if (hiringType === 'socio') {
      const totalCost = hiring.prolabore + hiring.comissoesSocio + hiring.reembolsos;
      return { cost: totalCost, profit: -totalCost, margin: -(totalCost / baseValues.totalRevenue) * 100 };
    }
    if (hiringType === 'terceiro') {
      const totalCost = hiring.retiradas + hiring.comissoesTerceiro;
      return { cost: totalCost, profit: -totalCost, margin: -(totalCost / baseValues.totalRevenue) * 100 };
    }
    const fgts = hiring.salario * (hiring.fgtsPercent / 100);
    const inss = hiring.salario * (hiring.inssPercent / 100);
    const ir = hiring.salario * (hiring.irPercent / 100);
    const totalCost = hiring.salario + hiring.vt + hiring.va + hiring.beneficios + fgts + inss + ir;
    const monthlyProfit = hiring.receitaEsperada - totalCost;
    return { cost: totalCost, profit: monthlyProfit, margin: (monthlyProfit / baseValues.totalRevenue) * 100 };
  }, [hiring, hiringType]);

  // ===== Cálculos Preços =====
  const priceResult = useMemo(() => {
    const totalCurrent = products.reduce((s, p) => s + p.currentPrice, 0);
    const totalNew = products.reduce((s, p) => s + p.currentPrice * (1 + p.adjustPercent / 100), 0);
    const gain = totalNew - totalCurrent;
    return { totalCurrent, totalNew, gain, profitGain: gain * 0.65, marginGain: (gain / baseValues.totalRevenue) * 100 };
  }, [products]);

  // ===== Cálculos Perda =====
  const lossResult = useMemo(() => {
    const monthlyMarginLoss = clientLoss.clientRevenue - clientLoss.directCost;
    const totalLoss = monthlyMarginLoss * clientLoss.monthsToReplace + clientLoss.prospectionCost;
    const revenuePercent = (clientLoss.clientRevenue / baseValues.totalRevenue) * 100;
    const clientsNeeded = Math.ceil(clientLoss.clientRevenue / (baseValues.totalRevenue / 12));
    const recoveryMonths = clientLoss.monthsToReplace + Math.ceil(clientLoss.prospectionCost / monthlyMarginLoss);
    return {
      monthlyMarginLoss, totalLoss, revenuePercent, clientsNeeded, recoveryMonths,
      cash3m: -monthlyMarginLoss * 3, cash6m: -monthlyMarginLoss * 6, cash12m: -monthlyMarginLoss * 12,
    };
  }, [clientLoss]);

  const applyIndex = (index: number) => {
    setProducts(prev => prev.map(p => ({ ...p, adjustPercent: index })));
  };

  const updateHiring = (key: keyof HiringInputs, value: number) => {
    setHiring(prev => ({ ...prev, [key]: value }));
  };

  const NumInput = ({ label, value, onChange, prefix, suffix }: { label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string }) => (
    <div className="space-y-1">
      <Label className="text-[11px]">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">{prefix}</span>}
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={cn('h-8 text-xs', prefix && 'pl-7', suffix && 'pr-7')}
        />
        {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );

  const ImpactCard = ({ label, value, isPositive }: { label: string; value: string; isPositive: boolean }) => (
    <Card className="border-border">
      <CardContent className="pt-3 pb-3">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className={cn('text-lg font-bold', isPositive ? 'text-success' : 'text-destructive')}>{value}</p>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <Header title="Simulador de Cenários" subtitle="Simule decisões estratégicas sem risco operacional" />
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
            <TabsTrigger value="pessoas" className="gap-1.5 text-xs"><Users className="h-3.5 w-3.5" />Simulação de Pessoas</TabsTrigger>
            <TabsTrigger value="precos" className="gap-1.5 text-xs"><TrendingUp className="h-3.5 w-3.5" />Simulação de Preços</TabsTrigger>
            <TabsTrigger value="cliente" className="gap-1.5 text-xs"><UserMinus className="h-3.5 w-3.5" />Perda de Cliente</TabsTrigger>
          </TabsList>

          {/* ===== PESSOAS ===== */}
          <TabsContent value="pessoas" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-1 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium">Tipo de Contratação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Tabs value={hiringType} onValueChange={(v) => setHiringType(v as any)}>
                    <TabsList className="grid grid-cols-3 h-8">
                      <TabsTrigger value="socio" className="text-[10px] h-6">Sócio</TabsTrigger>
                      <TabsTrigger value="funcionario" className="text-[10px] h-6">Funcionário</TabsTrigger>
                      <TabsTrigger value="terceiro" className="text-[10px] h-6">Terceiro</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {hiringType === 'socio' && (
                    <div className="space-y-2">
                      <NumInput label="Pró-labore" value={hiring.prolabore} onChange={(v) => updateHiring('prolabore', v)} prefix="R$" />
                      <NumInput label="Comissões" value={hiring.comissoesSocio} onChange={(v) => updateHiring('comissoesSocio', v)} prefix="R$" />
                      <NumInput label="Reembolsos" value={hiring.reembolsos} onChange={(v) => updateHiring('reembolsos', v)} prefix="R$" />
                    </div>
                  )}

                  {hiringType === 'funcionario' && (
                    <div className="space-y-2">
                      <NumInput label="Salário" value={hiring.salario} onChange={(v) => updateHiring('salario', v)} prefix="R$" />
                      <NumInput label="Vale Transporte" value={hiring.vt} onChange={(v) => updateHiring('vt', v)} prefix="R$" />
                      <NumInput label="Vale Alimentação" value={hiring.va} onChange={(v) => updateHiring('va', v)} prefix="R$" />
                      <NumInput label="Benefícios" value={hiring.beneficios} onChange={(v) => updateHiring('beneficios', v)} prefix="R$" />
                      <NumInput label="FGTS" value={hiring.fgtsPercent} onChange={(v) => updateHiring('fgtsPercent', v)} suffix="%" />
                      <NumInput label="INSS" value={hiring.inssPercent} onChange={(v) => updateHiring('inssPercent', v)} suffix="%" />
                      <NumInput label="IR" value={hiring.irPercent} onChange={(v) => updateHiring('irPercent', v)} suffix="%" />
                      <NumInput label="Receita Esperada/Mês" value={hiring.receitaEsperada} onChange={(v) => updateHiring('receitaEsperada', v)} prefix="R$" />
                    </div>
                  )}

                  {hiringType === 'terceiro' && (
                    <div className="space-y-2">
                      <NumInput label="Retiradas" value={hiring.retiradas} onChange={(v) => updateHiring('retiradas', v)} prefix="R$" />
                      <NumInput label="Comissões" value={hiring.comissoesTerceiro} onChange={(v) => updateHiring('comissoesTerceiro', v)} prefix="R$" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="border-border bg-muted/20">
                    <CardContent className="pt-3 pb-3 space-y-2">
                      <p className="text-[11px] font-medium text-muted-foreground">Situação Atual</p>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Caixa</span><span className="text-foreground font-medium">{formatCurrency(baseValues.cash)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Lucro Mensal</span><span className="text-foreground font-medium">{formatCurrency(baseValues.profit)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Margem</span><span className="text-foreground font-medium">{baseValues.margin}%</span></div>
                    </CardContent>
                  </Card>
                  <Card className={cn('border-2', hiringResult.profit >= 0 ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5')}>
                    <CardContent className="pt-3 pb-3 space-y-2">
                      <p className="text-[11px] font-medium text-muted-foreground">Após Contratação</p>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Custo Mensal</span><span className="text-destructive font-medium">{formatCurrency(hiringResult.cost)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Lucro Mensal</span><span className={cn('font-medium', hiringResult.profit >= 0 ? 'text-success' : 'text-destructive')}>{formatCurrency(baseValues.profit + hiringResult.profit)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Margem</span><span className={cn('font-medium', hiringResult.margin >= 0 ? 'text-success' : 'text-destructive')}>{(baseValues.margin + hiringResult.margin).toFixed(1)}%</span></div>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <ImpactCard label="Impacto no Caixa" value={`${hiringResult.profit >= 0 ? '+' : ''}${formatCurrency(hiringResult.profit * 12)}`} isPositive={hiringResult.profit >= 0} />
                  <ImpactCard label="Impacto no Lucro/Mês" value={`${hiringResult.profit >= 0 ? '+' : ''}${formatCurrency(hiringResult.profit)}`} isPositive={hiringResult.profit >= 0} />
                  <ImpactCard label="Impacto na Margem" value={`${hiringResult.margin >= 0 ? '+' : ''}${hiringResult.margin.toFixed(1)}%`} isPositive={hiringResult.margin >= 0} />
                </div>
                {hiringType === 'funcionario' && (
                  <Card className="border-border">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium">Análise</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {hiringResult.profit > 0 ? (
                          <span className="text-success">✓ A contratação é viável. Retorno positivo de {formatCurrency(hiringResult.profit)}/mês após custos totais de {formatCurrency(hiringResult.cost)}/mês.</span>
                        ) : (
                          <span className="text-destructive">✗ A contratação gera prejuízo de {formatCurrency(Math.abs(hiringResult.profit))}/mês. Aumente a receita esperada ou reduza custos.</span>
                        )}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ===== PREÇOS ===== */}
          <TabsContent value="precos" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-1 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium">Índices de Reajuste</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <NumInput label="IGPM" value={igpm} onChange={setIgpm} suffix="%" />
                  <NumInput label="IPCA" value={ipca} onChange={setIpca} suffix="%" />
                  <NumInput label="Índice Personalizado" value={customIndex} onChange={setCustomIndex} suffix="%" />
                  <div className="flex gap-1.5 flex-wrap">
                    <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => applyIndex(igpm)}>Aplicar IGPM</Button>
                    <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => applyIndex(ipca)}>Aplicar IPCA</Button>
                    <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => applyIndex(customIndex)}>Personalizado</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-4">
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium">Produtos e Reajustes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-1.5 px-2 text-muted-foreground font-medium">Produto</th>
                          <th className="text-right py-1.5 px-2 text-muted-foreground font-medium">Valor Atual</th>
                          <th className="text-center py-1.5 px-2 text-muted-foreground font-medium">Reajuste %</th>
                          <th className="text-right py-1.5 px-2 text-muted-foreground font-medium">Valor Final</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="py-1.5 px-2 text-foreground">{p.name}</td>
                            <td className="py-1.5 px-2 text-right text-muted-foreground">{formatCurrency(p.currentPrice)}</td>
                            <td className="py-1.5 px-2 text-center">
                              <Input
                                type="number"
                                value={p.adjustPercent}
                                onChange={(e) => {
                                  const newProducts = [...products];
                                  newProducts[i].adjustPercent = parseFloat(e.target.value) || 0;
                                  setProducts(newProducts);
                                }}
                                className="h-6 w-16 text-[11px] text-center mx-auto"
                              />
                            </td>
                            <td className="py-1.5 px-2 text-right font-medium text-foreground">
                              {formatCurrency(p.currentPrice * (1 + p.adjustPercent / 100))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-3 gap-3">
                  <ImpactCard label="Ganho de Receita" value={`+${formatCurrency(priceResult.gain)}`} isPositive={priceResult.gain > 0} />
                  <ImpactCard label="Impacto no Lucro" value={`+${formatCurrency(priceResult.profitGain)}`} isPositive={priceResult.profitGain > 0} />
                  <ImpactCard label="Impacto na Margem" value={`+${priceResult.marginGain.toFixed(1)}%`} isPositive={priceResult.marginGain > 0} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ===== PERDA CLIENTE ===== */}
          <TabsContent value="cliente" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-1 border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium">Dados do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <NumInput label="Receita Mensal do Cliente" value={clientLoss.clientRevenue} onChange={(v) => setClientLoss(p => ({ ...p, clientRevenue: v }))} prefix="R$" />
                  <NumInput label="Custo Direto Associado" value={clientLoss.directCost} onChange={(v) => setClientLoss(p => ({ ...p, directCost: v }))} prefix="R$" />
                  <NumInput label="Custo de Prospecção (Novo)" value={clientLoss.prospectionCost} onChange={(v) => setClientLoss(p => ({ ...p, prospectionCost: v }))} prefix="R$" />
                  <NumInput label="Meses para Substituir" value={clientLoss.monthsToReplace} onChange={(v) => setClientLoss(p => ({ ...p, monthsToReplace: v }))} />
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="border-border bg-muted/20">
                    <CardContent className="pt-3 pb-3 space-y-2">
                      <p className="text-[11px] font-medium text-muted-foreground">Situação Atual</p>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Receita Mensal</span><span className="font-medium">{formatCurrency(baseValues.totalRevenue)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Lucro Mensal</span><span className="font-medium">{formatCurrency(baseValues.profit)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Margem</span><span className="font-medium">{baseValues.margin}%</span></div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-destructive/50 bg-destructive/5">
                    <CardContent className="pt-3 pb-3 space-y-2">
                      <p className="text-[11px] font-medium text-muted-foreground">Após Perda do Cliente</p>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Receita Mensal</span><span className="text-destructive font-medium">{formatCurrency(baseValues.totalRevenue - clientLoss.clientRevenue)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Lucro Mensal</span><span className="text-destructive font-medium">{formatCurrency(baseValues.profit - lossResult.monthlyMarginLoss)}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">Impacto Total</span><span className="text-destructive font-medium">{formatCurrency(-lossResult.totalLoss)}</span></div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <ImpactCard label="Impacto em 3 meses" value={formatCurrency(lossResult.cash3m)} isPositive={false} />
                  <ImpactCard label="Impacto em 6 meses" value={formatCurrency(lossResult.cash6m)} isPositive={false} />
                  <ImpactCard label="Impacto em 12 meses" value={formatCurrency(lossResult.cash12m)} isPositive={false} />
                </div>

                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-destructive" />
                      <span className="text-xs font-medium text-foreground">Análise de Impacto</span>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-muted-foreground">
                        • Ao perder este cliente, sua receita mensal cairia <span className="text-destructive font-medium">{lossResult.revenuePercent.toFixed(1)}%</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        • Perda de margem de contribuição: <span className="text-destructive font-medium">{formatCurrency(lossResult.monthlyMarginLoss)}/mês</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        • Você precisaria de aproximadamente <span className="text-primary font-medium">{lossResult.clientsNeeded} novos clientes</span> para compensar
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        • O tempo estimado para recuperação é de <span className="text-warning font-medium">{lossResult.recoveryMonths} meses</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
