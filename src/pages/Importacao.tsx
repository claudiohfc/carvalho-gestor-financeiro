import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Download, FileText } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { generateExcelTemplate, generateBalanceteTemplate } from '@/utils/excelGenerator';

type ImportStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export default function Importacao() {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [balanceteStatus, setBalanceteStatus] = useState<ImportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [balanceteProgress, setBalanceteProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [balanceteDragActive, setBalanceteDragActive] = useState(false);
  const { toast } = useToast();

  const simulateImport = (
    setStatusFn: (s: ImportStatus) => void, 
    setProgressFn: (p: number | ((prev: number) => number)) => void,
    successMessage: string,
    recordCount: number
  ) => {
    setStatusFn('uploading');
    setProgressFn(0);

    const uploadInterval = setInterval(() => {
      setProgressFn((prev: number) => {
        if (prev >= 40) {
          clearInterval(uploadInterval);
          setStatusFn('processing');
          
          const processInterval = setInterval(() => {
            setProgressFn((p: number) => {
              if (p >= 100) {
                clearInterval(processInterval);
                setStatusFn('success');
                toast({
                  title: successMessage,
                  description: `${recordCount} registros importados com sucesso.`,
                });
                return 100;
              }
              return p + 5;
            });
          }, 100);
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDrag = (e: React.DragEvent, setActive: (active: boolean) => void) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setActive(true);
    } else if (e.type === 'dragleave') {
      setActive(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent, 
    setActive: (active: boolean) => void,
    setStatusFn: (s: ImportStatus) => void,
    setProgressFn: (p: number | ((prev: number) => number)) => void,
    message: string,
    count: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(false);
    simulateImport(setStatusFn, setProgressFn, message, count);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setStatusFn: (s: ImportStatus) => void,
    setProgressFn: (p: number | ((prev: number) => number)) => void,
    message: string,
    count: number
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateImport(setStatusFn, setProgressFn, message, count);
    }
  };

  const handleDownloadTemplate = () => {
    generateExcelTemplate();
    toast({
      title: 'Download iniciado',
      description: 'O modelo de planilha está sendo baixado.',
    });
  };

  const handleDownloadBalancete = () => {
    generateBalanceteTemplate();
    toast({
      title: 'Download iniciado',
      description: 'O modelo de balancete está sendo baixado.',
    });
  };

  const resetImport = (setStatusFn: (s: ImportStatus) => void, setProgressFn: (p: number) => void) => {
    setStatusFn('idle');
    setProgressFn(0);
  };

  const renderUploadArea = (
    currentStatus: ImportStatus,
    currentProgress: number,
    isDragActive: boolean,
    setDragActiveFn: (active: boolean) => void,
    setStatusFn: (s: ImportStatus) => void,
    setProgressFn: (p: number | ((prev: number) => number)) => void,
    successMessage: string,
    recordCount: number,
    successText: string
  ) => (
    currentStatus === 'idle' ? (
      <div
        className={cn(
          'relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        )}
        onDragEnter={(e) => handleDrag(e, setDragActiveFn)}
        onDragLeave={(e) => handleDrag(e, setDragActiveFn)}
        onDragOver={(e) => handleDrag(e, setDragActiveFn)}
        onDrop={(e) => handleDrop(e, setDragActiveFn, setStatusFn, setProgressFn, successMessage, recordCount)}
      >
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFileChange(e, setStatusFn, setProgressFn, successMessage, recordCount)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FileSpreadsheet className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-medium">
              Arraste seu arquivo aqui
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
          {currentStatus === 'success' ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 animate-scale-in">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
          ) : currentStatus === 'error' ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 animate-scale-in">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          )}
        </div>

        <div className="text-center">
          {currentStatus === 'uploading' && (
            <>
              <p className="text-lg font-medium text-foreground">Enviando arquivo...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Aguarde enquanto seu arquivo é enviado
              </p>
            </>
          )}
          {currentStatus === 'processing' && (
            <>
              <p className="text-lg font-medium text-foreground">Processando dados...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Validando e importando registros
              </p>
            </>
          )}
          {currentStatus === 'success' && (
            <>
              <p className="text-lg font-medium text-success">Importação concluída!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {successText}
              </p>
            </>
          )}
          {currentStatus === 'error' && (
            <>
              <p className="text-lg font-medium text-destructive">Erro na importação</p>
              <p className="text-sm text-muted-foreground mt-1">
                Verifique o formato do arquivo e tente novamente
              </p>
            </>
          )}
        </div>

        {(currentStatus === 'uploading' || currentStatus === 'processing') && (
          <div className="space-y-2">
            <Progress value={currentProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">{currentProgress}%</p>
          </div>
        )}

        {(currentStatus === 'success' || currentStatus === 'error') && (
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => resetImport(setStatusFn, setProgressFn as (p: number) => void)}>
              Nova Importação
            </Button>
            {currentStatus === 'success' && (
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <a href="/registros">Ver Registros</a>
              </Button>
            )}
          </div>
        )}
      </div>
    )
  );

  return (
    <MainLayout>
      <Header
        title="Importação de Dados"
        subtitle="Importe seus dados financeiros de planilhas externas"
      />

      <div className="p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Download de Modelos */}
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Modelos de Planilha
              </CardTitle>
              <CardDescription>
                Baixe os modelos oficiais para importação de dados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Modelo Padrão</p>
                      <p className="text-xs text-muted-foreground">Receitas, Despesas, Clientes, Fornecedores</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleDownloadTemplate}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Modelo Balancete</p>
                      <p className="text-xs text-muted-foreground">Balancete anual contábil</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleDownloadBalancete}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abas de Upload */}
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dados">Dados Financeiros</TabsTrigger>
              <TabsTrigger value="balancete">Balancete Anual</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados">
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Upload de Dados Financeiros</CardTitle>
                  <CardDescription>
                    Importe receitas, despesas, clientes e fornecedores. Formatos: CSV, XLSX, XLS.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderUploadArea(
                    status, progress, dragActive, setDragActive,
                    setStatus, setProgress,
                    'Dados importados!', 127,
                    '127 registros importados com sucesso'
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="balancete">
              <Card className="glass-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Upload de Balancete Anual</CardTitle>
                  <CardDescription>
                    Importe o balancete contábil para gerar histórico de movimentações. Formatos: CSV, XLSX, XLS.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderUploadArea(
                    balanceteStatus, balanceteProgress, balanceteDragActive, setBalanceteDragActive,
                    setBalanceteStatus, setBalanceteProgress,
                    'Balancete importado!', 48,
                    '48 contas processadas e convertidas em movimentações'
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Instructions */}
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Instruções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Baixe o modelo</p>
                    <p className="text-sm text-muted-foreground">
                      Use um dos modelos acima para garantir compatibilidade
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Preencha seus dados</p>
                    <p className="text-sm text-muted-foreground">
                      Siga os exemplos e mantenha o formato das colunas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Faça o upload</p>
                    <p className="text-sm text-muted-foreground">
                      Arraste o arquivo ou clique para selecionar. O sistema validará automaticamente.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
