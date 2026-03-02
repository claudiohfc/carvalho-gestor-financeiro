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
      bank_accounts: {
        Row: {
          account_name: string
          bank_name: string
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          account_name: string
          bank_name: string
          created_at?: string | null
          id?: never
          user_id: string
        }
        Update: {
          account_name?: string
          bank_name?: string
          created_at?: string | null
          id?: never
          user_id?: string
        }
        Relationships: []
      }
      bank_statements: {
        Row: {
          amount: number
          bank_account_id: number
          created_at: string | null
          date: string
          description: string | null
          divergence_reason: string | null
          id: number
          matched_transaction_id: number | null
          reconciled: boolean | null
          type: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bank_account_id: number
          created_at?: string | null
          date: string
          description?: string | null
          divergence_reason?: string | null
          id?: never
          matched_transaction_id?: number | null
          reconciled?: boolean | null
          type?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bank_account_id?: number
          created_at?: string | null
          date?: string
          description?: string | null
          divergence_reason?: string | null
          id?: never
          matched_transaction_id?: number | null
          reconciled?: boolean | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_statements_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          benefits: number | null
          commissions: number | null
          created_at: string | null
          decimo_terceiro_1: number | null
          decimo_terceiro_2: number | null
          ferias: number | null
          fgts: number | null
          id: number
          inss: number | null
          ir: number | null
          person_id: number
          pro_labore: number | null
          reference_month: string
          reimbursements: number | null
          salary: number | null
          total_cost: number | null
          user_id: string
          vale_alimentacao: number | null
          vale_transporte: number | null
        }
        Insert: {
          benefits?: number | null
          commissions?: number | null
          created_at?: string | null
          decimo_terceiro_1?: number | null
          decimo_terceiro_2?: number | null
          ferias?: number | null
          fgts?: number | null
          id?: never
          inss?: number | null
          ir?: number | null
          person_id: number
          pro_labore?: number | null
          reference_month: string
          reimbursements?: number | null
          salary?: number | null
          total_cost?: number | null
          user_id: string
          vale_alimentacao?: number | null
          vale_transporte?: number | null
        }
        Update: {
          benefits?: number | null
          commissions?: number | null
          created_at?: string | null
          decimo_terceiro_1?: number | null
          decimo_terceiro_2?: number | null
          ferias?: number | null
          fgts?: number | null
          id?: never
          inss?: number | null
          ir?: number | null
          person_id?: number
          pro_labore?: number | null
          reference_month?: string
          reimbursements?: number | null
          salary?: number | null
          total_cost?: number | null
          user_id?: string
          vale_alimentacao?: number | null
          vale_transporte?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          active: boolean | null
          cpf: string | null
          created_at: string | null
          email: string | null
          end_date: string | null
          id: number
          name: string
          phone: string | null
          start_date: string | null
          type: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          end_date?: string | null
          id?: never
          name: string
          phone?: string | null
          start_date?: string | null
          type: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          end_date?: string | null
          id?: never
          name?: string
          phone?: string | null
          start_date?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      products_services: {
        Row: {
          base_cost: number | null
          category: string | null
          code: string | null
          created_at: string | null
          description: string | null
          final_price: number | null
          fixed_costs: number | null
          id: number
          labor_percent: number | null
          labor_value: number | null
          markup: number | null
          name: string
          preparation_hour_value: number | null
          preparation_time: number | null
          profit_margin: number | null
          tax_type: string | null
          tax_value: number | null
          type: string
          unit_measure: string | null
          user_id: string
          variable_costs: number | null
        }
        Insert: {
          base_cost?: number | null
          category?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          final_price?: number | null
          fixed_costs?: number | null
          id?: never
          labor_percent?: number | null
          labor_value?: number | null
          markup?: number | null
          name: string
          preparation_hour_value?: number | null
          preparation_time?: number | null
          profit_margin?: number | null
          tax_type?: string | null
          tax_value?: number | null
          type: string
          unit_measure?: string | null
          user_id: string
          variable_costs?: number | null
        }
        Update: {
          base_cost?: number | null
          category?: string | null
          code?: string | null
          created_at?: string | null
          description?: string | null
          final_price?: number | null
          fixed_costs?: number | null
          id?: never
          labor_percent?: number | null
          labor_value?: number | null
          markup?: number | null
          name?: string
          preparation_hour_value?: number | null
          preparation_time?: number | null
          profit_margin?: number | null
          tax_type?: string | null
          tax_value?: number | null
          type?: string
          unit_measure?: string | null
          user_id?: string
          variable_costs?: number | null
        }
        Relationships: []
      }
      scenario_simulations: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          input_data: Json | null
          result_data: Json | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          input_data?: Json | null
          result_data?: Json | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          input_data?: Json | null
          result_data?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          client_or_supplier: string | null
          cost_center: string | null
          created_at: string | null
          date: string
          description: string
          id: number
          notes: string | null
          payment_method: string | null
          recurring: boolean | null
          subcategory: string | null
          tags: string[] | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          client_or_supplier?: string | null
          cost_center?: string | null
          created_at?: string | null
          date: string
          description: string
          id?: never
          notes?: string | null
          payment_method?: string | null
          recurring?: boolean | null
          subcategory?: string | null
          tags?: string[] | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          client_or_supplier?: string | null
          cost_center?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: never
          notes?: string | null
          payment_method?: string | null
          recurring?: boolean | null
          subcategory?: string | null
          tags?: string[] | null
          type?: string
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
