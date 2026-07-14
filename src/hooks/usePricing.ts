// Stub: tabela products_services foi removida. Aguardando refatoração.
import { useState, useCallback } from 'react';

export interface ProductService {
  id: number;
  user_id: string;
  type: 'produto' | 'servico';
  code: string | null;
  category: string | null;
  name: string;
  description: string | null;
  unit_measure: string | null;
  fixed_costs: number;
  variable_costs: number;
  preparation_time: number;
  preparation_hour_value: number;
  labor_percent: number;
  labor_value: number;
  profit_margin: number;
  markup: number;
  base_cost: number;
  tax_type: string | null;
  tax_value: number;
  final_price: number;
  created_at: string | null;
}

export function usePricing() {
  const [items] = useState<ProductService[]>([]);
  const [loading] = useState(false);
  const err = useCallback(async () => ({ error: new Error('Aguardando migração para o novo schema') as any, data: undefined as any }), []);
  const noop = useCallback(async () => {}, []);
  return { items, loading, fetchItems: noop, addItem: err, updateItem: err, deleteItem: err };
}
