import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
  const { user } = useAuth();
  const [items, setItems] = useState<ProductService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products_services')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setItems(data as unknown as ProductService[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = useCallback(async (item: Omit<ProductService, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('products_services')
      .insert({ ...item, user_id: user.id } as any)
      .select()
      .single();
    if (!error) await fetchItems();
    return { data, error };
  }, [user, fetchItems]);

  const updateItem = useCallback(async (id: number, updates: Partial<ProductService>) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { id: _, user_id: __, created_at: ___, ...safeUpdates } = updates as any;
    const { data, error } = await supabase
      .from('products_services')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single();
    if (!error) await fetchItems();
    return { data, error };
  }, [user, fetchItems]);

  const deleteItem = useCallback(async (id: number) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { error } = await supabase
      .from('products_services')
      .delete()
      .eq('id', id);
    if (!error) await fetchItems();
    return { error };
  }, [user, fetchItems]);

  return { items, loading, fetchItems, addItem, updateItem, deleteItem };
}
