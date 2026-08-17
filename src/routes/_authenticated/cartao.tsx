import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { PageHeader, Panel, SeletorPeriodo, StatCard, Vazio } from "@/components/finance-ui";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCartoes, useLancamentos } from "@/lib/db";
import { usePeriodo } from "@/lib/periodo";
import { MESES, MESES_CURTOS, brl, dataBR, soma } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/cartao")({
  head: () => ({
    meta: [
      { title: "Cartão | Controle Financeiro 2026" },
      { name: "description", content: "Fatura do mês, limite disponível e controle de compras parceladas." },
      { property: "og:title", content: "Cartão | Controle Financeiro 2026" },
      { property: "og:description", content: "Fatura do mês, limite disponível e controle de compras parceladas." },
    ],
  }),
  component: Cartoes,
});

function Cartoes() {
  const { mes, ano } = usePeriodo();
  const { data: todos = [] } = useLancamentos(ano);
  const { data: cartoes = [] } = useCartoes();
  const noCredito = todos.filter((l) => l.forma_pagamento === "Cartão de crédito");
  const doMes = noCredito.filter((l) => l.mes === mes);
  const fatura = soma(doMes);
  const parceladas = noCredito.filter((l) => l.total_parcelas && l.total_parcelas > 1);
  const futuras = parceladas.filter((l) => l.mes > mes);

  return (
    <div className="space-y-6">
      <PageHeader titulo="Cartão de crédito" descricao="Fatura, limite e parcelamentos em andamento." acoes={<SeletorPeriodo />} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={`Fatura de ${MESES[mes - 1]}`} valor={fatura} tom="negativo" icone={<CreditCard className="size-4" />} />
        <StatCard label="Total no crédito no ano" valor={soma(noCredito)} />
        <StatCard label="Parcelas futuras" valor={soma(futuras)} detalhe={`${futuras.length} parcela(s) a vencer`} tom="aviso" />
        <StatCard label="Média mensal da fatura" valor={soma(noCredito) / 12} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel titulo="Meus cartões">
          {cartoes.length ? (
            <ul className="space-y-4">
              {cartoes.map((c) => {
                const usoMes = soma(doMes.filter((l) => l.cartao === c.nome));
                const uso = c.limite ? Math.min((usoMes / c.limite) * 100, 100) : 0;
                return (
                  <li key={c.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{c.nome}</p>
                      <Badge variant="secondary">Fecha dia {c.dia_fechamento} · vence {c.dia_vencimento}</Badge>
                    </div>
                    <Progress value={uso} className="mt-3" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {brl(usoMes)} usados de {brl(c.limite)} · disponível {brl(Math.max(c.limite - usoMes, 0))}
                    </p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Vazio texto="Nenhum cartão cadastrado." />
          )}
        </Panel>
        <Panel titulo="Fatura por mês">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MESES_CURTOS.map((m, i) => (
              <li key={m} className="rounded-lg bg-secondary/50 px-3 py-2">
                <p className="text-xs text-muted-foreground">{m}</p>
                <p className="num text-sm font-medium">{brl(soma(noCredito.filter((l) => l.mes === i + 1)))}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel titulo="Compras parceladas">
        {parceladas.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parceladas.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="num text-muted-foreground">{dataBR(l.data)}</TableCell>
                    <TableCell className="font-medium">{l.subcategoria ?? l.descricao}</TableCell>
                    <TableCell><Badge variant="outline" className="num">{l.parcela_atual}/{l.total_parcelas}</Badge></TableCell>
                    <TableCell className="num text-right">{brl(l.valor)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Vazio texto="Nenhuma compra parcelada registrada." />
        )}
      </Panel>
    </div>
  );
}
