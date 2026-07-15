import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { categories, subcategories, costCenters } from '@/data/mockData';
import { useLancamentos } from '@/hooks/useLancamentos';
import { useCadastros } from '@/hooks/useCadastros';
import { cn } from '@/lib/utils';

export default function Lancamentos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addLancamento } = useLancamentos();
  const { cadastros } = useCadastros();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    date: new Date().toISOString().split('T')[0],
    value: '',
    category: '',
    subcategory: '',
    description: '',
    clientOrSupplier: '',
    costCenter: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableSubcategories = formData.category
    ? subcategories[formData.category] || []
    : [];

  const availableClients =
    formData.type === 'entrada'
      ? cadastros.filter((c) => c.tipo === 'cliente')
      : cadastros.filter((c) => c.tipo === 'fornecedor');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.type) newErrors.type = 'Selecione o tipo';
    if (!formData.date) newErrors.date = 'Informe a data';
    if (!formData.value || parseFloat(formData.value) <= 0)
      newErrors.value = 'Informe um valor válido';
    if (!formData.category) newErrors.category = 'Selecione a categoria';
    if (!formData.description.trim()) newErrors.description = 'Informe a descrição';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, corrija os campos destacados.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const { error } = await addLancamento({
      tipo: formData.type as 'entrada' | 'saida',
      data: formData.date,
      descricao: formData.description.trim(),
      categoria: formData.category,
      subcategoria: formData.subcategory || null,
      valor: parseFloat(formData.value),
      centro_custo: formData.costCenter || null,
      cliente_fornecedor: formData.clientOrSupplier || null,
      observacoes: formData.notes || null,
      origem: 'manual',
    });

    setIsLoading(false);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Lançamento salvo!', description: 'O registro foi adicionado com sucesso.' });

    setFormData({
      type: '',
      date: new Date().toISOString().split('T')[0],
      value: '',
      category: '',
      subcategory: '',
      description: '',
      clientOrSupplier: '',
      costCenter: '',
      notes: '',
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <MainLayout>
      <Header title="Lançamentos" subtitle="Registrar novas entradas e saídas" />

      <div className="p-8">
        <Card className="glass-card border-border max-w-3xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Novo Lançamento</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/registros')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className={cn('bg-background border-border', errors.type && 'border-destructive')}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={cn('bg-background border-border', errors.date && 'border-destructive')}
                  />
                  {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor (R$) *</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className={cn('bg-background border-border', errors.value && 'border-destructive')}
                  />
                  {errors.value && <p className="text-xs text-destructive">{errors.value}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value, subcategory: '' })}
                  >
                    <SelectTrigger className={cn('bg-background border-border', errors.category && 'border-destructive')}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategoria</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                    disabled={!formData.category}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {availableSubcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costCenter">Centro de Custo</Label>
                  <Select
                    value={formData.costCenter}
                    onValueChange={(value) => setFormData({ ...formData, costCenter: value })}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {costCenters.map((center) => (
                        <SelectItem key={center} value={center}>{center}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="clientOrSupplier">
                    {formData.type === 'entrada' ? 'Cliente' : 'Fornecedor'}
                  </Label>
                  <Select
                    value={formData.clientOrSupplier}
                    onValueChange={(value) => setFormData({ ...formData, clientOrSupplier: value })}
                    disabled={!formData.type}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {availableClients.map((item) => (
                        <SelectItem key={item.id} value={item.nome}>{item.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Input
                    id="description"
                    placeholder="Descreva o lançamento"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={cn('bg-background border-border', errors.description && 'border-destructive')}
                  />
                  {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observações adicionais..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-background border-border min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Pressione <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl</kbd> +{' '}
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> para salvar
                </p>
                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Salvando...
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Lançamento
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
