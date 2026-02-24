import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Plus, ChevronDown, Eye, Pencil, Trash2, Tag, DollarSign, Percent } from 'lucide-react';
import { PricingItem, mockServices, mockProducts, formatCurrency } from '@/data/mockPricingData';
import { cn } from '@/lib/utils';

const emptyForm: Omit<PricingItem, 'id' | 'markup' | 'totalTax' | 'finalPrice'> = {
  type: 'produto', code: '', category: '', name: '', description: '', unit: '',
  fixedCosts: 0, variableCosts: 0, prepTime: 0, hourRate: 0,
  laborPercent: 0, laborValue: 0, profitMargin: 0, baseValue: 0,
  taxes: [{ type: 'ISS', value: 0 }],
};

export default function Precificacao() {
  const { toast } = useToast();
  const [services, setServices] = useState<PricingItem[]>(mockServices);
  const [products, setProducts] = useState<PricingItem[]>(mockProducts);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formType, setFormType] = useState<'produto' | 'servico'>('produto');
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = () => {
    if (!form.name || !form.code || !form.category) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha código, nome e categoria.', variant: 'destructive' });
      return;
    }
    const baseValue = form.fixedCosts + form.variableCosts + (form.prepTime * form.hourRate) + form.laborValue;
    const totalTax = form.taxes.reduce((s, t) => s + t.value, 0);
    const finalPrice = baseValue * (1 + form.profitMargin / 100) + totalTax;
    const markup = baseValue > 0 ? ((finalPrice - baseValue) / baseValue) * 100 : 0;

    const newItem: PricingItem = {
      ...form, id: `new-${Date.now()}`, type: formType,
      baseValue, markup: Math.round(markup * 100) / 100, totalTax, finalPrice: Math.round(finalPrice * 100) / 100,
    };

    if (formType === 'servico') setServices(prev => [...prev, newItem]);
    else setProducts(prev => [...prev, newItem]);

    toast({ title: 'Item adicionado!', description: `${newItem.name} foi cadastrado com sucesso.` });
    setForm(emptyForm);
    setDialogOpen(false);
  };

  const handleDelete = (id: string, type: 'produto' | 'servico') => {
    if (type === 'servico') setServices(prev => prev.filter(s => s.id !== id));
    else setProducts(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Item removido', description: 'O item foi excluído com sucesso.' });
  };

  const renderTable = (items: PricingItem[]) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs whitespace-nowrap">Código</TableHead>
            <TableHead className="text-xs whitespace-nowrap">Categoria</TableHead>
            <TableHead className="text-xs whitespace-nowrap">Nome</TableHead>
            <TableHead className="text-xs whitespace-nowrap">Descrição</TableHead>
            <TableHead className="text-xs whitespace-nowrap">Unidade</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">C. Fixos</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">C. Variáveis</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">Tempo Prep.</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">Valor Hora</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">M.O. (%)</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">M.O. (R$)</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">Margem</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">Markup</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">Custo Base</TableHead>
            <TableHead className="text-xs whitespace-nowrap">Impostos</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap">Vlr Imposto</TableHead>
            <TableHead className="text-xs text-right whitespace-nowrap font-semibold">Preço Final</TableHead>
            <TableHead className="text-xs text-center whitespace-nowrap">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <Collapsible key={item.id} open={expandedRow === item.id} onOpenChange={(open) => setExpandedRow(open ? item.id : null)} asChild>
              <>
                <CollapsibleTrigger asChild>
                  <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell className="text-xs font-mono whitespace-nowrap">{item.code}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px] whitespace-nowrap">{item.category}</Badge></TableCell>
                    <TableCell className="text-xs font-medium whitespace-nowrap">{item.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{item.description}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{item.unit}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.fixedCosts)}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.variableCosts)}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{item.prepTime}h</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.hourRate)}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{item.laborPercent}%</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.laborValue)}</TableCell>
                    <TableCell className="text-xs text-right text-primary font-medium whitespace-nowrap">{item.profitMargin}%</TableCell>
                    <TableCell className="text-xs text-right font-medium whitespace-nowrap">{item.markup.toFixed(1)}%</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.baseValue)}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{item.taxes.map(t => t.type).join(', ')}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.totalTax)}</TableCell>
                    <TableCell className="text-xs text-right font-bold text-primary whitespace-nowrap">{formatCurrency(item.finalPrice)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === item.id ? null : item.id); }}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.type); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expandedRow === item.id && "rotate-180")} />
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <TableRow className="bg-muted/20">
                    <TableCell colSpan={18} className="p-4">
                      <div className="text-xs">
                        <span className="text-muted-foreground font-medium">Composição do Preço:</span>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center gap-1.5 bg-card rounded-lg px-3 py-1.5 border border-border">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Custo Base:</span>
                            <span className="font-semibold">{formatCurrency(item.baseValue)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-card rounded-lg px-3 py-1.5 border border-border">
                            <Percent className="h-3.5 w-3.5 text-primary" />
                            <span className="text-muted-foreground">Margem:</span>
                            <span className="font-semibold text-primary">{item.profitMargin}%</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-card rounded-lg px-3 py-1.5 border border-border">
                            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Markup:</span>
                            <span className="font-semibold">{item.markup.toFixed(1)}%</span>
                          </div>
                          {item.taxes.map((t, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-card rounded-lg px-3 py-1.5 border border-border">
                              <span className="text-muted-foreground">{t.type}:</span>
                              <span className="font-semibold">{formatCurrency(t.value)}</span>
                            </div>
                          ))}
                          <div className="flex items-center gap-1.5 bg-primary/10 rounded-lg px-3 py-1.5 border border-primary/30">
                            <DollarSign className="h-3.5 w-3.5 text-primary" />
                            <span className="text-primary font-medium">Preço Final:</span>
                            <span className="font-bold text-primary">{formatCurrency(item.finalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <MainLayout>
      <Header title="Precificação de Produtos e Serviços" subtitle="Composição completa de preços com custos, margens e impostos" />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Item</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Tipo</Label>
                    <Select value={formType} onValueChange={(v: 'produto' | 'servico') => setFormType(v)}>
                      <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="produto">Produto</SelectItem>
                        <SelectItem value="servico">Serviço</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Código *</Label>
                    <Input className="h-9 text-xs" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="PRD-005" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome *</Label>
                    <Input className="h-9 text-xs" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Categoria *</Label>
                    <Input className="h-9 text-xs" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Descrição</Label>
                  <Textarea className="text-xs min-h-[60px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Unidade de Medida</Label>
                    <Input className="h-9 text-xs" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="Hora, Mês, Unidade" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Custos Fixos (R$)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.fixedCosts} onChange={e => setForm({ ...form, fixedCosts: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Custos Variáveis (R$)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.variableCosts} onChange={e => setForm({ ...form, variableCosts: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Tempo de Preparação (h)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.prepTime} onChange={e => setForm({ ...form, prepTime: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Valor da Hora (R$)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.hourRate} onChange={e => setForm({ ...form, hourRate: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Margem de Lucro (%)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.profitMargin} onChange={e => setForm({ ...form, profitMargin: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Mão de Obra (%)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.laborPercent} onChange={e => setForm({ ...form, laborPercent: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Mão de Obra (R$)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.laborValue} onChange={e => setForm({ ...form, laborValue: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <Label className="text-xs font-medium">Impostos</Label>
                  {form.taxes.map((tax, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3 mt-2">
                      <Input className="h-9 text-xs" value={tax.type} onChange={e => {
                        const taxes = [...form.taxes]; taxes[i].type = e.target.value; setForm({ ...form, taxes });
                      }} placeholder="Tipo (ISS, ICMS...)" />
                      <Input className="h-9 text-xs" type="number" value={tax.value} onChange={e => {
                        const taxes = [...form.taxes]; taxes[i].value = Number(e.target.value); setForm({ ...form, taxes });
                      }} placeholder="Valor (R$)" />
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setForm({ ...form, taxes: [...form.taxes, { type: '', value: 0 }] })}>
                    <Plus className="h-3 w-3 mr-1" /> Adicionar Imposto
                  </Button>
                </div>
                <Button onClick={handleSubmit} className="w-full">Cadastrar Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="servicos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="servicos">Serviços ({services.length})</TabsTrigger>
            <TabsTrigger value="produtos">Produtos ({products.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="servicos">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quadro de Serviços</CardTitle>
              </CardHeader>
              <CardContent>{renderTable(services)}</CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="produtos">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quadro de Produtos</CardTitle>
              </CardHeader>
              <CardContent>{renderTable(products)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
