import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MESES, brl } from "@/lib/finance";
import { usePeriodo } from "@/lib/periodo";
import { useAnos } from "@/lib/db";

export function PageHeader({
  titulo,
  descricao,
  acoes,
}: {
  titulo: string;
  descricao?: string | undefined;
  acoes?: ReactNode | undefined;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{titulo}</h1>
        {descricao ? <p className="mt-1 text-sm text-muted-foreground">{descricao}</p> : null}
      </div>
      {acoes ? <div className="flex flex-wrap items-center gap-2">{acoes}</div> : null}
    </div>
  );
}

export function SeletorPeriodo({ comMes = true }: { comMes?: boolean }) {
  const { mes, ano, setMes, setAno } = usePeriodo();
  const { data: anos = [ano] } = useAnos();

  return (
    <div className="flex items-center gap-2">
      {comMes ? (
        <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          <Button variant="ghost" size="icon" className="size-8" aria-label="Mês anterior" onClick={() => setMes(mes === 1 ? 12 : mes - 1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
            <SelectTrigger className="h-8 w-[130px] border-0 bg-transparent shadow-none focus:ring-0"><SelectValue /></SelectTrigger>
            <SelectContent>{MESES.map((m, i) => <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Próximo mês" onClick={() => setMes(mes === 12 ? 1 : mes + 1)}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}
      <Select value={String(ano)} onValueChange={(v) => setAno(Number(v))}>
        <SelectTrigger className="h-10 w-[96px]"><SelectValue /></SelectTrigger>
        <SelectContent>{anos.map((a) => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

export function StatCard({ label, valor, tom = "neutro", detalhe, icone, className }: {
  label: string;
  valor: number;
  tom?: "positivo" | "negativo" | "neutro" | "aviso";
  detalhe?: string | undefined;
  icone?: ReactNode | undefined;
  className?: string | undefined;
}) {
  const tons = { positivo: "text-positive", negativo: "text-negative", aviso: "text-warning", neutro: "text-foreground" } as const;
  return (
    <div className={cn("panel p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
        {icone ? <span className="text-muted-foreground">{icone}</span> : null}
      </div>
      <p className={cn("num mt-3 text-2xl font-semibold", tons[tom])}>{brl(valor)}</p>
      {detalhe ? <p className="mt-1 text-xs text-muted-foreground">{detalhe}</p> : null}
    </div>
  );
}

export function Panel({ titulo, acao, children, className }: { titulo?: string | undefined; acao?: ReactNode | undefined; children: ReactNode; className?: string | undefined }) {
  return (
    <section className={cn("panel p-5", className)}>
      {titulo ? <header className="mb-4 flex items-center justify-between gap-3"><h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{titulo}</h2>{acao}</header> : null}
      {children}
    </section>
  );
}

export function Vazio({ texto }: { texto: string }) {
  return <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">{texto}</p>;
}

export function BarraProporcao({ itens }: { itens: { label: string; valor: number; cor: string }[] }) {
  const total = itens.reduce((t, i) => t + i.valor, 0) || 1;
  return <div className="space-y-3">{itens.map((i) => <div key={i.label}><div className="mb-1 flex items-center justify-between text-sm"><span className="text-muted-foreground">{i.label}</span><span className="num font-medium">{brl(i.valor)}</span></div><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full transition-all" style={{ width: `${(i.valor / total) * 100}%`, backgroundColor: i.cor }} /></div></div>)}</div>;
}
