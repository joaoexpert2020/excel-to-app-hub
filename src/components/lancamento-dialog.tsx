import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FORMAS_PAGAMENTO,
  TIPOS,
  type Lancamento,
  type TipoLancamento,
} from "@/lib/finance";
import { useCartoes, useCategorias, useInserirMuitos, useSalvarLancamento } from "@/lib/db";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lancamento?: Lancamento | null;
  categoriaFixa?: string;
  tipoPadrao?: TipoLancamento;
  ano: number;
  mes: number;
}

export function LancamentoDialog({
  open,
  onOpenChange,
  lancamento,
  categoriaFixa,
  tipoPadrao = "despesa_variavel",
  ano,
  mes,
}: Props) {
  const { data: categorias = [] } = useCategorias();
  const { data: cartoes = [] } = useCartoes();
  const salvar = useSalvarLancamento();
  const muitos = useInserirMuitos();

  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<TipoLancamento>(tipoPadrao);
  const [categoria, setCategoria] = useState(categoriaFixa ?? "");
  const [subcategoria, setSubcategoria] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [forma, setForma] = useState("Dinheiro");
  const [cartao, setCartao] = useState<string>("");
  const [observacao, setObservacao] = useState("");
  const [parcelado, setParcelado] = useState(false);
  const [parcelas, setParcelas] = useState("2");
  const [valorTotal, setValorTotal] = useState(true);

  useEffect(() => {
    if (!open) return;
    if (lancamento) {
      setDescricao(lancamento.descricao);
      setTipo(lancamento.tipo);
      setCategoria(lancamento.categoria);
      setSubcategoria(lancamento.subcategoria ?? "");
      setValor(String(lancamento.valor));
      setData(lancamento.data.slice(0, 10));
      setForma(lancamento.forma_pagamento ?? "Dinheiro");
      setCartao(lancamento.cartao ?? "");
      setObservacao(lancamento.observacao ?? "");
      setParcelado(false);
    } else {
      setDescricao("");
      setTipo(tipoPadrao);
      setCategoria(categoriaFixa ?? "");
      setSubcategoria("");
      setValor("");
      setData(`${ano}-${String(mes).padStart(2, "0")}-${String(Math.min(new Date().getDate(), 28)).padStart(2, "0")}`);
      setForma(tipoPadrao === "receita" ? "Conta" : "Dinheiro");
      setCartao("");
      setObservacao("");
      setParcelado(false);
      setParcelas("2");
    }
  }, [open, lancamento, categoriaFixa, tipoPadrao, ano, mes]);

  const opcoesCategoria = [
    ...new Set([
      ...categorias.filter((c) => !c.parent_nome).map((c) => c.nome),
      ...(categoria ? [categoria] : []),
    ]),
  ].sort();

  const subOpcoes = categorias
    .filter((c) => c.parent_nome === categoria)
    .map((c) => c.nome);

  async function handleSalvar() {
    const numero = Number(valor.replace(/\./g, "").replace(",", "."));
    if (!descricao.trim()) { toast.error("Informe a descrição."); return; }
    if (!categoria) { toast.error("Selecione a categoria."); return; }
    if (!Number.isFinite(numero) || numero <= 0) { toast.error("Informe um valor válido."); return; }
    if (!data) { toast.error("Informe a data."); return; }

    const base = {
      descricao: descricao.trim().toUpperCase(),
      tipo,
      categoria,
      subcategoria: subcategoria.trim() ? subcategoria.trim().toUpperCase() : null,
      forma_pagamento: forma,
      cartao: forma === "Cartão de crédito" ? cartao || null : null,
      observacao: observacao.trim() || null,
      origem: "app",
    };

    try {
      if (parcelado && !lancamento) {
        const total = Math.max(2, Number(parcelas) || 2);
        const valorParcela = valorTotal
          ? Math.round((numero / total) * 100) / 100
          : Math.round(numero * 100) / 100;
        const grupo = crypto.randomUUID();
        const inicio = new Date(`${data}T12:00:00`);
        const rows = Array.from({ length: total }, (_, i) => {
          const d = new Date(inicio);
          d.setMonth(d.getMonth() + i);
          return {
            ...base,
            valor: valorParcela,
            data: d.toISOString().slice(0, 10),
            mes: d.getMonth() + 1,
            ano: d.getFullYear(),
            parcela_atual: i + 1,
            total_parcelas: total,
            grupo_id: grupo,
          };
        });
        await muitos.mutateAsync(rows);
        toast.success(`${total} parcelas lançadas.`);
      } else {
        const d = new Date(`${data}T12:00:00`);
        await salvar.mutateAsync({
          id: lancamento?.id,
          values: {
            ...base,
            valor: Math.round(numero * 100) / 100,
            data,
            mes: d.getMonth() + 1,
            ano: d.getFullYear(),
          },
        });
        toast.success(lancamento ? "Lançamento atualizado." : "Lançamento adicionado.");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{lancamento ? "Editar lançamento" : "Novo lançamento"}</DialogTitle>
          <DialogDescription>
            Registre receitas e despesas com categoria, forma de pagamento e parcelamento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex.: MERCADO, SPOTIFY, SALÁRIO"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as TipoLancamento)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria} disabled={!!categoriaFixa}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {opcoesCategoria.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {subOpcoes.length ? (
            <div className="grid gap-2">
              <Label>Subcategoria</Label>
              <Select
                value={subcategoria}
                onValueChange={(v) => setSubcategoria(v === "__none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Opcional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Sem subcategoria</SelectItem>
                  {subOpcoes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                inputMode="decimal"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Forma de pagamento</Label>
              <Select value={forma} onValueChange={setForma}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FORMAS_PAGAMENTO.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {forma === "Cartão de crédito" ? (
              <div className="grid gap-2">
                <Label>Cartão</Label>
                <Select value={cartao} onValueChange={setCartao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {cartoes.map((c) => (
                      <SelectItem key={c.id} value={c.nome}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          {!lancamento ? (
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="parcelado">Compra parcelada</Label>
                  <p className="text-xs text-muted-foreground">
                    Gera um lançamento por mês, com controle de parcelas.
                  </p>
                </div>
                <Switch id="parcelado" checked={parcelado} onCheckedChange={setParcelado} />
              </div>
              {parcelado ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="parcelas">Nº de parcelas</Label>
                    <Input
                      id="parcelas"
                      type="number"
                      min={2}
                      max={48}
                      value={parcelas}
                      onChange={(e) => setParcelas(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>O valor informado é</Label>
                    <Select
                      value={valorTotal ? "total" : "parcela"}
                      onValueChange={(v) => setValorTotal(v === "total")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">O total da compra</SelectItem>
                        <SelectItem value="parcela">O valor de cada parcela</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="obs">Observação</Label>
            <Textarea
              id="obs"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={salvar.isPending || muitos.isPending}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
