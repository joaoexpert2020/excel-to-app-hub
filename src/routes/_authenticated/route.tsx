import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  CalendarRange,
  CreditCard,
  Home,
  ListOrdered,
  LogOut,
  Menu,
  Repeat,
  Settings,
  Upload,
  Utensils,
  Wallet,
  Wine,
  Boxes,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PeriodoProvider } from "@/lib/periodo";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: Layout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/lancamentos", label: "Lançamentos", icon: ListOrdered },
  { to: "/anual", label: "Visão anual", icon: CalendarRange },
  { to: "/relatorio", label: "Relatório", icon: BarChart3 },
  { to: "/cartao", label: "Cartão", icon: CreditCard },
] as const;

const NAV_CATEGORIAS = [
  { to: "/comida", label: "Comida", icon: Utensils },
  { to: "/cachaca", label: "Cachaça", icon: Wine },
  { to: "/outros", label: "Outros", icon: Boxes },
  { to: "/outras-receitas", label: "Outras receitas", icon: TrendingUp },
] as const;

const NAV_GESTAO = [
  { to: "/recorrencias", label: "Recorrências", icon: Repeat },
  { to: "/importar", label: "Importar planilha", icon: Upload },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

function Layout() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  async function sair() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const Grupo = ({
    titulo,
    itens,
  }: {
    titulo: string;
    itens: readonly { to: string; label: string; icon: typeof Home }[];
  }) => (
    <div className="mt-6 first:mt-0">
      <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        {titulo}
      </p>
      <nav className="grid gap-1">
        {itens.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setAberto(false)}
            activeProps={{
              className: "bg-sidebar-accent text-sidebar-accent-foreground",
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <PeriodoProvider>
      <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-[264px] overflow-y-auto border-r border-sidebar-border bg-sidebar p-4 transition-transform lg:static lg:translate-x-0",
            aberto ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-6 flex items-center gap-3 px-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Wallet className="size-5" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold">Controle Financeiro</p>
              <p className="text-xs text-muted-foreground">Pessoal · 2026</p>
            </div>
          </div>

          <Grupo titulo="Visão geral" itens={NAV} />
          <Grupo titulo="Categorias" itens={NAV_CATEGORIAS} />
          <Grupo titulo="Gestão" itens={NAV_GESTAO} />

          <Button variant="ghost" className="mt-8 w-full justify-start gap-3" onClick={sair}>
            <LogOut className="size-4" />
            Sair
          </Button>
        </aside>

        {aberto ? (
          <button
            aria-label="Fechar menu"
            className="fixed inset-0 z-30 bg-background/70 lg:hidden"
            onClick={() => setAberto(false)}
          />
        ) : null}

        <div className="min-w-0">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setAberto(true)}>
              <Menu className="size-5" />
            </Button>
            <span className="font-display text-sm font-semibold">Controle Financeiro</span>
          </header>
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </PeriodoProvider>
  );
}
