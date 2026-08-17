import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader, Panel, SeletorPeriodo, StatCard } from "@/components/finance-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLancamentos } from "@/lib/db";
import { usePeriodo } from "@/lib/periodo";
import { brl, porMes, resumo } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/anual")({
  head: () => ({
    meta: [
      { title: "Visão anual | Controle Financeiro 2026" },
      { name: "description", content: "Comparativo mês a mês de receitas, despesas e saldo acumulado do ano." },
      { property: "og:title", content: "Visão anual | Controle Financeiro 2026" },
      { property: "og:description", content: "Comparativo mês a mês de receitas, despesas e saldo acumulado do ano." },
    ],
  }),
  component: Anual,
});

function Anual() {
  const { ano } = usePeriodo();
  const { data: todos = [] } = useLancamentos(ano);
  const meses = porMes(todos);
  const r = resumo(todos);
  let acumulado = 0;
  const comAcumulado = meses.map((m) => {
    acumulado += m.saldo;
    return { ...m, acumulado };
  });

  return (
    <div className="space-y-6">
      <PageHeader titulo={`Visão anual · ${ano}`} descricao="Comparativo mês a mês e saldo acumulado." acoes={<SeletorPeriodo comMes={false} />} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Receitas no ano" valor={r.receitas} tom="positivo" />
        <StatCard label="Despesas no ano" valor={r.totalDespesas} tom="negativo" />
        <StatCard label="Saldo do ano" valor={r.saldo} tom={r.saldo >= 0 ? "positivo" : "negativo"} />
        <StatCard label="Média de despesas/mês" valor={r.totalDespesas / 12} />
      </div>
      <Panel titulo="Receitas, despesas e saldo por mês">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comAcumulado}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="curto" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} width={70} tickFormatter={(v) => brl(Number(v))} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v) => brl(Number(v))} />
              <Legend />
              <Bar dataKey="receitas" name="Receitas" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="totalDespesas" name="Despesas" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="saldo" name="Saldo" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel titulo="Tabela anual">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Receitas</TableHead>
                <TableHead className="text-right">Fixas</TableHead>
                <TableHead className="text-right">Variáveis</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-right">Acumulado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comAcumulado.map((m) => (
                <TableRow key={m.mes}>
                  <TableCell className="font-medium">{m.nome}</TableCell>
                  <TableCell className="num text-right text-positive">{brl(m.receitas)}</TableCell>
                  <TableCell className="num text-right">{brl(m.despesasFixas)}</TableCell>
                  <TableCell className="num text-right">{brl(m.despesasVariaveis)}</TableCell>
                  <TableCell className={`num text-right font-medium ${m.saldo >= 0 ? "text-positive" : "text-negative"}`}>{brl(m.saldo)}</TableCell>
                  <TableCell className="num text-right text-muted-foreground">{brl(m.acumulado)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </div>
  );
}
