import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, SeletorPeriodo, StatCard, BarraProporcao, Vazio } from "@/components/finance-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLancamentos } from "@/lib/db";
import { usePeriodo } from "@/lib/periodo";
import { exportar } from "@/lib/planilha";
import { MESES, brl, insights, resumo, totaisPorCategoria } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/relatorio")({
  head: () => ({
    meta: [
      { title: "Relatório | Controle Financeiro 2026" },
      { name: "description", content: "Relatório mensal detalhado por categoria, com proporções e exportação." },
      { property: "og:title", content: "Relatório | Controle Financeiro 2026" },
      { property: "og:description", content: "Relatório mensal detalhado por categoria, com proporções e exportação." },
    ],
  }),
  component: Relatorio,
});

function Relatorio() {
  const { mes, ano } = usePeriodo();
  const { data: todos = [] } = useLancamentos(ano);
  const doMes = todos.filter((l) => l.mes === mes);
  const anterior = todos.filter((l) => l.mes === (mes === 1 ? 12 : mes - 1));
  const r = resumo(doMes);
  const categorias = totaisPorCategoria(doMes.filter((l) => l.tipo !== "receita"));
  const cores = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-chart-6)"];

  return (
    <div className="space-y-6">
      <PageHeader
        titulo={`Relatório · ${MESES[mes - 1]} ${ano}`}
        descricao="Fechamento do mês por categoria, com proporções e comparativo."
        acoes={
          <>
            <SeletorPeriodo />
            <Button variant="secondary" onClick={() => { exportar(doMes, "xlsx", `relatorio-${mes}-${ano}`); toast.success("Relatório exportado."); }}>
              <Download className="size-4" /> Exportar
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Receitas" valor={r.receitas} tom="positivo" />
        <StatCard label="Despesas" valor={r.totalDespesas} tom="negativo" />
        <StatCard label="Saldo" valor={r.saldo} tom={r.saldo >= 0 ? "positivo" : "negativo"} />
        <StatCard label="Comprometimento da renda" valor={r.totalDespesas} detalhe={r.receitas ? `${((r.totalDespesas / r.receitas) * 100).toFixed(0)}% das receitas` : "Sem receitas no mês"} tom="aviso" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel titulo="Proporção por categoria">
          {categorias.length ? (
            <BarraProporcao itens={categorias.slice(0, 8).map((c, i) => ({ label: c.categoria, valor: c.total, cor: cores[i % cores.length] as string }))} />
          ) : (
            <Vazio texto="Sem despesas no mês." />
          )}
        </Panel>
        <Panel titulo="Análise do mês">
          <ul className="space-y-3 text-sm text-muted-foreground">
            {insights(doMes, anterior, mes).map((d) => (
              <li key={d}>• {d}</li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel titulo="Detalhamento por categoria">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">% das despesas</TableHead>
                <TableHead className="text-right">Mês anterior</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map((c) => {
                const ant = anterior.filter((l) => l.categoria === c.categoria).reduce((t, l) => t + l.valor, 0);
                return (
                  <TableRow key={c.categoria}>
                    <TableCell className="font-medium">{c.categoria}</TableCell>
                    <TableCell className="num text-right">{brl(c.total)}</TableCell>
                    <TableCell className="num text-right text-muted-foreground">{r.totalDespesas ? `${((c.total / r.totalDespesas) * 100).toFixed(1)}%` : "—"}</TableCell>
                    <TableCell className="num text-right text-muted-foreground">{brl(ant)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </div>
  );
}
