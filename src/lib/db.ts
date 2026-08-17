import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Cartao, Categoria, Lancamento, Recorrencia } from "./finance";

// The generated types do not cover these tables, so use a loose client here.
const db = supabase as unknown as {
  from: (table: string) => any;
};

export function useLancamentos(ano: number) {
  return useQuery({
    queryKey: ["lancamentos", ano],
    queryFn: async (): Promise<Lancamento[]> => {
      const rows: Lancamento[] = [];
      const pageSize = 1000;
      for (let page = 0; page < 20; page++) {
        const { data, error } = await db
          .from("lancamentos")
          .select("*")
          .eq("ano", ano)
          .order("data", { ascending: true })
          .range(page * pageSize, page * pageSize + pageSize - 1);
        if (error) throw error;
        const chunk = (data ?? []) as Lancamento[];
        rows.push(...chunk.map((r) => ({ ...r, valor: Number(r.valor) })));
        if (chunk.length < pageSize) break;
      }
      return rows;
    },
  });
}

export function useAnos() {
  return useQuery({
    queryKey: ["anos"],
    queryFn: async (): Promise<number[]> => {
      const { data, error } = await db.from("lancamentos").select("ano");
      if (error) throw error;
      const anos = new Set<number>((data ?? []).map((r: { ano: number }) => r.ano));
      anos.add(new Date().getFullYear());
      return [...anos].sort((a, b) => b - a);
    },
  });
}

export function useCategorias() {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: async (): Promise<Categoria[]> => {
      const { data, error } = await db
        .from("categorias")
        .select("*")
        .order("tipo")
        .order("ordem");
      if (error) throw error;
      return (data ?? []) as Categoria[];
    },
  });
}

export function useCartoes() {
  return useQuery({
    queryKey: ["cartoes"],
    queryFn: async (): Promise<Cartao[]> => {
      const { data, error } = await db.from("cartoes").select("*").order("nome");
      if (error) throw error;
      return ((data ?? []) as Cartao[]).map((c) => ({ ...c, limite: Number(c.limite) }));
    },
  });
}

export function useRecorrencias() {
  return useQuery({
    queryKey: ["recorrencias"],
    queryFn: async (): Promise<Recorrencia[]> => {
      const { data, error } = await db.from("recorrencias").select("*").order("descricao");
      if (error) throw error;
      return ((data ?? []) as Recorrencia[]).map((r) => ({ ...r, valor: Number(r.valor) }));
    },
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["lancamentos"] });
    qc.invalidateQueries({ queryKey: ["anos"] });
  };
}

export type LancamentoInput = Omit<
  Lancamento,
  "id" | "criado_em" | "atualizado_em" | "origem"
> & { origem?: string };

export function useSalvarLancamento() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string | undefined; values: Partial<LancamentoInput> }) => {
      if (id) {
        const { error } = await db.from("lancamentos").update(values).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await db.from("lancamentos").insert(values);
        if (error) throw error;
      }
    },
    onSuccess: invalidate,
  });
}

export function useInserirMuitos() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (rows: Partial<LancamentoInput>[]) => {
      let inseridos = 0;
      for (let i = 0; i < rows.length; i += 200) {
        const slice = rows.slice(i, i + 200);
        const { data, error } = await db
          .from("lancamentos")
          .upsert(slice, { onConflict: "chave_unica", ignoreDuplicates: true })
          .select("id");
        if (error) throw error;
        inseridos += (data ?? []).length;
      }
      return inseridos;
    },
    onSuccess: invalidate,
  });
}

export function useExcluirLancamento() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("lancamentos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useSalvarRecorrencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string | undefined; values: Partial<Recorrencia> }) => {
      if (id) {
        const { error } = await db.from("recorrencias").update(values).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await db.from("recorrencias").insert(values);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recorrencias"] }),
  });
}

export function useExcluirRecorrencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("recorrencias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recorrencias"] }),
  });
}

export function useSalvarCartao() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id?: string | undefined; values: Partial<Cartao> }) => {
      if (id) {
        const { error } = await db.from("cartoes").update(values).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await db.from("cartoes").insert(values);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cartoes"] }),
  });
}
