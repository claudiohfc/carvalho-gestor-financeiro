import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type ImportStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export default function Importacao() {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const simulateImport = () => {
    setStatus('uploading');
    setProgress(0);

    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 40) {
          clearInterval(uploadInterval);
          setStatus('processing');
          
          const processInterval = setInterval(() => {
            setProgress((p) => {
              if (p >= 100) {
                clearInterval(processInterval);
                setStatus('success');
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

  const resetImport = () => {
    setStatus('idle');
    setProgress(0);
  };

  return (
    <MainLayout>
      <Header
        title="Importação de Dados"
        subtitle="Importe seus dados financeiros de planilhas externas"
      />

      <div className="p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Upload Card */}
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Upload de Arquivo</CardTitle>
              <CardDescription>
                Arraste um arquivo ou clique para selecionar. Formatos aceitos: CSV, XLSX, XLS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === 'idle' ? (
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
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
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
                  {/* Status Icon */}
                  <div className="flex justify-center">
                    {status === 'success' ? (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 animate-scale-in">
                        <CheckCircle className="h-10 w-10 text-success" />
                      </div>
                    ) : status === 'error' ? (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 animate-scale-in">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Status Text */}
                  <div className="text-center">
                    {status === 'uploading' && (
                      <>
                        <p className="text-lg font-medium text-foreground">Enviando arquivo...</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Aguarde enquanto seu arquivo é enviado
                        </p>
                      </>
                    )}
                    {status === 'processing' && (
                      <>
                        <p className="text-lg font-medium text-foreground">Processando dados...</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Validando e importando registros
                        </p>
                      </>
                    )}
                    {status === 'success' && (
                      <>
                        <p className="text-lg font-medium text-success">Importação concluída!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          127 registros importados com sucesso
                        </p>
                      </>
                    )}
                    {status === 'error' && (
                      <>
                        <p className="text-lg font-medium text-destructive">Erro na importação</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Verifique o formato do arquivo e tente novamente
                        </p>
                      </>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {(status === 'uploading' || status === 'processing') && (
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-center text-muted-foreground">{progress}%</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {(status === 'success' || status === 'error') && (
                    <div className="flex justify-center gap-3">
                      <Button variant="outline" onClick={resetImport}>
                        Nova Importação
                      </Button>
                      {status === 'success' && (
                        <Button className="bg-primary hover:bg-primary/90" asChild>
                          <a href="/registros">Ver Registros</a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

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
                    <p className="text-sm font-medium text-foreground">Prepare seu arquivo</p>
                    <p className="text-sm text-muted-foreground">
                      Organize os dados em colunas: Data, Tipo, Descrição, Valor, Categoria
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Verifique o formato</p>
                    <p className="text-sm text-muted-foreground">
                      Datas devem estar no formato DD/MM/AAAA, valores sem formatação
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
                      Arraste o arquivo ou clique para selecionar. O sistema validará os dados
                      automaticamente.
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
