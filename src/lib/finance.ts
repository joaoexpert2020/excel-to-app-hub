export type TipoLancamento = "receita" | "despesa_fixa" | "despesa_variavel";

export interface Lancamento {
  id: string;
  descricao: string;
  tipo: TipoLancamento;
  categoria: string;
  subcategoria: string | null;
  valor: number;
  data: string;
  mes: number;
  ano: number;
  forma_pagamento: string | null;
  conta: string | null;
  cartao: string | null;
  parcela_atual: number | null;
  total_parcelas: number | null;
  grupo_id: string | null;
  observacao: string | null;
  origem: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Cartao {
  id: string;
  nome: string;
  limite: number;
  dia_fechamento: number;
  dia_vencimento: number;
  ativo: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: TipoLancamento;
  parent_nome: string | null;
  ordem: number;
  ativo: boolean;
}

export interface Recorrencia {
  id: string;
  descricao: string;
  tipo: TipoLancamento;
  categoria: string;
  valor: number;
  periodicidade: string;
  dia: number;
  forma_pagamento: string | null;
  cartao: string | null;
  ativo: boolean;
}

export const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const MESES_CURTOS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const TIPOS: { value: TipoLancamento; label: string }[] = [
  { value: "receita", label: "Receita" },
  { value: "despesa_fixa", label: "Despesa fixa" },
  { value: "despesa_variavel", label: "Despesa variável" },
];

export const FORMAS_PAGAMENTO = [
  "Dinheiro",
  "Pix",
  "Débito",
  "Débito automático",
  "Cartão de crédito",
  "Conta",
  "Boleto",
];

export const tipoLabel = (t: TipoLancamento) =>
  TIPOS.find((x) => x.value === t)?.label ?? t;

export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(v) ? v : 0,
  );

export const brlCompact = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: Math.abs(v) >= 10000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(v) >= 10000 ? 1 : 2,
  }).format(Number.isFinite(v) ? v : 0);

export const dataBR = (iso: string) => {
  const [a, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
};

export const soma = (l: Lancamento[]) => l.reduce((t, x) => t + Number(x.valor), 0);

export const porTipo = (l: Lancamento[], tipo: TipoLancamento) =>
  l.filter((x) => x.tipo === tipo);

export interface Resumo {
  receitas: number;
  despesasFixas: number;
  despesasVariaveis: number;
  totalDespesas: number;
  saldo: number;
}

export function resumo(l: Lancamento[]): Resumo {
  const receitas = soma(porTipo(l, "receita"));
  const despesasFixas = soma(porTipo(l, "despesa_fixa"));
  const despesasVariaveis = soma(porTipo(l, "despesa_variavel"));
  const totalDespesas = despesasFixas + despesasVariaveis;
  return {
    receitas,
    despesasFixas,
    despesasVariaveis,
    totalDespesas,
    saldo: receitas - totalDespesas,
  };
}

export function porMes(l: Lancamento[]) {
  return MESES.map((nome, i) => {
    const mes = i + 1;
    const doMes = l.filter((x) => x.mes === mes);
    return { mes, nome, curto: MESES_CURTOS[i], ...resumo(doMes) };
  });
}

export function totaisPorCategoria(l: Lancamento[]) {
  const map = new Map<string, number>();
  for (const x of l) map.set(x.categoria, (map.get(x.categoria) ?? 0) + Number(x.valor));
  return [...map.entries()]
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total);
}

export function totaisPorSubcategoria(l: Lancamento[]) {
  const map = new Map<string, number>();
  for (const x of l) {
    const k = x.subcategoria || x.descricao;
    map.set(k, (map.get(k) ?? 0) + Number(x.valor));
  }
  return [...map.entries()]
    .map(([item, total]) => ({ item, total }))
    .sort((a, b) => b.total - a.total);
}

export function variacao(atual: number, anterior: number) {
  if (!anterior) return null;
  return ((atual - anterior) / Math.abs(anterior)) * 100;
}

export const pct = (v: number) =>
  `${v > 0 ? "↑" : "↓"} ${Math.abs(v).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

export function insights(
  doMes: Lancamento[],
  doMesAnterior: Lancamento[],
  mes: number,
): string[] {
  const out: string[] = [];
  const r = resumo(doMes);
  const ra = resumo(doMesAnterior);
  if (!doMes.length) return [`Nenhum lançamento registrado em ${MESES[mes - 1]}.`];

  out.push(
    r.saldo >= 0
      ? `Em ${MESES[mes - 1]} você fechou com saldo positivo de ${brl(r.saldo)}.`
      : `Em ${MESES[mes - 1]} suas despesas superaram as receitas em ${brl(Math.abs(r.saldo))}.`,
  );

  const v = variacao(r.totalDespesas, ra.totalDespesas);
  if (v !== null)
    out.push(
      `Seus gastos ${v >= 0 ? "aumentaram" : "diminuíram"} ${Math.abs(v).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% em relação ao mês anterior.`,
    );

  const cats = totaisPorCategoria(doMes.filter((x) => x.tipo !== "receita"));
  const maior = cats[0];
  if (maior) {
    out.push(`Seu maior gasto do mês foi ${maior.categoria} com ${brl(maior.total)}.`);
    if (r.totalDespesas > 0)
      out.push(
        `${maior.categoria} representa ${((maior.total / r.totalDespesas) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}% das suas despesas.`,
      );
  }

  const comida = soma(doMes.filter((x) => x.categoria === "Comida"));
  if (comida > 0) out.push(`Você gastou ${brl(comida)} com alimentação este mês.`);

  const cartao = soma(doMes.filter((x) => x.forma_pagamento === "Cartão de crédito"));
  if (cartao > 0 && r.totalDespesas > 0)
    out.push(
      `O cartão representa ${((cartao / r.totalDespesas) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}% das suas despesas (${brl(cartao)}).`,
    );

  return out;
}

export function chaveLogica(l: {
  descricao: string;
  categoria: string;
  subcategoria?: string | null;
  mes: number;
  ano: number;
  valor: number;
  tipo: string;
}) {
  return [
    l.descricao.toLowerCase(),
    l.categoria,
    l.subcategoria ?? "",
    l.mes,
    l.ano,
    Number(l.valor).toFixed(2),
    l.tipo,
  ].join("|");
}
