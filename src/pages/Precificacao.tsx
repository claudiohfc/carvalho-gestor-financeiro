import { useState, useEffect } from 'react';
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
import { formatCurrency } from '@/data/mockPricingData';
import { cn } from '@/lib/utils';
import { usePricing, ProductService } from '@/hooks/usePricing';

interface FormState {
  type: 'produto' | 'servico';
  code: string;
  category: string;
  name: string;
  description: string;
  unit_measure: string;
  fixed_costs: number;
  variable_costs: number;
  preparation_time: number;
  preparation_hour_value: number;
  labor_percent: number;
  labor_value: number;
  profit_margin: number;
  tax_type: string;
  tax_value: number;
}

const emptyForm: FormState = {
  type: 'produto', code: '', category: '', name: '', description: '', unit_measure: '',
  fixed_costs: 0, variable_costs: 0, preparation_time: 0, preparation_hour_value: 0,
  labor_percent: 0, labor_value: 0, profit_margin: 0, tax_type: 'ISS', tax_value: 0,
};

function calcPricing(form: FormState) {
  const base_cost = form.fixed_costs + form.variable_costs + (form.preparation_time * form.preparation_hour_value) + form.labor_value;
  const final_price = base_cost * (1 + form.profit_margin / 100) + form.tax_value;
  const markup = base_cost > 0 ? ((final_price - base_cost) / base_cost) * 100 : 0;
  return { base_cost, final_price: Math.round(final_price * 100) / 100, markup: Math.round(markup * 100) / 100 };
}

export default function Precificacao() {
  const { toast } = useToast();
  const { items, loading, addItem, deleteItem } = usePricing();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);

  const services = items.filter(i => i.type === 'servico');
  const products = items.filter(i => i.type === 'produto');

  const handleSubmit = async () => {
    if (!form.name || !form.code || !form.category) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha código, nome e categoria.', variant: 'destructive' });
      return;
    }
    const { base_cost, final_price, markup } = calcPricing(form);

    const { error } = await addItem({
      ...form,
      base_cost,
      final_price,
      markup,
    });

    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível salvar.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Item adicionado!', description: `${form.name} foi cadastrado com sucesso.` });
    setForm(emptyForm);
    setDialogOpen(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await deleteItem(id);
    if (!error) toast({ title: 'Item removido', description: 'O item foi excluído com sucesso.' });
  };

  const renderTable = (tableItems: ProductService[]) => (
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
          {tableItems.map(item => (
            <Collapsible key={item.id} open={expandedRow === String(item.id)} onOpenChange={(open) => setExpandedRow(open ? String(item.id) : null)} asChild>
              <>
                <CollapsibleTrigger asChild>
                  <TableRow className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell className="text-xs font-mono whitespace-nowrap">{item.code}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px] whitespace-nowrap">{item.category}</Badge></TableCell>
                    <TableCell className="text-xs font-medium whitespace-nowrap">{item.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{item.description}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{item.unit_measure}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.fixed_costs)}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.variable_costs)}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{item.preparation_time}h</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.preparation_hour_value)}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{item.labor_percent}%</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.labor_value)}</TableCell>
                    <TableCell className="text-xs text-right text-primary font-medium whitespace-nowrap">{item.profit_margin}%</TableCell>
                    <TableCell className="text-xs text-right font-medium whitespace-nowrap">{item.markup.toFixed(1)}%</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.base_cost)}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{item.tax_type || '-'}</TableCell>
                    <TableCell className="text-xs text-right whitespace-nowrap">{formatCurrency(item.tax_value)}</TableCell>
                    <TableCell className="text-xs text-right font-bold text-primary whitespace-nowrap">{formatCurrency(item.final_price)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === String(item.id) ? null : String(item.id)); }}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expandedRow === String(item.id) && "rotate-180")} />
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
                            <span className="font-semibold">{formatCurrency(item.base_cost)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-card rounded-lg px-3 py-1.5 border border-border">
                            <Percent className="h-3.5 w-3.5 text-primary" />
                            <span className="text-muted-foreground">Margem:</span>
                            <span className="font-semibold text-primary">{item.profit_margin}%</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-card rounded-lg px-3 py-1.5 border border-border">
                            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Markup:</span>
                            <span className="font-semibold">{item.markup.toFixed(1)}%</span>
                          </div>
                          {item.tax_type && (
                            <div className="flex items-center gap-1.5 bg-card rounded-lg px-3 py-1.5 border border-border">
                              <span className="text-muted-foreground">{item.tax_type}:</span>
                              <span className="font-semibold">{formatCurrency(item.tax_value)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 bg-primary/10 rounded-lg px-3 py-1.5 border border-primary/30">
                            <DollarSign className="h-3.5 w-3.5 text-primary" />
                            <span className="text-primary font-medium">Preço Final:</span>
                            <span className="font-bold text-primary">{formatCurrency(item.final_price)}</span>
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
                    <Select value={form.type} onValueChange={(v: 'produto' | 'servico') => setForm({ ...form, type: v })}>
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
                    <Input className="h-9 text-xs" value={form.unit_measure} onChange={e => setForm({ ...form, unit_measure: e.target.value })} placeholder="Hora, Mês, Unidade" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Custos Fixos (R$)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.fixed_costs} onChange={e => setForm({ ...form, fixed_costs: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Custos Variáveis (R$)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.variable_costs} onChange={e => setForm({ ...form, variable_costs: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Tempo de Preparação (h)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.preparation_time} onChange={e => setForm({ ...form, preparation_time: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Valor da Hora (R$)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.preparation_hour_value} onChange={e => setForm({ ...form, preparation_hour_value: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Margem de Lucro (%)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.profit_margin} onChange={e => setForm({ ...form, profit_margin: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Mão de Obra (%)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.labor_percent} onChange={e => setForm({ ...form, labor_percent: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Mão de Obra (R$)</Label>
                    <Input className="h-9 text-xs" type="number" value={form.labor_value} onChange={e => setForm({ ...form, labor_value: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <Label className="text-xs font-medium">Impostos</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Input className="h-9 text-xs" value={form.tax_type} onChange={e => setForm({ ...form, tax_type: e.target.value })} placeholder="Tipo (ISS, ICMS...)" />
                    <Input className="h-9 text-xs" type="number" value={form.tax_value} onChange={e => setForm({ ...form, tax_value: Number(e.target.value) })} placeholder="Valor (R$)" />
                  </div>
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
