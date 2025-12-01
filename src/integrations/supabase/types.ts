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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      client_details: {
        Row: {
          cpf: string
          created_at: string | null
          custom_fee_rate: number | null
          id: string
          user_id: string
        }
        Insert: {
          cpf: string
          created_at?: string | null
          custom_fee_rate?: number | null
          id?: string
          user_id: string
        }
        Update: {
          cpf?: string
          created_at?: string | null
          custom_fee_rate?: number | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      disputes: {
        Row: {
          created_at: string | null
          id: string
          opened_by: string
          order_id: string
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["dispute_status"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          opened_by: string
          order_id: string
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          opened_by?: string
          order_id?: string
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_images: {
        Row: {
          id: string
          image_url: string
          order_id: string
          uploaded_at: string | null
        }
        Insert: {
          id?: string
          image_url: string
          order_id: string
          uploaded_at?: string | null
        }
        Update: {
          id?: string
          image_url?: string
          order_id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_images_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_brl: number
          amount_cny: number
          client_id: string
          completed_at: string | null
          created_at: string | null
          fee_amount: number
          fee_rate: number
          id: string
          order_number: string
          shipped_at: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          supplier_id: string
          total_amount: number
          tracking_code: string | null
        }
        Insert: {
          amount_brl: number
          amount_cny: number
          client_id: string
          completed_at?: string | null
          created_at?: string | null
          fee_amount: number
          fee_rate: number
          id?: string
          order_number: string
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          supplier_id: string
          total_amount: number
          tracking_code?: string | null
        }
        Update: {
          amount_brl?: number
          amount_cny?: number
          client_id?: string
          completed_at?: string | null
          created_at?: string | null
          fee_amount?: number
          fee_rate?: number
          id?: string
          order_number?: string
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          supplier_id?: string
          total_amount?: number
          tracking_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone: string
          updated_at?: string | null
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      supplier_details: {
        Row: {
          alipay_qr_code_url: string | null
          approval_status: Database["public"]["Enums"]["supplier_status"] | null
          approved_at: string | null
          approved_by: string | null
          contact_info: string | null
          created_at: string | null
          id: string
          supplier_id: string
          user_id: string
        }
        Insert: {
          alipay_qr_code_url?: string | null
          approval_status?:
            | Database["public"]["Enums"]["supplier_status"]
            | null
          approved_at?: string | null
          approved_by?: string | null
          contact_info?: string | null
          created_at?: string | null
          id?: string
          supplier_id: string
          user_id: string
        }
        Update: {
          alipay_qr_code_url?: string | null
          approval_status?:
            | Database["public"]["Enums"]["supplier_status"]
            | null
          approved_at?: string | null
          approved_by?: string | null
          contact_info?: string | null
          created_at?: string | null
          id?: string
          supplier_id?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          order_id: string | null
          supplier_id: string
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          supplier_id: string
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string | null
          supplier_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          id: string
          processed_at: string | null
          processed_by: string | null
          requested_at: string | null
          status: Database["public"]["Enums"]["withdrawal_status"] | null
          supplier_id: string
        }
        Insert: {
          amount: number
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"] | null
          supplier_id: string
        }
        Update: {
          amount?: number
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          requested_at?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"] | null
          supplier_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_supplier_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client" | "supplier"
      dispute_status: "open" | "resolved" | "rejected"
      order_status: "pending" | "shipped" | "completed"
      supplier_status: "pending" | "approved" | "rejected"
      user_type: "client" | "supplier"
      withdrawal_status: "pending" | "approved" | "rejected"
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
      app_role: ["admin", "client", "supplier"],
      dispute_status: ["open", "resolved", "rejected"],
      order_status: ["pending", "shipped", "completed"],
      supplier_status: ["pending", "approved", "rejected"],
      user_type: ["client", "supplier"],
      withdrawal_status: ["pending", "approved", "rejected"],
    },
  },
} as const
