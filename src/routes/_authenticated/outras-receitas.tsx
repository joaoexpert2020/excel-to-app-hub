import { createFileRoute } from "@tanstack/react-router";
import { CategoriaPage } from "@/components/categoria-page";

export const Route = createFileRoute("/_authenticated/outras-receitas")({
  head: () => ({
    meta: [
      { title: "Outras receitas | Controle Financeiro 2026" },
      { name: "description", content: "Receitas extras além do salário." },
      { property: "og:title", content: "Outras receitas | Controle Financeiro 2026" },
      { property: "og:description", content: "Receitas extras além do salário." },
    ],
  }),
  component: () => (
    <CategoriaPage
      categoria="Outras receitas"
      titulo="Outras receitas"
      descricao="Receitas extras além do salário."
      cor="var(--color-chart-1)"
      tipo="receita"
    />
  ),
});
