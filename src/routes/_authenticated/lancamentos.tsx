import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { exportar } from "@/lib/planilha";
import { MESES, brl, dataBR, resumo, tipoLabel, type Lancamento } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/lancamentos")({
  head: () => ({
    meta: [
      { title: "Lançamentos | Controle Financeiro 2026" },
      {
        name: "description",
        content:
          "Cadastre, edite, filtre e exporte todos os lançamentos financeiros do mês ou do ano inteiro.",
      },
      { property: "og:title", content: "Lançamentos | Controle Financeiro 2026" },
      {
        property: "og:description",
        content: "Gestão completa das receitas e despesas com filtros e exportação.",
      },
    ],
  }),
  component: Lancamentos,
});

function Lancamentos() {
  const { mes, ano } = usePeriodo();
  const { data: todos = [], isLoading } = useLancamentos(ano);
  const excluir = useExcluirLancamento();

  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [escopo, setEscopo] = useState<"mes" | "ano">("mes");
  const [dialog, setDialog] = useState(false);
  const [edit, setEdit] = useState<Lancamento | null>(null);

  const categoriasDisponiveis = useMemo(
    () => [...new Set(todos.map((l) => l.categoria))].sort(),
    [todos],
  );

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return todos
      .filter((l) => (escopo === "mes" ? l.mes === mes : true))
      .filter((l) => (filtroTipo === "todos" ? true : l.tipo === filtroTipo))
      .filter((l) => (filtroCategoria === "todas" ? true : l.categoria === filtroCategoria))
      .filter((l) =>
        termo
          ? `${l.descricao} ${l.subcategoria ?? ""} ${l.categoria}`.toLowerCase().includes(termo)
          : true,
      )
      .sort((a, b) => (a.data < b.data ? 1 : -1));
  }, [todos, escopo, mes, filtroTipo, filtroCategoria, busca]);

  const r = resumo(lista);

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Lançamentos"
        descricao="Todas as receitas e despesas, com filtros, parcelamentos e exportação."
        acoes={
          <>
            <SeletorPeriodo />
            <Button
              variant="secondary"
              onClick={() => {
                exportar(lista, "xlsx", `lancamentos-${ano}`);
                toast.success("Arquivo Excel gerado.");
              }}
            >
              <Download className="size-4" /> Excel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                exportar(lista, "csv", `lancamentos-${ano}`);
                toast.success("Arquivo CSV gerado.");
              }}
            >
              <Download className="size-4" /> CSV
            </Button>
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
        <StatCard label="Receitas" valor={r.receitas} tom="positivo" />
        <StatCard label="Despesas fixas" valor={r.despesasFixas} tom="negativo" />
        <StatCard label="Despesas variáveis" valor={r.despesasVariaveis} tom="negativo" />
        <StatCard label="Saldo" valor={r.saldo} tom={r.saldo >= 0 ? "positivo" : "negativo"} />
      </div>

      <Panel>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por descrição ou categoria"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa_fixa">Despesas fixas</SelectItem>
              <SelectItem value="despesa_variavel">Despesas variáveis</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categoriasDisponiveis.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            variant={escopo === "mes" ? "default" : "secondary"}
            size="sm"
            onClick={() => setEscopo("mes")}
          >
            {MESES[mes - 1]}
          </Button>
          <Button
            variant={escopo === "ano" ? "default" : "secondary"}
            size="sm"
            onClick={() => setEscopo("ano")}
          >
            Ano {ano}
          </Button>
        </div>
      </Panel>

      <Panel titulo={`${lista.length} lançamento(s)`}>
        {isLoading ? (
          <Vazio texto="Carregando..." />
        ) : lista.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="num whitespace-nowrap text-muted-foreground">
                      {dataBR(l.data)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {l.subcategoria ?? l.descricao}
                      {l.total_parcelas ? (
                        <Badge variant="outline" className="num ml-2">
                          {l.parcela_atual}/{l.total_parcelas}
                        </Badge>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{l.categoria}</TableCell>
                    <TableCell>
                      <Badge variant={l.tipo === "receita" ? "default" : "secondary"}>
                        {tipoLabel(l.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {l.forma_pagamento ?? "—"}
                    </TableCell>
                    <TableCell
                      className={`num text-right font-medium ${l.tipo === "receita" ? "text-positive" : "text-negative"}`}
                    >
                      {brl(l.valor)}
                    </TableCell>
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
          <Vazio texto="Nenhum lançamento encontrado com esses filtros." />
        )}
      </Panel>

      <LancamentoDialog
        open={dialog}
        onOpenChange={setDialog}
        lancamento={edit}
        mes={mes}
        ano={ano}
      />
    </div>
  );
}
