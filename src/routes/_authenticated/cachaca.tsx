import { createFileRoute } from "@tanstack/react-router";
import { CategoriaPage } from "@/components/categoria-page";

export const Route = createFileRoute("/_authenticated/cachaca")({
  head: () => ({
    meta: [
      { title: "Cachaça | Controle Financeiro 2026" },
      { name: "description", content: "Gastos com bebidas e cachaça, mês a mês." },
      { property: "og:title", content: "Cachaça | Controle Financeiro 2026" },
      { property: "og:description", content: "Gastos com bebidas e cachaça, mês a mês." },
    ],
  }),
  component: () => (
    <CategoriaPage
      categoria="Cachaça"
      titulo="Cachaça"
      descricao="Gastos com bebidas e cachaça, mês a mês."
      cor="var(--color-chart-5)"
    />
  ),
});
