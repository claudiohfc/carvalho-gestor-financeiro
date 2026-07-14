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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cadastros: {
        Row: {
          categoria: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          id: string
          nome: string
          status: string | null
          telefone: string | null
          tipo: string
          user_id: string
        }
        Insert: {
          categoria?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          status?: string | null
          telefone?: string | null
          tipo: string
          user_id: string
        }
        Update: {
          categoria?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          status?: string | null
          telefone?: string | null
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      conciliacoes: {
        Row: {
          banco: string | null
          created_at: string
          id: string
          nome_conta: string | null
          user_id: string
        }
        Insert: {
          banco?: string | null
          created_at?: string
          id?: string
          nome_conta?: string | null
          user_id: string
        }
        Update: {
          banco?: string | null
          created_at?: string
          id?: string
          nome_conta?: string | null
          user_id?: string
        }
        Relationships: []
      }
      extrato_linhas: {
        Row: {
          categoria_sugerida: string | null
          cliente_fornecedor_sugerido: string | null
          conciliado: boolean | null
          confianca_classificacao: number | null
          created_at: string
          data: string
          descricao: string
          divergencia_motivo: string | null
          extrato_id: string | null
          id: string
          lancamento_id: string | null
          subcategoria_sugerida: string | null
          tipo: string | null
          user_id: string
          valor: number
        }
        Insert: {
          categoria_sugerida?: string | null
          cliente_fornecedor_sugerido?: string | null
          conciliado?: boolean | null
          confianca_classificacao?: number | null
          created_at?: string
          data: string
          descricao: string
          divergencia_motivo?: string | null
          extrato_id?: string | null
          id?: string
          lancamento_id?: string | null
          subcategoria_sugerida?: string | null
          tipo?: string | null
          user_id: string
          valor: number
        }
        Update: {
          categoria_sugerida?: string | null
          cliente_fornecedor_sugerido?: string | null
          conciliado?: boolean | null
          confianca_classificacao?: number | null
          created_at?: string
          data?: string
          descricao?: string
          divergencia_motivo?: string | null
          extrato_id?: string | null
          id?: string
          lancamento_id?: string | null
          subcategoria_sugerida?: string | null
          tipo?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "extrato_linhas_extrato_id_fkey"
            columns: ["extrato_id"]
            isOneToOne: false
            referencedRelation: "extratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extrato_linhas_lancamento_id_fkey"
            columns: ["lancamento_id"]
            isOneToOne: false
            referencedRelation: "lancamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      extratos: {
        Row: {
          arquivo_nome: string | null
          banco: string | null
          data_importacao: string
          id: string
          nome_conta: string | null
          status: string | null
          total_conciliados: number | null
          total_registros: number | null
          user_id: string
        }
        Insert: {
          arquivo_nome?: string | null
          banco?: string | null
          data_importacao?: string
          id?: string
          nome_conta?: string | null
          status?: string | null
          total_conciliados?: number | null
          total_registros?: number | null
          user_id: string
        }
        Update: {
          arquivo_nome?: string | null
          banco?: string | null
          data_importacao?: string
          id?: string
          nome_conta?: string | null
          status?: string | null
          total_conciliados?: number | null
          total_registros?: number | null
          user_id?: string
        }
        Relationships: []
      }
      lancamentos: {
        Row: {
          categoria: string
          centro_custo: string | null
          cliente_fornecedor: string | null
          conciliado: boolean | null
          created_at: string
          data: string
          data_vencimento: string | null
          descricao: string
          forma_pagamento: string | null
          id: string
          num_documento: string | null
          observacoes: string | null
          origem: string | null
          subcategoria: string | null
          tipo: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria: string
          centro_custo?: string | null
          cliente_fornecedor?: string | null
          conciliado?: boolean | null
          created_at?: string
          data: string
          data_vencimento?: string | null
          descricao: string
          forma_pagamento?: string | null
          id?: string
          num_documento?: string | null
          observacoes?: string | null
          origem?: string | null
          subcategoria?: string | null
          tipo: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          categoria?: string
          centro_custo?: string | null
          cliente_fornecedor?: string | null
          conciliado?: boolean | null
          created_at?: string
          data?: string
          data_vencimento?: string | null
          descricao?: string
          forma_pagamento?: string | null
          id?: string
          num_documento?: string | null
          observacoes?: string | null
          origem?: string | null
          subcategoria?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      regras_classificacao: {
        Row: {
          ativo: boolean | null
          categoria: string
          cliente_fornecedor: string | null
          created_at: string
          id: string
          palavra_chave: string
          prioridade: number | null
          subcategoria: string | null
          tipo: string | null
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          categoria: string
          cliente_fornecedor?: string | null
          created_at?: string
          id?: string
          palavra_chave: string
          prioridade?: number | null
          subcategoria?: string | null
          tipo?: string | null
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          cliente_fornecedor?: string | null
          created_at?: string
          id?: string
          palavra_chave?: string
          prioridade?: number | null
          subcategoria?: string | null
          tipo?: string | null
          user_id?: string
        }
        Relationships: []
      }
      simulacoes: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          input_data: Json | null
          result_data: Json | null
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          input_data?: Json | null
          result_data?: Json | null
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          input_data?: Json | null
          result_data?: Json | null
          tipo?: string
          user_id?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
