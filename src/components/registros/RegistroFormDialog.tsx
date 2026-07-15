import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { categories, subcategories, costCenters } from '@/data/mockData';
import { useLancamentos } from '@/hooks/useLancamentos';
import { useCadastros } from '@/hooks/useCadastros';
import { cn } from '@/lib/utils';

const entradaCategories = categories.filter((c) =>
  ['Receita de Serviços', 'Consultoria', 'Treinamentos', 'Workshops', 'Palestras'].includes(c)
);
const saidaCategories = categories.filter((c) =>
  ['Despesas Administrativas', 'Despesas com Pessoal', 'Marketing', 'Tecnologia', 'Impostos', 'Outros'].includes(c)
);

const paymentMethods = ['Boleto', 'Transferência', 'PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Débito Automático'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function RegistroFormDialog() {
  const { toast } = useToast();
  const { addLancamento } = useLancamentos();
  const { cadastros } = useCadastros();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'entrada' | 'saida'>('entrada');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const clientesList = cadastros.filter((c) => c.tipo === 'cliente');
  const fornecedoresList = cadastros.filter((c) => c.tipo === 'fornecedor');

  // Entrada
  const [nfNumero, setNfNumero] = useState('');
  const [nfSerie, setNfSerie] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [dataVencimentoE, setDataVencimentoE] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [descricaoE, setDescricaoE] = useState('');
  const [categoriaE, setCategoriaE] = useState('');
  const [subcategoriaE, setSubcategoriaE] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [issPercent, setIssPercent] = useState('');
  const [irrfPercent, setIrrfPercent] = useState('');
  const [centroCustoE, setCentroCustoE] = useState('');
  const [observacoesE, setObservacoesE] = useState('');

  // Saída
  const [dataPagamento, setDataPagamento] = useState('');
  const [dataVencimentoS, setDataVencimentoS] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [descricaoS, setDescricaoS] = useState('');
  const [categoriaS, setCategoriaS] = useState('');
  const [subcategoriaS, setSubcategoriaS] = useState('');
  const [valorS, setValorS] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [numDocumento, setNumDocumento] = useState('');
  const [centroCustoS, setCentroCustoS] = useState('');
  const [observacoesS, setObservacoesS] = useState('');

  const valorLiquido = useMemo(() => {
    const total = parseFloat(valorTotal) || 0;
    const iss = parseFloat(issPercent) || 0;
    const irrf = parseFloat(irrfPercent) || 0;
    return total - (total * iss) / 100 - (total * irrf) / 100;
  }, [valorTotal, issPercent, irrfPercent]);

  const subcatsE = subcategories[categoriaE] || [];
  const subcatsS = subcategories[categoriaS] || [];

  const resetForm = () => {
    setNfNumero(''); setNfSerie(''); setDataEmissao(''); setDataVencimentoE('');
    setClienteId(''); setDescricaoE(''); setCategoriaE('');
    setSubcategoriaE(''); setValorTotal(''); setIssPercent(''); setIrrfPercent('');
    setCentroCustoE(''); setObservacoesE('');
    setDataPagamento(''); setDataVencimentoS(''); setFornecedorId('');
    setDescricaoS(''); setCategoriaS(''); setSubcategoriaS('');
    setValorS(''); setFormaPagamento(''); setNumDocumento(''); setCentroCustoS('');
    setObservacoesS('');
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, boolean> = {};
    if (tab === 'entrada') {
      if (!nfNumero) errs.nfNumero = true;
      if (!dataEmissao) errs.dataEmissao = true;
      if (!dataVencimentoE) errs.dataVencimentoE = true;
      if (!clienteId) errs.clienteId = true;
      if (!descricaoE) errs.descricaoE = true;
      if (!categoriaE) errs.categoriaE = true;
      if (!valorTotal) errs.valorTotal = true;
    } else {
      if (!dataPagamento) errs.dataPagamento = true;
      if (!dataVencimentoS) errs.dataVencimentoS = true;
      if (!fornecedorId) errs.fornecedorId = true;
      if (!descricaoS) errs.descricaoS = true;
      if (!categoriaS) errs.categoriaS = true;
      if (!valorS) errs.valorS = true;
      if (!formaPagamento) errs.formaPagamento = true;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    let error;
    if (tab === 'entrada') {
      const cliente = clientesList.find((c) => c.id === clienteId);
      const res = await addLancamento({
        tipo: 'entrada',
        data: dataEmissao,
        data_vencimento: dataVencimentoE || null,
        descricao: descricaoE,
        categoria: categoriaE,
        subcategoria: subcategoriaE || null,
        valor: valorLiquido,
        centro_custo: centroCustoE || null,
        cliente_fornecedor: cliente?.nome || null,
        num_documento: nfSerie ? `${nfNumero}/${nfSerie}` : nfNumero,
        origem: 'manual',
        observacoes: observacoesE || null,
      });
      error = res.error;
    } else {
      const fornecedor = fornecedoresList.find((f) => f.id === fornecedorId);
      const res = await addLancamento({
        tipo: 'saida',
        data: dataPagamento,
        data_vencimento: dataVencimentoS || null,
        descricao: descricaoS,
        categoria: categoriaS,
        subcategoria: subcategoriaS || null,
        valor: parseFloat(valorS) || 0,
        centro_custo: centroCustoS || null,
        cliente_fornecedor: fornecedor?.nome || null,
        forma_pagamento: formaPagamento,
        num_documento: numDocumento || null,
        origem: 'manual',
        observacoes: observacoesS || null,
      });
      error = res.error;
    }

    setSaving(false);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      return;
    }

    toast({
      title: 'Registro incluído com sucesso',
      description: tab === 'entrada' ? 'Nota fiscal registrada.' : 'Pagamento de despesa registrado.',
    });
    resetForm();
    setOpen(false);
  };

  const fieldClass = (key: string) => cn(errors[key] && 'border-destructive ring-destructive');

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Incluir Registro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-card border-border">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Novo Registro</DialogTitle>
          <DialogDescription>Preencha os dados para incluir um novo lançamento</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => { setTab(v as 'entrada' | 'saida'); setErrors({}); }} className="px-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="entrada">Entrada (Nota Fiscal)</TabsTrigger>
            <TabsTrigger value="saida">Saída (Pagamento)</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[55vh] mt-4 pr-4">
            <TabsContent value="entrada" className="mt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número da NF *</Label>
                  <Input value={nfNumero} onChange={(e) => setNfNumero(e.target.value)} className={fieldClass('nfNumero')} placeholder="001234" />
                </div>
                <div className="space-y-2">
                  <Label>Série</Label>
                  <Input value={nfSerie} onChange={(e) => setNfSerie(e.target.value)} placeholder="001" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Emissão *</Label>
                  <Input type="date" value={dataEmissao} onChange={(e) => setDataEmissao(e.target.value)} className={fieldClass('dataEmissao')} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Vencimento *</Label>
                  <Input type="date" value={dataVencimentoE} onChange={(e) => setDataVencimentoE(e.target.value)} className={fieldClass('dataVencimentoE')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={clienteId} onValueChange={setClienteId}>
                  <SelectTrigger className={fieldClass('clienteId')}>
                    <SelectValue placeholder={clientesList.length ? 'Selecione' : 'Cadastre um cliente antes'} />
                  </SelectTrigger>
                  <SelectContent>
                    {clientesList.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Descrição do Serviço/Produto *</Label>
                <Textarea value={descricaoE} onChange={(e) => setDescricaoE(e.target.value)} className={fieldClass('descricaoE')} placeholder="Descreva o serviço ou produto..." rows={2} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select value={categoriaE} onValueChange={(v) => { setCategoriaE(v); setSubcategoriaE(''); }}>
                    <SelectTrigger className={fieldClass('categoriaE')}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {entradaCategories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subcategoria</Label>
                  <Select value={subcategoriaE} onValueChange={setSubcategoriaE} disabled={!subcatsE.length}>
                    <SelectTrigger>
                      <SelectValue placeholder={subcatsE.length ? 'Selecione' : '—'} />
                    </SelectTrigger>
                    <SelectContent>
                      {subcatsE.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Valor Total (R$) *</Label>
                  <Input type="number" min={0} step="0.01" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} className={fieldClass('valorTotal')} placeholder="0,00" />
                </div>
                <div className="space-y-2">
                  <Label>ISS (%)</Label>
                  <Input type="number" min={0} max={100} step="0.01" value={issPercent} onChange={(e) => setIssPercent(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>IRRF (%)</Label>
                  <Input type="number" min={0} max={100} step="0.01" value={irrfPercent} onChange={(e) => setIrrfPercent(e.target.value)} placeholder="0" />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <span className="text-sm text-muted-foreground">Valor Líquido:</span>
                <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-base px-3 py-1">
                  {formatCurrency(valorLiquido)}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Centro de Custo</Label>
                <Select value={centroCustoE} onValueChange={setCentroCustoE}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {costCenters.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={observacoesE} onChange={(e) => setObservacoesE(e.target.value)} placeholder="Observações adicionais..." rows={2} />
              </div>
            </TabsContent>

            <TabsContent value="saida" className="mt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data do Pagamento *</Label>
                  <Input type="date" value={dataPagamento} onChange={(e) => setDataPagamento(e.target.value)} className={fieldClass('dataPagamento')} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Vencimento *</Label>
                  <Input type="date" value={dataVencimentoS} onChange={(e) => setDataVencimentoS(e.target.value)} className={fieldClass('dataVencimentoS')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Fornecedor *</Label>
                <Select value={fornecedorId} onValueChange={setFornecedorId}>
                  <SelectTrigger className={fieldClass('fornecedorId')}>
                    <SelectValue placeholder={fornecedoresList.length ? 'Selecione' : 'Cadastre um fornecedor antes'} />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedoresList.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Descrição da Despesa *</Label>
                <Textarea value={descricaoS} onChange={(e) => setDescricaoS(e.target.value)} className={fieldClass('descricaoS')} placeholder="Descreva a despesa..." rows={2} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select value={categoriaS} onValueChange={(v) => { setCategoriaS(v); setSubcategoriaS(''); }}>
                    <SelectTrigger className={fieldClass('categoriaS')}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {saidaCategories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subcategoria</Label>
                  <Select value={subcategoriaS} onValueChange={setSubcategoriaS} disabled={!subcatsS.length}>
                    <SelectTrigger>
                      <SelectValue placeholder={subcatsS.length ? 'Selecione' : '—'} />
                    </SelectTrigger>
                    <SelectContent>
                      {subcatsS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor (R$) *</Label>
                  <Input type="number" min={0} step="0.01" value={valorS} onChange={(e) => setValorS(e.target.value)} className={fieldClass('valorS')} placeholder="0,00" />
                </div>
                <div className="space-y-2">
                  <Label>Forma de Pagamento *</Label>
                  <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                    <SelectTrigger className={fieldClass('formaPagamento')}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número do Documento</Label>
                  <Input value={numDocumento} onChange={(e) => setNumDocumento(e.target.value)} placeholder="Ex: 00123" />
                </div>
                <div className="space-y-2">
                  <Label>Centro de Custo</Label>
                  <Select value={centroCustoS} onValueChange={setCentroCustoS}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {costCenters.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={observacoesS} onChange={(e) => setObservacoesS(e.target.value)} placeholder="Observações adicionais..." rows={2} />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="p-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => { resetForm(); setOpen(false); }} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Registro'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
