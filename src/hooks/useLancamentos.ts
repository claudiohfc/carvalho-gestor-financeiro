import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

export type Lancamento = Database['public']['Tables']['lancamentos']['Row'];
export type LancamentoInsert = Database['public']['Tables']['lancamentos']['Insert'];
export type LancamentoUpdate = Database['public']['Tables']['lancamentos']['Update'];

export function useLancamentos() {
  const { user } = useAuth();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLancamentos = useCallback(async () => {
    if (!user) {
      setLancamentos([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('lancamentos')
      .select('*')
      .order('data', { ascending: false });
    if (!error && data) setLancamentos(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchLancamentos();
  }, [fetchLancamentos]);

  const addLancamento = useCallback(
    async (payload: Omit<LancamentoInsert, 'user_id'>) => {
      if (!user) return { error: new Error('Usuário não autenticado'), data: null };
      const { data, error } = await supabase
        .from('lancamentos')
        .insert({ ...payload, user_id: user.id })
        .select()
        .single();
      if (!error && data) setLancamentos((prev) => [data, ...prev]);
      return { data, error };
    },
    [user]
  );

  const updateLancamento = useCallback(async (id: string, payload: LancamentoUpdate) => {
    const { data, error } = await supabase
      .from('lancamentos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      setLancamentos((prev) => prev.map((l) => (l.id === id ? data : l)));
    }
    return { data, error };
  }, []);

  const deleteLancamento = useCallback(async (id: string) => {
    const { error } = await supabase.from('lancamentos').delete().eq('id', id);
    if (!error) setLancamentos((prev) => prev.filter((l) => l.id !== id));
    return { error };
  }, []);

  return {
    lancamentos,
    loading,
    fetchLancamentos,
    addLancamento,
    updateLancamento,
    deleteLancamento,
  };
}
