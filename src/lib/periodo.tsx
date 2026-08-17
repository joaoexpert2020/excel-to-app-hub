import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface PeriodoCtx {
  mes: number;
  ano: number;
  setMes: (m: number) => void;
  setAno: (a: number) => void;
}

const Ctx = createContext<PeriodoCtx | null>(null);

export function PeriodoProvider({ children }: { children: ReactNode }) {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(2026);

  useEffect(() => {
    const salvo = localStorage.getItem("periodo");
    if (salvo) {
      try {
        const p = JSON.parse(salvo) as { mes: number; ano: number };
        if (p.mes) setMes(p.mes);
        if (p.ano) setAno(p.ano);
      } catch {
        /* ignora */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("periodo", JSON.stringify({ mes, ano }));
  }, [mes, ano]);

  return <Ctx.Provider value={{ mes, ano, setMes, setAno }}>{children}</Ctx.Provider>;
}

export function usePeriodo() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePeriodo precisa estar dentro de PeriodoProvider");
  return ctx;
}
