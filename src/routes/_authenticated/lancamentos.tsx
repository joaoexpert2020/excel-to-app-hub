import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, Panel, SeletorPeriodo, StatCard, Vazio } from "@/components/finance-ui";
import { LancamentoDialog } from "@/components/lancamento-dialog";
import { useExcluirLancamento, useLancamentos } from "@/lib/db";
import { usePeriodo } from "@/lib/periodo";
import { exportar } from "@/lib/planilha";
import {
  MESES,
  brl,
  dataBR,
  resumo,
  tipoLabel,
  type Lancamento,
  type TipoLancamento,
} from "@/lib/finance";

export const Route = createFileRoute("/_authenticated/lancamentos")({
  head: () => ({
    meta: [
      { title: "Lançamentos | Controle Financeiro 2026" },
      {
        name: "description",
        content:
          "Cadastre, edite, filtre e exporte todos os lançamentos financeiros do mês ou do ano inteiro.",
      },
      { property: "og:title", content: "Lançamentos | Controle Financeiro 2026" },
      {
        property: "og:description",
        content: "Gestão completa das receitas e despesas com filtros e exportação.",
      },
    ],
  }),
  component: Lancamentos () => null,
});

function Lancamentos() {
  return null;
}
