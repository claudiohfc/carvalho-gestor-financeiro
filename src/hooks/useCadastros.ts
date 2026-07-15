import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

export type Cadastro = Database['public']['Tables']['cadastros']['Row'];
export type CadastroInsert = Database['public']['Tables']['cadastros']['Insert'];
export type CadastroUpdate = Database['public']['Tables']['cadastros']['Update'];

export function useCadastros() {
  const { user } = useAuth();
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCadastros = useCallback(async () => {
    if (!user) {
      setCadastros([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('cadastros')
      .select('*')
      .order('nome', { ascending: true });
    if (!error && data) setCadastros(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCadastros();
  }, [fetchCadastros]);

  const addCadastro = useCallback(
    async (payload: Omit<CadastroInsert, 'user_id'>) => {
      if (!user) return { error: new Error('Usuário não autenticado'), data: null };
      const { data, error } = await supabase
        .from('cadastros')
        .insert({ ...payload, user_id: user.id })
        .select()
        .single();
      if (!error && data) setCadastros((prev) => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      return { data, error };
    },
    [user]
  );

  const updateCadastro = useCallback(async (id: string, payload: CadastroUpdate) => {
    const { data, error } = await supabase
      .from('cadastros')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      setCadastros((prev) => prev.map((c) => (c.id === id ? data : c)));
    }
    return { data, error };
  }, []);

  const deleteCadastro = useCallback(async (id: string) => {
    const { error } = await supabase.from('cadastros').delete().eq('id', id);
    if (!error) setCadastros((prev) => prev.filter((c) => c.id !== id));
    return { error };
  }, []);

  return {
    cadastros,
    loading,
    fetchCadastros,
    addCadastro,
    updateCadastro,
    deleteCadastro,
  };
}
