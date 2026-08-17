import { createFileRoute } from "@tanstack/react-router";
import { CategoriaPage } from "@/components/categoria-page";

export const Route = createFileRoute("/_authenticated/outros")({
  head: () => ({
    meta: [
      { title: "Outros | Controle Financeiro 2026" },
      { name: "description", content: "Gastos diversos que não entram nas demais categorias." },
      { property: "og:title", content: "Outros | Controle Financeiro 2026" },
      { property: "og:description", content: "Gastos diversos que não entram nas demais categorias." },
    ],
  }),
  component: () => (
    <CategoriaPage
      categoria="Outros"
      titulo="Outros"
      descricao="Gastos diversos que não entram nas demais categorias."
      cor="var(--color-chart-3)"
    />
  ),
});
