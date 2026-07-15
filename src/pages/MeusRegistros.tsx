import { useState, useMemo } from 'react';
import { Plus, Eye, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { RegistroFormDialog } from '@/components/registros/RegistroFormDialog';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/data/mockData';
import { useLancamentos, type Lancamento } from '@/hooks/useLancamentos';
import { cn } from '@/lib/utils';

export default function MeusRegistros() {
  const { toast } = useToast();
  const { lancamentos, loading, deleteLancamento } = useLancamentos();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Lancamento | null>(null);

  const filteredData = useMemo(() => {
    return lancamentos.filter((item) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        item.descricao.toLowerCase().includes(search) ||
        item.categoria.toLowerCase().includes(search);
      const matchesType = typeFilter === 'all' || item.tipo === typeFilter;
      const matchesCategory = categoryFilter === 'all' || item.categoria === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [lancamentos, searchTerm, typeFilter, categoryFilter]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr: string) => new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR');

  const handleView = (record: Lancamento) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleDelete = (record: Lancamento) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRecord) return;
    const { error } = await deleteLancamento(selectedRecord.id);
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Registro excluído', description: 'O registro foi removido com sucesso.' });
    }
    setDeleteDialogOpen(false);
    setSelectedRecord(null);
  };

  return (
    <MainLayout>
      <Header title="Meus Registros" subtitle="Todos os lançamentos financeiros" />

      <div className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] bg-card border-border">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px] bg-card border-border">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <RegistroFormDialog />
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <a href="/lancamentos">
                <Plus className="h-4 w-4 mr-2" />
                Novo Registro
              </a>
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Data</TableHead>
                <TableHead className="text-muted-foreground">Tipo</TableHead>
                <TableHead className="text-muted-foreground">Descrição</TableHead>
                <TableHead className="text-muted-foreground">Categoria</TableHead>
                <TableHead className="text-muted-foreground">Centro de Custo</TableHead>
                <TableHead className="text-muted-foreground text-right">Valor</TableHead>
                <TableHead className="text-muted-foreground text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    <Loader2 className="inline h-5 w-5 animate-spin" /> Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.slice(0, 50).map((record) => (
                  <TableRow key={record.id} className="table-row-hover border-border">
                    <TableCell className="text-foreground">{formatDate(record.data)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          record.tipo === 'entrada'
                            ? 'border-success/30 bg-success/10 text-success'
                            : 'border-destructive/30 bg-destructive/10 text-destructive'
                        )}
                      >
                        {record.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground max-w-[200px] truncate">
                      {record.descricao}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.categoria}</TableCell>
                    <TableCell className="text-muted-foreground">{record.centro_custo || '-'}</TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium',
                        record.tipo === 'entrada' ? 'text-success' : 'text-destructive'
                      )}
                    >
                      {record.tipo === 'entrada' ? '+' : '-'}
                      {formatCurrency(Number(record.valor))}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleView(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(record)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredData.length > 50 && (
          <p className="text-center text-sm text-muted-foreground">
            Mostrando 50 de {filteredData.length} registros
          </p>
        )}
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Detalhes do Registro</DialogTitle>
            <DialogDescription>Informações completas do lançamento</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDate(selectedRecord.data)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      selectedRecord.tipo === 'entrada'
                        ? 'border-success/30 bg-success/10 text-success'
                        : 'border-destructive/30 bg-destructive/10 text-destructive'
                    )}
                  >
                    {selectedRecord.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="font-medium">{selectedRecord.descricao}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium">{selectedRecord.categoria}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subcategoria</p>
                  <p className="font-medium">{selectedRecord.subcategoria || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Centro de Custo</p>
                  <p className="font-medium">{selectedRecord.centro_custo || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p
                    className={cn(
                      'font-semibold text-lg',
                      selectedRecord.tipo === 'entrada' ? 'text-success' : 'text-destructive'
                    )}
                  >
                    {formatCurrency(Number(selectedRecord.valor))}
                  </p>
                </div>
                {selectedRecord.cliente_fornecedor && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Cliente/Fornecedor</p>
                    <p className="font-medium">{selectedRecord.cliente_fornecedor}</p>
                  </div>
                )}
                {selectedRecord.observacoes && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Observações</p>
                    <p className="font-medium">{selectedRecord.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
