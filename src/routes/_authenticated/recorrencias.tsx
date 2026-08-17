import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Play, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, SeletorPeriodo, StatCard, Vazio } from "@/components/finance-ui";
import { LancamentoDialog } from "@/components/lancamento-dialog";
import { useExcluirRecorrencia, useInserirMuitos, useLancamentos, useRecorrencias } from "@/lib/db";
import { usePeriodo } from "@/lib/periodo";
import { MESES, brl, soma, tipoLabel } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/recorrencias")({
  head: () => ({
    meta: [
      { title: "Recorrências | Controle Financeiro 2026" },
      { name: "description", content: "Despesas fixas recorrentes e geração automática dos lançamentos do mês." },
      { property: "og:title", content: "Recorrências | Controle Financeiro 2026" },
      { property: "og:description", content: "Despesas fixas recorrentes e geração automática dos lançamentos do mês." },
    ],
  }),
  component: Recorrencias,
});

function Recorrencias() {
  const { mes, ano } = usePeriodo();
  const { data: recorrencias = [] } = useRecorrencias();
  const { data: todos = [] } = useLancamentos(ano);
  const excluir = useExcluirRecorrencia();
  const inserir = useInserirMuitos();
  const [dialog, setDialog] = useState(false);

  const ativas = recorrencias.filter((r) => r.ativo);

  async function gerar() {
    const rows = ativas.map((r) => ({
      descricao: r.descricao.toUpperCase(),
      tipo: r.tipo,
      categoria: r.categoria,
      subcategoria: null,
      valor: r.valor,
      data: `${ano}-${String(mes).padStart(2, "0")}-${String(Math.min(r.dia || 5, 28)).padStart(2, "0")}`,
      mes,
      ano,
      forma_pagamento: r.forma_pagamento,
      cartao: r.cartao,
      origem: "recorrencia",
    }));
    if (!rows.length) {
      toast.error("Nenhuma recorrência ativa.");
      return;
    }
    const inseridos = await inserir.mutateAsync(rows);
    toast.success(inseridos ? `${inseridos} lançamento(s) gerado(s) para ${MESES[mes - 1]}.` : `Os lançamentos de ${MESES[mes - 1]} já existem.`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Recorrências"
        descricao="Gastos fixos como Spotify, faculdade e plano de saúde — gerados com um clique."
        acoes={
          <>
            <SeletorPeriodo />
            <Button variant="secondary" onClick={gerar} disabled={inserir.isPending}>
              <Play className="size-4" /> Gerar em {MESES[mes - 1]}
            </Button>
            <Button onClick={() => setDialog(true)}>
              <Plus className="size-4" /> Lançamento fixo
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total recorrente" valor={soma(ativas.map((r) => ({ valor: r.valor }) as never))} detalhe={`${ativas.length} recorrência(s) ativa(s)`} />
        <StatCard label={`Fixas em ${MESES[mes - 1]}`} valor={soma(todos.filter((l) => l.mes === mes && l.tipo === "despesa_fixa"))} tom="negativo" />
        <StatCard label="Fixas no ano" valor={soma(todos.filter((l) => l.tipo === "despesa_fixa"))} />
      </div>
      <Panel titulo="Recorrências cadastradas">
        {recorrencias.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Dia</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {recorrencias.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.descricao}</TableCell>
                    <TableCell className="text-muted-foreground">{r.categoria}</TableCell>
                    <TableCell><Badge variant="secondary">{tipoLabel(r.tipo)}</Badge></TableCell>
                    <TableCell className="num">{r.dia}</TableCell>
                    <TableCell className="num text-right">{brl(r.valor)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" aria-label="Excluir" onClick={async () => { await excluir.mutateAsync(r.id); toast.success("Recorrência removida."); }}>
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Vazio texto="Nenhuma recorrência cadastrada." />
        )}
      </Panel>
      <LancamentoDialog open={dialog} onOpenChange={setDialog} tipoPadrao="despesa_fixa" mes={mes} ano={ano} />
    </div>
  );
}
