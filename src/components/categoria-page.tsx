import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Panel, SeletorPeriodo, StatCard, Vazio } from "@/components/finance-ui";
import { LancamentoDialog } from "@/components/lancamento-dialog";
import { useExcluirLancamento, useLancamentos } from "@/lib/db";
import { usePeriodo } from "@/lib/periodo";
import {
  MESES,
  MESES_CURTOS,
  brl,
  dataBR,
  soma,
  totaisPorSubcategoria,
  type Lancamento,
  type TipoLancamento,
} from "@/lib/finance";

export function CategoriaPage({
  categoria,
  titulo,
  descricao,
  tipo = "despesa_variavel",
  cor = "var(--color-chart-1)",
}: {
  categoria: string;
  titulo: string;
  descricao: string;
  tipo?: TipoLancamento;
  cor?: string;
}) {
  const { mes, ano } = usePeriodo();
  const { data: todos = [], isLoading } = useLancamentos(ano);
  const excluir = useExcluirLancamento();
  const [dialog, setDialog] = useState(false);
  const [edit, setEdit] = useState<Lancamento | null>(null);

  const daCategoria = useMemo(
    () => todos.filter((l) => l.categoria === categoria),
    [todos, categoria],
  );
  const doMes = daCategoria.filter((l) => l.mes === mes);
  const anterior = daCategoria.filter((l) => l.mes === (mes === 1 ? 12 : mes - 1));

  const totalMes = soma(doMes);
  const totalAno = soma(daCategoria);
  const mediaMensal = totalAno / (new Set(daCategoria.map((l) => l.mes)).size || 1);
  const grafico = MESES.map((_, i) => ({
    mes: MESES_CURTOS[i],
    total: soma(daCategoria.filter((l) => l.mes === i + 1)),
  }));
  const ranking = totaisPorSubcategoria(daCategoria).slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        titulo={titulo}
        descricao={descricao}
        acoes={
          <>
            <SeletorPeriodo />
            <Button
              onClick={() => {
                setEdit(null);
                setDialog(true);
              }}
            >
              <Plus className="size-4" /> Novo
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={`Total de ${MESES[mes - 1]}`} valor={totalMes} tom={tipo === "receita" ? "positivo" : "negativo"} />
        <StatCard
          label="Mês anterior"
          valor={soma(anterior)}
          detalhe={
            soma(anterior) > 0
              ? `${totalMes >= soma(anterior) ? "Aumento" : "Redução"} de ${brl(Math.abs(totalMes - soma(anterior)))}`
              : "Sem histórico"
          }
        />
        <StatCard label="Total no ano" valor={totalAno} />
        <StatCard label="Média mensal" valor={mediaMensal} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel titulo={`Evolução mensal · ${ano}`}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={grafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} width={70} tickFormatter={(v) => brl(Number(v))} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                  formatter={(v) => brl(Number(v))}
                />
                <Bar dataKey="total" fill={cor} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel titulo="Maiores itens do ano">
          {ranking.length ? (
            <ul className="space-y-3">
              {ranking.map((r) => (
                <li key={r.item} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-muted-foreground">{r.item}</span>
                  <span className="num font-medium">{brl(r.total)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Vazio texto="Sem itens registrados." />
          )}
        </Panel>
      </div>

      <Panel titulo={`Lançamentos de ${MESES[mes - 1]}`}>
        {isLoading ? (
          <Vazio texto="Carregando..." />
        ) : doMes.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {doMes.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="num whitespace-nowrap text-muted-foreground">
                      {dataBR(l.data)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {l.subcategoria ?? l.descricao}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {l.forma_pagamento ?? "—"}
                    </TableCell>
                    <TableCell className="num text-right font-medium">{brl(l.valor)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Editar"
                          onClick={() => {
                            setEdit(l);
                            setDialog(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Excluir"
                          onClick={async () => {
                            await excluir.mutateAsync(l.id);
                            toast.success("Lançamento excluído.");
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Vazio texto={`Nenhum lançamento de ${titulo} em ${MESES[mes - 1]}.`} />
        )}
      </Panel>

      <LancamentoDialog
        open={dialog}
        onOpenChange={setDialog}
        lancamento={edit}
        categoriaFixa={categoria}
        tipoPadrao={tipo}
        mes={mes}
        ano={ano}
      />
    </div>
  );
}
