import { useState, useMemo } from 'react';
import { 
  Calculator, Users, TrendingUp, ArrowRight, DollarSign, Target, Clock, RefreshCw, Lightbulb, Briefcase, UserCheck, Shuffle, Plus, Trash2, Save,
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
import { useSimulations } from '@/hooks/useSimulations';
import { useToast } from '@/hooks/use-toast';

// ===== Simulação de Pessoas =====
interface HiringInputs {
  type: 'socio' | 'funcionario' | 'terceiro';
  prolabore: number;
  comissoesSocio: number;
  reembolsos: number;
  salario: number;
  vt: number;
  va: number;
  beneficios: number;
  fgtsPercent: number;
  inssPercent: number;
  irPercent: number;
  receitaEsperada: number;
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

interface CustomIndex {
  id: string;
  name: string;
  value: number;
}

const defaultProducts: ProductPrice[] = [
  { name: 'Consultoria Estratégica', currentPrice: 18000, adjustPercent: 0 },
  { name: 'Treinamentos', currentPrice: 8500, adjustPercent: 0 },
  { name: 'Assessoria Mensal', currentPrice: 12000, adjustPercent: 0 },
  { name: 'Software de Gestão', currentPrice: 1500, adjustPercent: 0 },
  { name: 'Diagnósticos', currentPrice: 8000, adjustPercent: 0 },
  { name: 'Workshops', currentPrice: 3000, adjustPercent: 0 },
];

const baseValues = { cash: 45230, profit: 61940, margin: 18.5, totalRevenue: 430000 };

export default function SimuladorCenarios() {
  const { toast } = useToast();
  const { saveSimulation } = useSimulations();
  const [activeTab, setActiveTab] = useState('pessoas');
  const [hiringType, setHiringType] = useState<'socio' | 'funcionario' | 'terceiro'>('funcionario');
  const [hiring, setHiring] = useState(defaultHiring);
  const [products, setProducts] = useState(defaultProducts);
  
  const [igpm, setIgpm] = useState(4.5);
  const [ipca, setIpca] = useState(3.8);
  const [inpc, setInpc] = useState(3.5);
  const [igpdi, setIgpdi] = useState(4.2);
  const [selic, setSelic] = useState(10.5);
  const [cdi, setCdi] = useState(10.4);

  const [randomMin, setRandomMin] = useState(2.0);
  const [randomMax, setRandomMax] = useState(8.0);

  const [customIndices, setCustomIndices] = useState<CustomIndex[]>([]);
  const [newIndexName, setNewIndexName] = useState('');
  const [newIndexValue, setNewIndexValue] = useState('');

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

  const priceResult = useMemo(() => {
    const totalCurrent = products.reduce((s, p) => s + p.currentPrice, 0);
    const totalNew = products.reduce((s, p) => s + p.currentPrice * (1 + p.adjustPercent / 100), 0);
    const gain = totalNew - totalCurrent;
    return { totalCurrent, totalNew, gain, profitGain: gain * 0.65, marginGain: (gain / baseValues.totalRevenue) * 100 };
  }, [products]);

  const applyIndex = (index: number) => {
    setProducts(prev => prev.map(p => ({ ...p, adjustPercent: index })));
  };

  const applyRandom = () => {
    setProducts(prev => prev.map(p => ({
      ...p,
      adjustPercent: Math.round((randomMin + Math.random() * (randomMax - randomMin)) * 100) / 100,
    })));
  };

  const addCustomIndex = () => {
    if (!newIndexName.trim() || !newIndexValue) return;
    setCustomIndices(prev => [...prev, { id: `ci-${Date.now()}`, name: newIndexName.trim(), value: parseFloat(newIndexValue) || 0 }]);
    setNewIndexName('');
    setNewIndexValue('');
  };

  const removeCustomIndex = (id: string) => {
    setCustomIndices(prev => prev.filter(ci => ci.id !== id));
  };

  const updateHiring = (key: keyof HiringInputs, value: number) => {
    setHiring(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSimulation = async () => {
    const isPersonas = activeTab === 'pessoas';
    const { error } = await saveSimulation({
      type: isPersonas ? `contratacao_${hiringType}` : 'reajuste_preco',
      description: isPersonas
        ? `Simulação de contratação: ${hiringType}`
        : `Simulação de reajuste de preços`,
      input_data: isPersonas ? { hiringType, hiring } : { products, indices: { igpm, ipca, inpc, igpdi, selic, cdi } },
      result_data: isPersonas ? hiringResult : priceResult,
    });
    if (error) {
      toast({ title: 'Erro ao salvar', description: 'Não foi possível salvar a simulação.', variant: 'destructive' });
    } else {
      toast({ title: 'Simulação salva!', description: 'A simulação foi persistida no banco de dados.' });
    }
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
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSaveSimulation}>
            <Save className="h-4 w-4 mr-1" /> Salvar Simulação
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
            <TabsTrigger value="pessoas" className="gap-1.5 text-xs"><Users className="h-3.5 w-3.5" />Simulação de Pessoas</TabsTrigger>
            <TabsTrigger value="precos" className="gap-1.5 text-xs"><TrendingUp className="h-3.5 w-3.5" />Simulação de Preços</TabsTrigger>
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
              <div className="lg:col-span-1 space-y-4">
                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium">Índices de Mercado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <NumInput label="IGPM" value={igpm} onChange={setIgpm} suffix="%" />
                    <NumInput label="IPCA" value={ipca} onChange={setIpca} suffix="%" />
                    <NumInput label="INPC" value={inpc} onChange={setInpc} suffix="%" />
                    <NumInput label="IGP-DI" value={igpdi} onChange={setIgpdi} suffix="%" />
                    <NumInput label="Selic" value={selic} onChange={setSelic} suffix="%" />
                    <NumInput label="CDI" value={cdi} onChange={setCdi} suffix="%" />
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => applyIndex(igpm)}>Aplicar IGPM</Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => applyIndex(ipca)}>Aplicar IPCA</Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => applyIndex(inpc)}>Aplicar INPC</Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => applyIndex(igpdi)}>Aplicar IGP-DI</Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => applyIndex(selic)}>Aplicar Selic</Button>
                      <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => applyIndex(cdi)}>Aplicar CDI</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                      <Shuffle className="h-3.5 w-3.5" /> Valores Aleatórios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <NumInput label="Mínimo %" value={randomMin} onChange={setRandomMin} suffix="%" />
                      <NumInput label="Máximo %" value={randomMax} onChange={setRandomMax} suffix="%" />
                    </div>
                    <Button size="sm" variant="outline" className="w-full h-7 text-[10px]" onClick={applyRandom}>
                      <Shuffle className="h-3 w-3 mr-1" /> Aplicar Aleatório
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-medium">Criar Índice Personalizado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Nome do Índice</Label>
                      <Input
                        value={newIndexName}
                        onChange={(e) => setNewIndexName(e.target.value)}
                        className="h-8 text-xs"
                        placeholder="Ex: Reajuste Contratual"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px]">Percentual (%)</Label>
                      <Input
                        type="number"
                        value={newIndexValue}
                        onChange={(e) => setNewIndexValue(e.target.value)}
                        className="h-8 text-xs"
                        placeholder="0"
                      />
                    </div>
                    <Button size="sm" className="w-full h-7 text-[10px]" onClick={addCustomIndex} disabled={!newIndexName.trim() || !newIndexValue}>
                      <Plus className="h-3 w-3 mr-1" /> Adicionar Índice
                    </Button>

                    {customIndices.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-border">
                        {customIndices.map((ci) => (
                          <div key={ci.id} className="flex items-center justify-between gap-1 text-xs bg-muted/30 rounded px-2 py-1.5">
                            <span className="text-foreground font-medium truncate">{ci.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <Badge variant="secondary" className="text-[10px]">{ci.value}%</Badge>
                              <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => applyIndex(ci.value)}>
                                <TrendingUp className="h-3 w-3 text-primary" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-5 w-5 p-0" onClick={() => removeCustomIndex(ci.id)}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

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
                      <tfoot>
                        <tr className="bg-muted/30">
                          <td className="py-1.5 px-2 font-bold text-foreground">Total</td>
                          <td className="py-1.5 px-2 text-right font-medium text-muted-foreground">{formatCurrency(priceResult.totalCurrent)}</td>
                          <td></td>
                          <td className="py-1.5 px-2 text-right font-bold text-primary">{formatCurrency(priceResult.totalNew)}</td>
                        </tr>
                      </tfoot>
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
        </Tabs>
      </div>
    </MainLayout>
  );
}
