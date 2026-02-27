import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DbPerson {
  id: number;
  user_id: string;
  type: 'socio' | 'funcionario' | 'colaborador' | 'terceiro';
  name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  start_date: string | null;
  end_date: string | null;
  active: boolean | null;
  created_at: string | null;
}

export function usePeople() {
  const { user } = useAuth();
  const [people, setPeople] = useState<DbPerson[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPeople = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('people')
      .select('*')
      .order('name');
    if (!error && data) setPeople(data as unknown as DbPerson[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const addPerson = useCallback(async (person: Omit<DbPerson, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase
      .from('people')
      .insert({ ...person, user_id: user.id } as any)
      .select()
      .single();
    if (!error) await fetchPeople();
    return { data, error };
  }, [user, fetchPeople]);

  const updatePerson = useCallback(async (id: number, updates: Partial<DbPerson>) => {
    const { data, error } = await supabase
      .from('people')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    if (!error) await fetchPeople();
    return { data, error };
  }, [fetchPeople]);

  const deletePerson = useCallback(async (id: number) => {
    const { error } = await supabase
      .from('people')
      .delete()
      .eq('id', id);
    if (!error) await fetchPeople();
    return { error };
  }, [fetchPeople]);

  return { people, loading, addPerson, updatePerson, deletePerson, refetch: fetchPeople };
}
