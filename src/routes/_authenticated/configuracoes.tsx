import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/finance-ui";
import { useCartoes, useCategorias, useLancamentos, useRecorrencias } from "@/lib/db";
import { usePeriodo } from "@/lib/periodo";
import { baixar, exportar } from "@/lib/planilha";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações | Controle Financeiro 2026" },
      { name: "description", content: "Backup dos dados, exportação em Excel/CSV e informações do controle financeiro." },
      { property: "og:title", content: "Configurações | Controle Financeiro 2026" },
      { property: "og:description", content: "Backup dos dados, exportação em Excel/CSV e informações do controle financeiro." },
    ],
  }),
  component: Config,
});

function Config() {
  const { ano } = usePeriodo();
  const { data: lancamentos = [] } = useLancamentos(ano);
  const { data: categorias = [] } = useCategorias();
  const { data: cartoes = [] } = useCartoes();
  const { data: recorrencias = [] } = useRecorrencias();

  return (
    <div className="space-y-6">
      <PageHeader titulo="Configurações" descricao="Backup, exportação e estrutura do seu controle financeiro." />
      <Panel titulo="Backup e exportação">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => { exportar(lancamentos, "xlsx", `backup-${ano}`); toast.success("Excel gerado."); }}>
            <Download className="size-4" /> Excel {ano}
          </Button>
          <Button variant="secondary" onClick={() => { exportar(lancamentos, "csv", `backup-${ano}`); toast.success("CSV gerado."); }}>
            <Download className="size-4" /> CSV {ano}
          </Button>
          <Button variant="secondary" onClick={() => { baixar(JSON.stringify({ ano, lancamentos, categorias, cartoes, recorrencias }, null, 2), `backup-${ano}.json`, "application/json"); toast.success("Backup JSON gerado."); }}>
            <Download className="size-4" /> Backup completo (JSON)
          </Button>
        </div>
      </Panel>
      <Panel titulo="Estrutura atual">
        <ul className="grid gap-3 sm:grid-cols-2">
          <li className="rounded-lg bg-secondary/50 px-4 py-3 text-sm">Lançamentos em {ano}: <strong className="num">{lancamentos.length}</strong></li>
          <li className="rounded-lg bg-secondary/50 px-4 py-3 text-sm">Categorias: <strong className="num">{categorias.length}</strong></li>
          <li className="rounded-lg bg-secondary/50 px-4 py-3 text-sm">Cartões: <strong className="num">{cartoes.length}</strong></li>
          <li className="rounded-lg bg-secondary/50 px-4 py-3 text-sm">Recorrências: <strong className="num">{recorrencias.length}</strong></li>
        </ul>
      </Panel>
    </div>
  );
}
