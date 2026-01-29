import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, getReceivablesByStatus, getPayablesByStatus } from '@/data/mockHomeData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Clock, FileWarning } from 'lucide-react';

interface DelinquencyTableProps {
  type: 'cliente' | 'fornecedor';
}

export function DelinquencyTable({ type }: DelinquencyTableProps) {
  const isClient = type === 'cliente';
  const title = isClient ? 'Inadimplência de Clientes' : 'Inadimplência por Fornecedor';

  const tabs = isClient
    ? [
        { value: 'em_aberto', label: 'Em Aberto', icon: FileWarning },
        { value: 'proximo_vencer', label: 'Próximos a Vencer', icon: Clock },
        { value: 'vencido', label: 'Vencidos', icon: AlertCircle },
      ]
    : [
        { value: 'proximo_vencer', label: 'Próximos a Vencer', icon: Clock },
        { value: 'vencido', label: 'Vencidos', icon: AlertCircle },
      ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      em_aberto: { variant: 'secondary', label: 'Em Aberto' },
      proximo_vencer: { variant: 'outline', label: 'Próximo' },
      vencido: { variant: 'destructive', label: 'Vencido' },
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd/MM/yy", { locale: ptBR });
  };

  const renderTable = (status: 'em_aberto' | 'proximo_vencer' | 'vencido') => {
    const data = isClient
      ? getReceivablesByStatus(status)
      : getPayablesByStatus(status);

    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <FileWarning className="h-10 w-10 mb-2 opacity-50" />
          <p className="text-sm">Nenhum registro encontrado</p>
        </div>
      );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="space-y-2">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isClient ? 'Cliente' : 'Fornecedor'}</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Vencimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 5).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {isClient ? (item as any).clientName : (item as any).supplierName}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
                  <TableCell className="text-right">{formatDate(item.dueDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center px-2 py-2 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">
            Total ({data.length} {data.length === 1 ? 'item' : 'itens'})
          </span>
          <span className="text-sm font-bold text-foreground">{formatCurrency(total)}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={tabs[0].value} className="w-full">
          <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
                <tab.icon className="h-3 w-3 mr-1 hidden sm:inline" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              {renderTable(tab.value as 'em_aberto' | 'proximo_vencer' | 'vencido')}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
