import { createFileRoute } from "@tanstack/react-router";
import { CategoriaPage } from "@/components/categoria-page";

export const Route = createFileRoute("/_authenticated/comida")({
  head: () => ({
    meta: [
      { title: "Comida | Controle Financeiro 2026" },
      {
        name: "description",
        content: "Detalhamento dos gastos com alimentação: total do mês, evolução anual e itens.",
      },
      { property: "og:title", content: "Comida | Controle Financeiro 2026" },
      { property: "og:description", content: "Controle detalhado dos gastos com alimentação." },
    ],
  }),
  component: () => (
    <CategoriaPage
      categoria="Comida"
      titulo="Comida"
      descricao="Gastos com alimentação, mercado e refeições."
      cor="var(--color-chart-4)"
    />
  ),
});
