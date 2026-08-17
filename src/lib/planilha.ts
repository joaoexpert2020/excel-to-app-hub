import * as XLSX from "xlsx";
import { MESES, type Lancamento, type TipoLancamento } from "./finance";

export interface LinhaImportada {
  descricao: string;
  tipo: TipoLancamento;
  categoria: string;
  subcategoria: string | null;
  valor: number;
  data: string;
  mes: number;
  ano: number;
  forma_pagamento: string;
  cartao: string | null;
  parcela_atual: number | null;
  total_parcelas: number | null;
  origem: string;
  aba: string;
}

const normalizar = (v: unknown) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

const MES_KEYS = MESES.map((m) => normalizar(m));

function numero(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return Number.isFinite(v) && v !== 0 ? v : null;
  const s = String(v)
    .replace(/[R$\s.]/g, "")
    .replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) && n !== 0 ? n : null;
}

/** Mapa aba -> configuração de importação */
const CONFIG: Record<
  string,
  { categoria: string; tipo: TipoLancamento; forma: string; cartao?: string; parcelas?: boolean }
> = {
  COMIDA: { categoria: "Comida", tipo: "despesa_variavel", forma: "Dinheiro" },
  CACHACA: { categoria: "Cachaça", tipo: "despesa_variavel", forma: "Dinheiro" },
  OUTROS: { categoria: "Outros", tipo: "despesa_variavel", forma: "Dinheiro" },
  CARTAO: {
    categoria: "Cartão",
    tipo: "despesa_variavel",
    forma: "Cartão de crédito",
    cartao: "Cartão Principal",
    parcelas: true,
  },
  "OUTRAS RECEITAS": { categoria: "Outras receitas", tipo: "receita", forma: "Conta" },
};

/** Localiza, na matriz, a linha de cabeçalho com os meses e as colunas de cada mês. */
function detectarMeses(matriz: unknown[][]) {
  for (let i = 0; i < Math.min(matriz.length, 12); i++) {
    const linha = matriz[i] ?? [];
    const colunas: Record<number, number> = {};
    linha.forEach((cel, idx) => {
      const txt = normalizar(cel);
      const m = MES_KEYS.findIndex((k) => txt.startsWith(k));
      if (m >= 0 && colunas[m + 1] === undefined) colunas[m + 1] = idx;
    });
    if (Object.keys(colunas).length >= 6)
      return { headerRow: i, colunas: colunas as Record<number, number> };
  }
  return null;
}

/** Coluna de descrição: primeira coluna à esquerda do primeiro mês com textos. */
function colunaDescricao(matriz: unknown[][], headerRow: number, primeiraColMes: number) {
  let melhor = 0;
  let maxTextos = -1;
  for (let c = 0; c < primeiraColMes; c++) {
    let textos = 0;
    for (let r = headerRow + 1; r < matriz.length; r++) {
      const v = matriz[r]?.[c];
      if (typeof v === "string" && v.trim().length > 1) textos++;
    }
    if (textos > maxTextos) {
      maxTextos = textos;
      melhor = c;
    }
  }
  return melhor;
}

export function lerArquivo(buffer: ArrayBuffer, ano: number): LinhaImportada[] {
  const wb = XLSX.read(buffer, { type: "array" });
  const linhas: LinhaImportada[] = [];

  for (const nomeAba of wb.SheetNames) {
    const key = normalizar(nomeAba);
    if (key === "RELATORIO") continue; // relatórios são recalculados pelo app

    const ws = wb.Sheets[nomeAba];
    if (!ws) continue;
    const matriz = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: true });
    const det = detectarMeses(matriz);
    if (!det) continue;
    const colsMes = det.colunas;
    const primeira = Math.min(...Object.values(colsMes));
    const colDesc = colunaDescricao(matriz, det.headerRow, primeira);
    const conf = CONFIG[key];

    // Aba FINANCEIRO: as seções definem o tipo, e as categorias detalhadas
    // em abas próprias são ignoradas para não somar duas vezes.
    let secao: TipoLancamento | null = null;
    const agregadas = ["COMIDA", "CACHACA", "CARTAO", "OUTROS", "OUTRAS"];

    for (let r = det.headerRow + 1; r < matriz.length; r++) {
      const linha = matriz[r] ?? [];
      if (!conf) {
        const marcador = linha
          .slice(0, colDesc)
          .map((c) => normalizar(c))
          .join(" ");
        if (marcador.includes("RECEITA")) secao = "receita";
        else if (marcador.includes("FIXA")) secao = "despesa_fixa";
        else if (marcador.includes("VARIAV")) secao = "despesa_variavel";
      }

      const desc = String(linha[colDesc] ?? "").trim();
      if (!desc) continue;
      const descKey = normalizar(desc);
      if (descKey === "TOTAL" || descKey === "DESCRICAO") continue;
      if (!conf && (!secao || agregadas.includes(descKey))) continue;

      const tipo = conf ? conf.tipo : (secao as TipoLancamento);
      const categoria = conf
        ? conf.categoria
        : tipo === "receita" && descKey === "SALARIO"
          ? "Salário"
          : titulo(desc);
      const forma = conf
        ? conf.forma
        : tipo === "receita"
          ? "Conta"
          : tipo === "despesa_fixa"
            ? "Débito automático"
            : "Dinheiro";
      const dia = tipo === "despesa_variavel" && conf ? 10 : tipo === "receita" ? 5 : 5;

      const valoresMes: (number | null)[] = [];
      for (let m = 1; m <= 12; m++) {
        const col = colsMes[m];
        valoresMes.push(col === undefined ? null : numero(linha[col]));
      }

      const preenchidos = valoresMes.map((v, i) => (v ? i + 1 : 0)).filter(Boolean) as number[];
      const grupos: number[][] = [];
      if (conf?.parcelas && preenchidos.length) {
        let atual = [preenchidos[0] as number];
        for (const m of preenchidos.slice(1)) {
          if (m === (atual[atual.length - 1] as number) + 1) atual.push(m);
          else {
            grupos.push(atual);
            atual = [m];
          }
        }
        grupos.push(atual);
      }

      for (const mes of preenchidos) {
        const valor = valoresMes[mes - 1] as number;
        let parcela: number | null = null;
        let total: number | null = null;
        if (conf?.parcelas) {
          const g = grupos.find((x) => x.includes(mes));
          if (g && g.length > 1) {
            parcela = g.indexOf(mes) + 1;
            total = g.length;
          }
        }
        linhas.push({
          descricao: desc.toUpperCase(),
          tipo,
          categoria,
          subcategoria: conf ? desc.toUpperCase() : null,
          valor: Math.round(valor * 100) / 100,
          data: `${ano}-${String(mes).padStart(2, "0")}-${String(conf?.parcelas ? 10 : dia).padStart(2, "0")}`,
          mes,
          ano,
          forma_pagamento: forma,
          cartao: conf?.cartao ?? null,
          parcela_atual: parcela,
          total_parcelas: total,
          origem: "planilha",
          aba: nomeAba,
        });
      }
    }
  }
  return linhas;
}

function titulo(s: string) {
  return s
    .toLowerCase()
    .split(" ")
    .map((p) => (p.length > 2 ? p.charAt(0).toUpperCase() + p.slice(1) : p))
    .join(" ")
    .trim();
}

export function exportar(
  lancamentos: Lancamento[],
  formato: "xlsx" | "csv",
  nome = "controle-financeiro",
) {
  const dados = lancamentos.map((l) => ({
    Data: l.data,
    Descrição: l.descricao,
    Tipo: l.tipo,
    Categoria: l.categoria,
    Subcategoria: l.subcategoria ?? "",
    Valor: Number(l.valor),
    Mês: MESES[l.mes - 1],
    Ano: l.ano,
    "Forma de pagamento": l.forma_pagamento ?? "",
    Cartão: l.cartao ?? "",
    Parcela: l.parcela_atual ? `${l.parcela_atual}/${l.total_parcelas}` : "",
    Observação: l.observacao ?? "",
  }));
  const ws = XLSX.utils.json_to_sheet(dados);
  if (formato === "csv") {
    baixar(XLSX.utils.sheet_to_csv(ws, { FS: ";" }), `${nome}.csv`, "text/csv;charset=utf-8");
    return;
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Lançamentos");
  XLSX.writeFile(wb, `${nome}.xlsx`);
}

export function baixar(conteudo: string, nome: string, mime: string) {
  const blob = new Blob(["\ufeff" + conteudo], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}
