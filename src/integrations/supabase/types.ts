export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      cartoes: {
        Row: {
          ativo: boolean
          criado_em: string
          dia_fechamento: number
          dia_vencimento: number
          id: string
          limite: number
          nome: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          dia_fechamento?: number
          dia_vencimento?: number
          id?: string
          limite?: number
          nome: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          dia_fechamento?: number
          dia_vencimento?: number
          id?: string
          limite?: number
          nome?: string
          user_id?: string | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          ativo: boolean
          criado_em: string
          id: string
          nome: string
          ordem: number
          parent_nome: string | null
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          id?: string
          nome: string
          ordem?: number
          parent_nome?: string | null
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          id?: string
          nome?: string
          ordem?: number
          parent_nome?: string | null
          tipo?: Database["public"]["Enums"]["tipo_lancamento"]
          user_id?: string | null
        }
        Relationships: []
      }
      lancamentos: {
        Row: {
          ano: number
          atualizado_em: string
          cartao: string | null
          categoria: string
          chave_unica: string | null
          conta: string | null
          criado_em: string
          data: string
          descricao: string
          forma_pagamento: string | null
          grupo_id: string | null
          id: string
          mes: number
          observacao: string | null
          origem: string
          parcela_atual: number | null
          subcategoria: string | null
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          total_parcelas: number | null
          user_id: string | null
          valor: number
        }
        Insert: {
          ano: number
          atualizado_em?: string
          cartao?: string | null
          categoria: string
          chave_unica?: string | null
          conta?: string | null
          criado_em?: string
          data: string
          descricao: string
          forma_pagamento?: string | null
          grupo_id?: string | null
          id?: string
          mes: number
          observacao?: string | null
          origem?: string
          parcela_atual?: number | null
          subcategoria?: string | null
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          total_parcelas?: number | null
          user_id?: string | null
          valor: number
        }
        Update: {
          ano?: number
          atualizado_em?: string
          cartao?: string | null
          categoria?: string
          chave_unica?: string | null
          conta?: string | null
          criado_em?: string
          data?: string
          descricao?: string
          forma_pagamento?: string | null
          grupo_id?: string | null
          id?: string
          mes?: number
          observacao?: string | null
          origem?: string
          parcela_atual?: number | null
          subcategoria?: string | null
          tipo?: Database["public"]["Enums"]["tipo_lancamento"]
          total_parcelas?: number | null
          user_id?: string | null
          valor?: number
        }
        Relationships: []
      }
      recorrencias: {
        Row: {
          ativo: boolean
          cartao: string | null
          categoria: string
          criado_em: string
          descricao: string
          dia: number
          forma_pagamento: string | null
          id: string
          periodicidade: string
          tipo: Database["public"]["Enums"]["tipo_lancamento"]
          user_id: string | null
          valor: number
        }
        Insert: {
          ativo?: boolean
          cartao?: string | null
          categoria: string
          criado_em?: string
          descricao: string
          dia?: number
          forma_pagamento?: string | null
          id?: string
          periodicidade?: string
          tipo?: Database["public"]["Enums"]["tipo_lancamento"]
          user_id?: string | null
          valor: number
        }
        Update: {
          ativo?: boolean
          cartao?: string | null
          categoria?: string
          criado_em?: string
          descricao?: string
          dia?: number
          forma_pagamento?: string | null
          id?: string
          periodicidade?: string
          tipo?: Database["public"]["Enums"]["tipo_lancamento"]
          user_id?: string | null
          valor?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipo_lancamento: "receita" | "despesa_fixa" | "despesa_variavel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      tipo_lancamento: ["receita", "despesa_fixa", "despesa_variavel"],
    },
  },
} as const
