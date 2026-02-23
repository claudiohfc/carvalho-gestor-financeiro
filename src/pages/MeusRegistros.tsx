import { useState, useMemo } from 'react';
import { Plus, Eye, Pencil, Trash2, Search } from 'lucide-react';
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
import { transactions, Transaction, categories } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function MeusRegistros() {
  const { toast } = useToast();
  const [data, setData] = useState<Transaction[]>(transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Transaction | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [data, searchTerm, typeFilter, categoryFilter]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const handleView = (record: Transaction) => {
    setSelectedRecord(record);
    setViewDialogOpen(true);
  };

  const handleDelete = (record: Transaction) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRecord) {
      setData(data.filter((item) => item.id !== selectedRecord.id));
      toast({
        title: 'Registro excluído',
        description: 'O registro foi removido com sucesso.',
      });
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };

  return (
    <MainLayout>
      <Header title="Meus Registros" subtitle="Todos os lançamentos financeiros" />

      <div className="p-8 space-y-6">
        {/* Filters */}
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
            <RegistroFormDialog onAdd={(tx) => setData(prev => [tx, ...prev])} />
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <a href="/lancamentos">
                <Plus className="h-4 w-4 mr-2" />
                Novo Registro
              </a>
            </Button>
          </div>
        </div>

        {/* Table */}
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
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.slice(0, 20).map((record) => (
                  <TableRow key={record.id} className="table-row-hover border-border">
                    <TableCell className="text-foreground">{formatDate(record.date)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          record.type === 'entrada'
                            ? 'border-success/30 bg-success/10 text-success'
                            : 'border-destructive/30 bg-destructive/10 text-destructive'
                        )}
                      >
                        {record.type === 'entrada' ? 'Entrada' : 'Saída'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground max-w-[200px] truncate">
                      {record.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{record.category}</TableCell>
                    <TableCell className="text-muted-foreground">{record.costCenter}</TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium',
                        record.type === 'entrada' ? 'text-success' : 'text-destructive'
                      )}
                    >
                      {record.type === 'entrada' ? '+' : '-'}
                      {formatCurrency(record.value)}
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
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
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

        {filteredData.length > 20 && (
          <p className="text-center text-sm text-muted-foreground">
            Mostrando 20 de {filteredData.length} registros
          </p>
        )}
      </div>

      {/* View Dialog */}
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
                  <p className="font-medium">{formatDate(selectedRecord.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      selectedRecord.type === 'entrada'
                        ? 'border-success/30 bg-success/10 text-success'
                        : 'border-destructive/30 bg-destructive/10 text-destructive'
                    )}
                  >
                    {selectedRecord.type === 'entrada' ? 'Entrada' : 'Saída'}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="font-medium">{selectedRecord.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium">{selectedRecord.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subcategoria</p>
                  <p className="font-medium">{selectedRecord.subcategory}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Centro de Custo</p>
                  <p className="font-medium">{selectedRecord.costCenter}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p
                    className={cn(
                      'font-semibold text-lg',
                      selectedRecord.type === 'entrada' ? 'text-success' : 'text-destructive'
                    )}
                  >
                    {formatCurrency(selectedRecord.value)}
                  </p>
                </div>
                {selectedRecord.clientOrSupplier && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Cliente/Fornecedor</p>
                    <p className="font-medium">{selectedRecord.clientOrSupplier}</p>
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

      {/* Delete Confirmation */}
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
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
