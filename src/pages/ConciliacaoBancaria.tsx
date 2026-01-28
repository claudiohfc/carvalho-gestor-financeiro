import { useState, useMemo } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle,
  Loader2,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  BankStatement, 
  generateBankStatement, 
  systemPayments,
  autoReconcile,
  ReconciliationStatus
} from '@/data/mockBankData';

type ImportStatus = 'idle' | 'uploading' | 'processing' | 'success';

export default function ConciliacaoBancaria() {
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [statements, setStatements] = useState<BankStatement[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const stats = useMemo(() => {
    const conciliados = statements.filter(s => s.status === 'conciliado').length;
    const pendentes = statements.filter(s => s.status === 'pendente').length;
    const divergentes = statements.filter(s => s.status === 'divergente').length;
    return { conciliados, pendentes, divergentes, total: statements.length };
  }, [statements]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const simulateImport = () => {
    setImportStatus('uploading');
    setProgress(0);

    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 40) {
          clearInterval(uploadInterval);
          setImportStatus('processing');
          
          const processInterval = setInterval(() => {
            setProgress((p) => {
              if (p >= 100) {
                clearInterval(processInterval);
                // Gera e reconcilia os dados
                const bankData = generateBankStatement();
                const reconciledData = autoReconcile(bankData, systemPayments);
                setStatements(reconciledData);
                setImportStatus('success');
                
                toast({
                  title: 'Extrato importado!',
                  description: `${reconciledData.length} lançamentos carregados e analisados.`,
                });
                
                return 100;
              }
              return p + 5;
            });
          }, 80);
        }
        return prev + 10;
      });
    }, 120);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    simulateImport();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateImport();
    }
  };

  const handleReconcile = (statementId: string) => {
    setStatements(prev => 
      prev.map(s => 
        s.id === statementId 
          ? { ...s, status: 'conciliado' as ReconciliationStatus, divergenceReason: undefined }
          : s
      )
    );
    toast({
      title: 'Lançamento conciliado',
      description: 'O lançamento foi marcado como conciliado.',
    });
  };

  const handleIgnore = (statementId: string) => {
    setStatements(prev => prev.filter(s => s.id !== statementId));
    toast({
      title: 'Lançamento ignorado',
      description: 'O lançamento foi removido da lista.',
    });
  };

  const handleReprocess = () => {
    const reconciledData = autoReconcile(statements, systemPayments);
    setStatements(reconciledData);
    toast({
      title: 'Reprocessamento concluído',
      description: 'Os lançamentos foram analisados novamente.',
    });
  };

  const getStatusBadge = (status: ReconciliationStatus) => {
    switch (status) {
      case 'conciliado':
        return (
          <Badge className="bg-success/20 text-success border-success/30 gap-1">
            <CheckCircle className="h-3 w-3" />
            Conciliado
          </Badge>
        );
      case 'pendente':
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30 gap-1">
            <AlertCircle className="h-3 w-3" />
            Pendente
          </Badge>
        );
      case 'divergente':
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Divergente
          </Badge>
        );
    }
  };

  return (
    <MainLayout>
      <Header
        title="Conciliação Bancária"
        subtitle="Importe extratos e concilie com os lançamentos do sistema"
      />

      <div className="p-8 space-y-6">
        {/* Upload Area ou Resumo */}
        {importStatus === 'idle' || importStatus === 'uploading' || importStatus === 'processing' ? (
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Importar Extrato Bancário</CardTitle>
              <CardDescription>
                Arraste um arquivo ou clique para selecionar. Formatos aceitos: CSV, OFX, XLS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {importStatus === 'idle' ? (
                <div
                  className={cn(
                    'relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200',
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".csv,.ofx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        Arraste seu extrato aqui
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        ou clique para selecionar
                      </p>
                    </div>
                    <Button variant="outline" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Arquivo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-6">
                  <div className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-foreground">
                      {importStatus === 'uploading' ? 'Enviando arquivo...' : 'Analisando lançamentos...'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {importStatus === 'uploading' 
                        ? 'Aguarde enquanto seu arquivo é enviado'
                        : 'Cruzando dados com pagamentos em aberto'
                      }
                    </p>
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">{progress}%</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                      <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-success">{stats.conciliados}</p>
                      <p className="text-sm text-muted-foreground">Conciliados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                      <AlertCircle className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-warning">{stats.pendentes}</p>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-destructive">{stats.divergentes}</p>
                      <p className="text-sm text-muted-foreground">Divergentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setImportStatus('idle'); setStatements([]); }}>
                <Upload className="h-4 w-4 mr-2" />
                Novo Extrato
              </Button>
              <Button variant="outline" onClick={handleReprocess}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reprocessar
              </Button>
            </div>

            {/* Tabela de Lançamentos */}
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Lançamentos do Extrato</CardTitle>
                <CardDescription>
                  Revise os lançamentos e concilie manualmente quando necessário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="w-[100px]">Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right w-[130px]">Valor</TableHead>
                        <TableHead className="w-[140px]">Status</TableHead>
                        <TableHead className="w-[100px] text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {statements.map((stmt) => (
                        <TableRow key={stmt.id} className="hover:bg-muted/20">
                          <TableCell className="font-mono text-sm">
                            {formatDate(stmt.date)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{stmt.description}</p>
                              {stmt.divergenceReason && (
                                <p className="text-xs text-destructive mt-1">
                                  {stmt.divergenceReason}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={cn(
                            'text-right font-medium',
                            stmt.type === 'credito' ? 'text-success' : 'text-destructive'
                          )}>
                            {stmt.type === 'credito' ? '+' : '-'}{formatCurrency(stmt.value)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(stmt.status)}
                          </TableCell>
                          <TableCell>
                            {stmt.status !== 'conciliado' && (
                              <div className="flex justify-center gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                                      onClick={() => handleReconcile(stmt.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Conciliar</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => handleIgnore(stmt.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Ignorar</TooltipContent>
                                </Tooltip>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}
