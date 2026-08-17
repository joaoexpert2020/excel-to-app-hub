import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar | Controle Financeiro 2026" },
      {
        name: "description",
        content:
          "Acesse seu controle financeiro pessoal: receitas, despesas fixas e variáveis, cartões e relatórios mensais.",
      },
      { property: "og:title", content: "Entrar | Controle Financeiro 2026" },
      {
        property: "og:description",
        content: "Acesse seu painel de controle financeiro pessoal.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/dashboard" });
  }

  async function criarConta(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { emailRedirectTo: window.location.origin },
    });
    setCarregando(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Conta criada! Verifique seu e-mail se a confirmação estiver ativa.");
    navigate({ to: "/dashboard" });
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Wallet className="size-6" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold">Controle Financeiro 2026</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Suas receitas, despesas e cartões em um só lugar.
          </p>
        </div>

        <div className="panel p-6">
          <Tabs defaultValue="entrar">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="entrar">Entrar</TabsTrigger>
              <TabsTrigger value="criar">Criar conta</TabsTrigger>
            </TabsList>

            {(["entrar", "criar"] as const).map((aba) => (
              <TabsContent key={aba} value={aba} className="mt-6">
                <form onSubmit={aba === "entrar" ? entrar : criarConta} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`email-${aba}`}>E-mail</Label>
                    <Input
                      id={`email-${aba}`}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="voce@email.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`senha-${aba}`}>Senha</Label>
                    <Input
                      id={`senha-${aba}`}
                      type="password"
                      required
                      minLength={6}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button type="submit" disabled={carregando}>
                    {aba === "entrar" ? "Entrar" : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            ou
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="secondary" className="w-full" onClick={google}>
            Continuar com Google
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="underline hover:text-foreground">
            Voltar ao início
          </Link>
        </p>
      </div>
    </main>
  );
}
