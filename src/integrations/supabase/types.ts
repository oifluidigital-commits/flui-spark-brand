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
      ai_usage_log: {
        Row: {
          action_type: string
          created_at: string | null
          credits_consumed: number | null
          id: string
          model_used: string | null
          request_payload: Json | null
          response_preview: string | null
          tokens_input: number | null
          tokens_output: number | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          credits_consumed?: number | null
          id?: string
          model_used?: string | null
          request_payload?: Json | null
          response_preview?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          credits_consumed?: number | null
          id?: string
          model_used?: string | null
          request_payload?: Json | null
          response_preview?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          colors: Json | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          positioning: Json | null
          typography: Json | null
          updated_at: string | null
          user_id: string
          voice: Json | null
        }
        Insert: {
          colors?: Json | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          positioning?: Json | null
          typography?: Json | null
          updated_at?: string | null
          user_id: string
          voice?: Json | null
        }
        Update: {
          colors?: Json | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          positioning?: Json | null
          typography?: Json | null
          updated_at?: string | null
          user_id?: string
          voice?: Json | null
        }
        Relationships: []
      }
      content_pillars: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          example_topics: string[] | null
          id: string
          name: string
          percentage: number | null
          strategy_id: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          example_topics?: string[] | null
          id?: string
          name: string
          percentage?: number | null
          strategy_id?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          example_topics?: string[] | null
          id?: string
          name?: string
          percentage?: number | null
          strategy_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_pillars_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostics: {
        Row: {
          ai_model_used: string | null
          created_at: string | null
          form_data: Json
          id: string
          result: Json | null
          tokens_consumed: number | null
          user_id: string
        }
        Insert: {
          ai_model_used?: string | null
          created_at?: string | null
          form_data: Json
          id?: string
          result?: Json | null
          tokens_consumed?: number | null
          user_id: string
        }
        Update: {
          ai_model_used?: string | null
          created_at?: string | null
          form_data?: Json
          id?: string
          result?: Json | null
          tokens_consumed?: number | null
          user_id?: string
        }
        Relationships: []
      }
      frameworks: {
        Row: {
          category: Database["public"]["Enums"]["framework_category"] | null
          created_at: string | null
          description: string | null
          example: string | null
          id: string
          is_custom: boolean | null
          metadata: Json | null
          name: string
          structure: string[] | null
          user_id: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["framework_category"] | null
          created_at?: string | null
          description?: string | null
          example?: string | null
          id?: string
          is_custom?: boolean | null
          metadata?: Json | null
          name: string
          structure?: string[] | null
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["framework_category"] | null
          created_at?: string | null
          description?: string | null
          example?: string | null
          id?: string
          is_custom?: boolean | null
          metadata?: Json | null
          name?: string
          structure?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          format: string | null
          id: string
          pillar_id: string | null
          source_trend_id: string | null
          sprint_id: string | null
          status: Database["public"]["Enums"]["idea_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          format?: string | null
          id?: string
          pillar_id?: string | null
          source_trend_id?: string | null
          sprint_id?: string | null
          status?: Database["public"]["Enums"]["idea_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          format?: string | null
          id?: string
          pillar_id?: string | null
          source_trend_id?: string | null
          sprint_id?: string | null
          status?: Database["public"]["Enums"]["idea_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "content_pillars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_source_trend_id_fkey"
            columns: ["source_trend_id"]
            isOneToOne: false
            referencedRelation: "trends"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ideas_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_credits_total: number | null
          ai_credits_used: number | null
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          onboarding_status:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          onboarding_step: number | null
          plan: Database["public"]["Enums"]["plan_type"] | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_credits_total?: number | null
          ai_credits_used?: number | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          onboarding_step?: number | null
          plan?: Database["public"]["Enums"]["plan_type"] | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_credits_total?: number | null
          ai_credits_used?: number | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          onboarding_step?: number | null
          plan?: Database["public"]["Enums"]["plan_type"] | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sprint_contents: {
        Row: {
          created_at: string | null
          description: string | null
          format: string
          framework: string | null
          framework_origin:
            | Database["public"]["Enums"]["framework_origin"]
            | null
          framework_reason: string | null
          funnel_stage: Database["public"]["Enums"]["funnel_stage"] | null
          generated_text: string | null
          hook: string | null
          id: string
          intention: Database["public"]["Enums"]["content_intention"] | null
          sprint_id: string
          status: Database["public"]["Enums"]["content_status"] | null
          suggested_cta: string | null
          target_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          format: string
          framework?: string | null
          framework_origin?:
            | Database["public"]["Enums"]["framework_origin"]
            | null
          framework_reason?: string | null
          funnel_stage?: Database["public"]["Enums"]["funnel_stage"] | null
          generated_text?: string | null
          hook?: string | null
          id?: string
          intention?: Database["public"]["Enums"]["content_intention"] | null
          sprint_id: string
          status?: Database["public"]["Enums"]["content_status"] | null
          suggested_cta?: string | null
          target_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          format?: string
          framework?: string | null
          framework_origin?:
            | Database["public"]["Enums"]["framework_origin"]
            | null
          framework_reason?: string | null
          funnel_stage?: Database["public"]["Enums"]["funnel_stage"] | null
          generated_text?: string | null
          hook?: string | null
          id?: string
          intention?: Database["public"]["Enums"]["content_intention"] | null
          sprint_id?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          suggested_cta?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sprint_contents_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
        ]
      }
      sprints: {
        Row: {
          alignment_score: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          pillar_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["sprint_status"] | null
          theme: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alignment_score?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          pillar_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["sprint_status"] | null
          theme?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alignment_score?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          pillar_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["sprint_status"] | null
          theme?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sprints_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "content_pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      strategies: {
        Row: {
          created_at: string | null
          data: Json
          diagnostic_id: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data: Json
          diagnostic_id?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          diagnostic_id?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategies_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
        ]
      }
      trends: {
        Row: {
          category: string | null
          description: string | null
          discovered_at: string | null
          expires_at: string | null
          id: string
          relevance: Database["public"]["Enums"]["trend_relevance"] | null
          source: string | null
          suggested_actions: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          description?: string | null
          discovered_at?: string | null
          expires_at?: string | null
          id?: string
          relevance?: Database["public"]["Enums"]["trend_relevance"] | null
          source?: string | null
          suggested_actions?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          description?: string | null
          discovered_at?: string | null
          expires_at?: string | null
          id?: string
          relevance?: Database["public"]["Enums"]["trend_relevance"] | null
          source?: string | null
          suggested_actions?: string[] | null
          title?: string
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
      content_intention: "educate" | "engage" | "convert"
      content_status: "idea" | "backlog" | "review" | "scheduled" | "completed"
      framework_category:
        | "storytelling"
        | "educational"
        | "sales"
        | "engagement"
        | "authority"
        | "personal"
      framework_origin: "ai" | "manual"
      funnel_stage: "tofu" | "mofu" | "bofu"
      idea_status:
        | "backlog"
        | "planned"
        | "in_progress"
        | "review"
        | "published"
        | "archived"
      onboarding_status: "not_started" | "in_progress" | "completed"
      plan_type: "free" | "pro" | "studio"
      sprint_status: "draft" | "active" | "completed" | "archived"
      trend_relevance: "high" | "medium" | "low"
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
      content_intention: ["educate", "engage", "convert"],
      content_status: ["idea", "backlog", "review", "scheduled", "completed"],
      framework_category: [
        "storytelling",
        "educational",
        "sales",
        "engagement",
        "authority",
        "personal",
      ],
      framework_origin: ["ai", "manual"],
      funnel_stage: ["tofu", "mofu", "bofu"],
      idea_status: [
        "backlog",
        "planned",
        "in_progress",
        "review",
        "published",
        "archived",
      ],
      onboarding_status: ["not_started", "in_progress", "completed"],
      plan_type: ["free", "pro", "studio"],
      sprint_status: ["draft", "active", "completed", "archived"],
      trend_relevance: ["high", "medium", "low"],
    },
  },
} as const
