import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, CreditCard, Lightbulb, Plus, Repeat, Wallet } from "lucide-react";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, Panel, SeletorPeriodo, StatCard, Vazio } from "@/components/finance-ui";
import { LancamentoDialog } from "@/components/lancamento-dialog";
import { useLancamentos } from "@/lib/db";
import { usePeriodo } from "@/lib/periodo";
import { MESES, MESES_CURTOS, brl, dataBR, insights, porMes, porTipo, resumo, soma, totaisPorCategoria } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [
    { title: "Dashboard | Controle Financeiro 2026" },
    { name: "description", content: "Painel mensal com receitas, despesas fixas e variáveis, saldo, gastos por categoria e insights automáticos." },
    { property: "og:title", content: "Dashboard | Controle Financeiro 2026" },
    { property: "og:description", content: "Acompanhe receitas, despesas e saldo do mês em um painel visual." },
  ]}),
  component: Dashboard,
});

const CORES = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-chart-6)"];

function Dashboard() {
  const { mes, ano } = usePeriodo();
  const { data: todos = [], isLoading } = useLancamentos(ano);
  const [dialog, setDialog] = useState(false);
  const doMes = useMemo(() => todos.filter((l) => l.mes === mes), [todos, mes]);
  const doAnterior = useMemo(() => todos.filter((l) => l.mes === (mes === 1 ? 12 : mes - 1)), [todos, mes]);
  const r = resumo(doMes);
  const rAnt = resumo(doAnterior);
  const anual = porMes(todos);
  const saldoAcumulado = anual.filter((m) => m.mes <= mes).reduce((t, m) => t + m.saldo, 0);
  const categorias = totaisPorCategoria(doMes.filter((l) => l.tipo !== "receita")).slice(0, 6);
  const cartao = soma(doMes.filter((l) => l.forma_pagamento === "Cartão de crédito"));
  const fixas = porTipo(doMes, "despesa_fixa");
  const maiores = [...doMes.filter((l) => l.tipo !== "receita")].sort((a, b) => b.valor - a.valor).slice(0, 6);
  const dicas = insights(doMes, doAnterior, mes);

  return (
    <div className="space-y-6">
      <PageHeader titulo={`Dashboard · ${MESES[mes - 1]} ${ano}`} acoes={<><SeletorPeriodo /><Button onClick={() => setDialog(true)}><Plus className="size-4" /> Lançamento</Button></>} />

      {/* No celular: 2 cards por linha, compactos, evitando que os quatro cards ocupem a tela inteira. */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4">
        <StatCard className="p-3 sm:p-5" label="Receitas" valor={r.receitas} tom="positivo" icone={<ArrowUpRight className="size-4" />} detalhe={rAnt.receitas ? `Mês anterior: ${brl(rAnt.receitas)}` : undefined} />
        <StatCard className="p-3 sm:p-5" label="Despesas fixas" valor={r.despesasFixas} tom="negativo" icone={<Repeat className="size-4" />} detalhe={`${fixas.length} lançamento(s)`} />
        <StatCard className="p-3 sm:p-5" label="Despesas variáveis" valor={r.despesasVariaveis} tom="negativo" icone={<ArrowDownRight className="size-4" />} detalhe={rAnt.despesasVariaveis ? `Mês anterior: ${brl(rAnt.despesasVariaveis)}` : undefined} />
        <StatCard className="p-3 sm:p-5" label="Saldo do mês" valor={r.saldo} tom={r.saldo >= 0 ? "positivo" : "negativo"} icone={<Wallet className="size-4" />} detalhe={`Acumulado até aqui: ${brl(saldoAcumulado)}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel titulo={`Receitas x Despesas · ${ano}`}><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={anual}><defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} /></linearGradient><linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} /><XAxis dataKey="curto" stroke="var(--color-muted-foreground)" fontSize={12} /><YAxis stroke="var(--color-muted-foreground)" fontSize={12} width={70} tickFormatter={(v) => brl(Number(v))} /><Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v, n) => [brl(Number(v)), n === "receitas" ? "Receitas" : "Despesas"]} /><Legend formatter={(v) => (v === "receitas" ? "Receitas" : "Despesas")} /><Area type="monotone" dataKey="receitas" stroke="var(--color-chart-1)" fill="url(#gr)" strokeWidth={2} /><Area type="monotone" dataKey="totalDespesas" name="despesas" stroke="var(--color-chart-2)" fill="url(#gd)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></Panel>
        <Panel titulo="Gastos por categoria">{categorias.length ? <><div className="h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categorias} dataKey="total" nameKey="categoria" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">{categorias.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}</Pie><Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v) => brl(Number(v))} /></PieChart></ResponsiveContainer></div><ul className="mt-4 space-y-2">{categorias.map((c, i) => <li key={c.categoria} className="flex items-center gap-3 text-sm"><span className="size-2.5 rounded-full" style={{ backgroundColor: CORES[i % CORES.length] }} /><span className="flex-1 truncate text-muted-foreground">{c.categoria}</span><span className="num font-medium">{brl(c.total)}</span></li>)}</ul></> : <Vazio texto="Sem despesas neste mês." />}</Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel titulo="Insights" className="lg:col-span-1"><ul className="space-y-3">{dicas.map((d) => <li key={d} className="flex gap-3 text-sm text-muted-foreground"><Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" /><span>{d}</span></li>)}</ul></Panel>
        <Panel titulo="Maiores gastos do mês" className="lg:col-span-1">{maiores.length ? <ul className="space-y-3">{maiores.map((l) => <li key={l.id} className="flex items-center justify-between gap-3 text-sm"><div className="min-w-0"><p className="truncate font-medium">{l.subcategoria ?? l.descricao}</p><p className="text-xs text-muted-foreground">{l.categoria} · {dataBR(l.data)}</p></div><span className="num font-medium text-negative">{brl(l.valor)}</span></li>)}</ul> : <Vazio texto="Nenhum gasto registrado." />}</Panel>
        <Panel titulo="Cartão e fixas" className="lg:col-span-1"><div className="flex items-center justify-between rounded-xl bg-secondary/60 p-4"><div className="flex items-center gap-3"><CreditCard className="size-5 text-primary" /><div><p className="text-sm font-medium">Fatura do cartão</p><p className="text-xs text-muted-foreground">Lançamentos no crédito</p></div></div><span className="num font-semibold">{brl(cartao)}</span></div><ul className="mt-4 space-y-2">{fixas.slice(0, 6).map((l) => <li key={l.id} className="flex items-center justify-between gap-2 text-sm"><span className="truncate text-muted-foreground">{l.descricao}</span><Badge variant="secondary" className="num">{brl(l.valor)}</Badge></li>)}</ul>{!fixas.length ? <Vazio texto="Sem despesas fixas no mês." /> : null}</Panel>
      </div>
      {isLoading ? <p className="text-sm text-muted-foreground">Carregando dados...</p> : null}
      <LancamentoDialog open={dialog} onOpenChange={setDialog} mes={mes} ano={ano} />
    </div>
  );
}
