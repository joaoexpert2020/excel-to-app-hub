import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, SeletorPeriodo, Vazio } from "@/components/finance-ui";
import { useInserirMuitos } from "@/lib/db";
import { usePeriodo } from "@/lib/periodo";
import { lerArquivo, type LinhaImportada } from "@/lib/planilha";
import { MESES, brl, tipoLabel } from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/importar")({
  head: () => ({
    meta: [
      { title: "Importar planilha | Controle Financeiro 2026" },
      { name: "description", content: "Importe a planilha CONTROLE FINANCEIRO em Excel sem duplicar lançamentos." },
      { property: "og:title", content: "Importar planilha | Controle Financeiro 2026" },
      { property: "og:description", content: "Importe a planilha CONTROLE FINANCEIRO em Excel sem duplicar lançamentos." },
    ],
  }),
  component: Importar,
});

function Importar() {
  const { ano } = usePeriodo();
  const [previa, setPrevia] = useState<LinhaImportada[]>([]);
  const inserir = useInserirMuitos();

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const linhas = lerArquivo(await file.arrayBuffer(), ano);
      setPrevia(linhas);
      toast.success(`${linhas.length} lançamento(s) encontrados na planilha.`);
    } catch {
      toast.error("Não foi possível ler a planilha.");
    }
  }

  async function importar() {
    const rows = previa.map(({ aba, ...r }) => ({ ...r }));
    void rows;
    const inseridos = await inserir.mutateAsync(previa.map(({ aba: _aba, ...r }) => r));
    toast.success(`${inseridos} novo(s) lançamento(s) importados. Duplicados foram ignorados.`);
    setPrevia([]);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Importar planilha"
        descricao="Envie sua planilha do Excel: o app lê as abas de meses e evita duplicidade."
        acoes={<SeletorPeriodo comMes={false} />}
      />
      <Panel titulo="Arquivo">
        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <FileSpreadsheet className="size-8 text-primary" />
          <span className="text-sm font-medium">Selecione o arquivo .xlsx ou .csv</span>
          <span className="text-xs text-muted-foreground">
            Os valores serão importados para o ano {ano}. Lançamentos idênticos já existentes são ignorados.
          </span>
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFile} />
        </label>
      </Panel>
      <Panel
        titulo={previa.length ? `Prévia · ${previa.length} lançamento(s)` : "Prévia"}
        acao={previa.length ? (
          <Button onClick={importar} disabled={inserir.isPending}>
            <Upload className="size-4" /> Importar
          </Button>
        ) : null}
      >
        {previa.length ? (
          <div className="max-h-[480px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aba</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Mês</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previa.slice(0, 200).map((l, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-muted-foreground">{l.aba}</TableCell>
                    <TableCell className="font-medium">{l.descricao}</TableCell>
                    <TableCell className="text-muted-foreground">{l.categoria}</TableCell>
                    <TableCell className="text-muted-foreground">{tipoLabel(l.tipo)}</TableCell>
                    <TableCell className="text-muted-foreground">{MESES[l.mes - 1]}</TableCell>
                    <TableCell className="num text-right">{brl(l.valor)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Vazio texto="Nenhum arquivo carregado ainda." />
        )}
      </Panel>
    </div>
  );
}
