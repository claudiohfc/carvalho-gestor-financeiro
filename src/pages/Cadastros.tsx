import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Building2, User, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogTrigger,
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
import { useCadastros, type Cadastro } from '@/hooks/useCadastros';
import { cn } from '@/lib/utils';

const clientCategories = [
  'Grandes Empresas',
  'Médias Empresas',
  'Pequenas Empresas',
  'Startups',
  'Indústria',
  'Associações',
  'Tecnologia',
  'Imobiliário',
  'Suprimentos',
  'Marketing',
  'Serviços',
];

export default function Cadastros() {
  const { toast } = useToast();
  const { cadastros, loading, addCadastro, updateCadastro, deleteCadastro } = useCadastros();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Cadastro | null>(null);
  const [deleteItem, setDeleteItem] = useState<Cadastro | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'cliente' as 'cliente' | 'fornecedor',
    categoria: '',
    status: 'ativo' as 'ativo' | 'inativo',
    email: '',
    telefone: '',
    cpf_cnpj: '',
  });

  const filteredData = cadastros.filter((item) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      item.nome.toLowerCase().includes(s) ||
      (item.categoria || '').toLowerCase().includes(s);
    const matchesType = typeFilter === 'all' || item.tipo === typeFilter;
    return matchesSearch && matchesType;
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: 'cliente',
      categoria: '',
      status: 'ativo',
      email: '',
      telefone: '',
      cpf_cnpj: '',
    });
    setEditingItem(null);
  };

  const handleEdit = (item: Cadastro) => {
    setEditingItem(item);
    setFormData({
      nome: item.nome,
      tipo: (item.tipo as 'cliente' | 'fornecedor') || 'cliente',
      categoria: item.categoria || '',
      status: (item.status as 'ativo' | 'inativo') || 'ativo',
      email: item.email || '',
      telefone: item.telefone || '',
      cpf_cnpj: item.cpf_cnpj || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome.trim() || !formData.categoria) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }
    setSaving(true);
    const payload = {
      nome: formData.nome.trim(),
      tipo: formData.tipo,
      categoria: formData.categoria,
      status: formData.status,
      email: formData.email || null,
      telefone: formData.telefone || null,
      cpf_cnpj: formData.cpf_cnpj || null,
    };
    let error;
    if (editingItem) {
      ({ error } = await updateCadastro(editingItem.id, payload));
    } else {
      ({ error } = await addCadastro(payload));
    }
    setSaving(false);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      return;
    }
    toast({
      title: editingItem ? 'Atualizado!' : 'Cadastrado!',
      description: editingItem ? 'O cadastro foi atualizado.' : 'O cadastro foi criado.',
    });
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    const { error } = await deleteCadastro(deleteItem.id);
    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Excluído!', description: 'O cadastro foi removido.' });
    }
    setDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  return (
    <MainLayout>
      <Header title="Clientes e Fornecedores" subtitle="Gerenciamento de cadastros" />

      <div className="p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="cliente">Clientes</SelectItem>
                <SelectItem value="fornecedor">Fornecedores</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cadastro
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Editar Cadastro' : 'Novo Cadastro'}</DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? 'Altere as informações do cadastro.'
                    : 'Preencha as informações para criar um novo cadastro.'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    placeholder="Nome do cliente ou fornecedor"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo *</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value: 'cliente' | 'fornecedor') =>
                        setFormData({ ...formData, tipo: value })
                      }
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="fornecedor">Fornecedor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'ativo' | 'inativo') =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {clientCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
                  <Input
                    id="cpf_cnpj"
                    placeholder="00.000.000/0001-00"
                    value={formData.cpf_cnpj}
                    onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={saving}>
                  {saving ? 'Salvando...' : editingItem ? 'Salvar Alterações' : 'Criar Cadastro'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Nome</TableHead>
                <TableHead className="text-muted-foreground">Tipo</TableHead>
                <TableHead className="text-muted-foreground">Categoria</TableHead>
                <TableHead className="text-muted-foreground">E-mail</TableHead>
                <TableHead className="text-muted-foreground">Telefone</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
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
                    Nenhum cadastro encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="table-row-hover border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          {item.tipo === 'cliente' ? (
                            <User className="h-4 w-4 text-primary" />
                          ) : (
                            <Building2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="font-medium text-foreground">{item.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          item.tipo === 'cliente'
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : 'border-warning/30 bg-warning/10 text-warning'
                        )}
                      >
                        {item.tipo === 'cliente' ? 'Cliente' : 'Fornecedor'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.categoria || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{item.email || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{item.telefone || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          item.status === 'ativo'
                            ? 'border-success/30 bg-success/10 text-success'
                            : 'border-muted-foreground/30 bg-muted/50 text-muted-foreground'
                        )}
                      >
                        {item.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            setDeleteItem(item);
                            setDeleteDialogOpen(true);
                          }}
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
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteItem?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
