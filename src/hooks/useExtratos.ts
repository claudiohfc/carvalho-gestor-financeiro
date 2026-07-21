import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

export type Extrato = Database['public']['Tables']['extratos']['Row'];
export type ExtratoLinha = Database['public']['Tables']['extrato_linhas']['Row'];
export type ExtratoLinhaInsert = Database['public']['Tables']['extrato_linhas']['Insert'];
export type Lancamento = Database['public']['Tables']['lancamentos']['Row'];

const DAY_MS = 86_400_000;

export function useExtratos() {
  const { user } = useAuth();
  const [extratos, setExtratos] = useState<Extrato[]>([]);
  const [linhas, setLinhas] = useState<ExtratoLinha[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setExtratos([]);
      setLinhas([]);
      return;
    }
    setLoading(true);
    const [extRes, linRes] = await Promise.all([
      supabase.from('extratos').select('*').order('data_importacao', { ascending: false }),
      supabase.from('extrato_linhas').select('*').order('data', { ascending: false }),
    ]);
    if (!extRes.error && extRes.data) setExtratos(extRes.data);
    if (!linRes.error && linRes.data) setLinhas(linRes.data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createExtrato = useCallback(
    async (payload: { banco?: string; nome_conta?: string; arquivo_nome?: string }) => {
      if (!user) return { data: null, error: new Error('Não autenticado') };
      const { data, error } = await supabase
        .from('extratos')
        .insert({ ...payload, user_id: user.id, status: 'pendente' })
        .select()
        .single();
      if (!error && data) setExtratos((prev) => [data, ...prev]);
      return { data, error };
    },
    [user]
  );

  const addLinhas = useCallback(
    async (
      extratoId: string,
      entries: Array<{ data: string; descricao: string; valor: number; tipo: 'credito' | 'debito' }>
    ) => {
      if (!user) return { data: null, error: new Error('Não autenticado') };
      const payload: ExtratoLinhaInsert[] = entries.map((e) => ({
        ...e,
        extrato_id: extratoId,
        user_id: user.id,
        conciliado: false,
      }));
      const { data, error } = await supabase.from('extrato_linhas').insert(payload).select();
      if (!error && data) setLinhas((prev) => [...data, ...prev]);
      return { data, error };
    },
    [user]
  );

  const reconcileLine = useCallback(
    async (linhaId: string, lancamentoId: string | null) => {
      const { data, error } = await supabase
        .from('extrato_linhas')
        .update({
          lancamento_id: lancamentoId,
          conciliado: lancamentoId !== null,
          divergencia_motivo: null,
        })
        .eq('id', linhaId)
        .select()
        .single();
      if (!error && data) {
        setLinhas((prev) => prev.map((l) => (l.id === linhaId ? data : l)));
        if (lancamentoId) {
          await supabase.from('lancamentos').update({ conciliado: true }).eq('id', lancamentoId);
        }
      }
      return { data, error };
    },
    []
  );

  const deleteLine = useCallback(async (linhaId: string) => {
    const { error } = await supabase.from('extrato_linhas').delete().eq('id', linhaId);
    if (!error) setLinhas((prev) => prev.filter((l) => l.id !== linhaId));
    return { error };
  }, []);

  const deleteExtrato = useCallback(async (extratoId: string) => {
    const { error } = await supabase.from('extratos').delete().eq('id', extratoId);
    if (!error) {
      setExtratos((prev) => prev.filter((e) => e.id !== extratoId));
      setLinhas((prev) => prev.filter((l) => l.extrato_id !== extratoId));
    }
    return { error };
  }, []);

  /**
   * Auto match: para cada linha não conciliada do extrato,
   * procura lançamento com mesmo valor + tipo compatível + data dentro de ±3 dias.
   */
  const autoMatch = useCallback(
    async (extratoId: string) => {
      if (!user) return { matched: 0 };
      const { data: allLancs } = await supabase
        .from('lancamentos')
        .select('*')
        .eq('conciliado', false);
      const lancs: Lancamento[] = allLancs ?? [];

      const targetLines = linhas.filter(
        (l) => l.extrato_id === extratoId && !l.conciliado && !l.lancamento_id
      );

      const usedLanc = new Set<string>();
      let matched = 0;
      const updatedLines: ExtratoLinha[] = [];

      for (const line of targetLines) {
        const lineDate = new Date(line.data).getTime();
        const expectedTipo = line.tipo === 'credito' ? 'entrada' : 'saida';
        const candidate = lancs.find(
          (l) =>
            !usedLanc.has(l.id) &&
            l.tipo === expectedTipo &&
            Math.abs(Number(l.valor) - Number(line.valor)) < 0.01 &&
            Math.abs(new Date(l.data).getTime() - lineDate) <= 3 * DAY_MS
        );
        if (candidate) {
          usedLanc.add(candidate.id);
          const { data } = await supabase
            .from('extrato_linhas')
            .update({ lancamento_id: candidate.id, conciliado: true })
            .eq('id', line.id)
            .select()
            .single();
          await supabase.from('lancamentos').update({ conciliado: true }).eq('id', candidate.id);
          if (data) updatedLines.push(data);
          matched++;
        }
      }

      if (updatedLines.length > 0) {
        setLinhas((prev) => prev.map((l) => updatedLines.find((u) => u.id === l.id) ?? l));
      }
      // Atualiza contadores do extrato
      const total = linhas.filter((l) => l.extrato_id === extratoId).length;
      const conciliados =
        linhas.filter((l) => l.extrato_id === extratoId && l.conciliado).length + matched;
      await supabase
        .from('extratos')
        .update({
          total_registros: total,
          total_conciliados: conciliados,
          status: conciliados === total ? 'concluido' : 'parcial',
        })
        .eq('id', extratoId);

      return { matched };
    },
    [user, linhas]
  );

  return {
    extratos,
    linhas,
    loading,
    fetchAll,
    createExtrato,
    addLinhas,
    reconcileLine,
    deleteLine,
    deleteExtrato,
    autoMatch,
  };
}
