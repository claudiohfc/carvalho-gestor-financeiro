import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/data/mockData';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showFilters?: boolean;
  period?: string;
  onPeriodChange?: (period: string) => void;
  category?: string;
  onCategoryChange?: (category: string) => void;
}

const periods = [
  { value: '1', label: '1 dia' },
  { value: '7', label: '7 dias' },
  { value: '30', label: '30 dias' },
  { value: '365', label: 'Ano' },
  { value: 'all', label: 'Total' },
];

export function Header({
  title,
  subtitle,
  showFilters = false,
  period = '30',
  onPeriodChange,
  category = 'all',
  onCategoryChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[80px] items-center justify-between border-b border-border bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      {showFilters && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={period} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {periods.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[200px] bg-card border-border">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </header>
  );
}
