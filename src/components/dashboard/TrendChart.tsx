import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendChartProps {
  data: { date: string; entradas: number; saidas: number }[];
  title?: string;
}

export function TrendChart({ data, title = 'Evolução Financeira' }: TrendChartProps) {
  const formatValue = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    }).format(value);

  return (
    <Card className="glass-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(217, 33%, 17%)' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatValue}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(217, 33%, 17%)' }}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatValue(value),
                  name === 'entradas' ? 'Entradas' : 'Saídas',
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 9%)',
                  border: '1px solid hsl(217, 33%, 17%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 98%)',
                }}
                labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span style={{ color: 'hsl(215, 20%, 65%)' }}>
                    {value === 'entradas' ? 'Entradas' : 'Saídas'}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="entradas"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(142, 76%, 36%)', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: 'hsl(142, 76%, 36%)' }}
              />
              <Line
                type="monotone"
                dataKey="saidas"
                stroke="hsl(0, 84%, 60%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(0, 84%, 60%)', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: 'hsl(0, 84%, 60%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
