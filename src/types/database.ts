export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_name: string
          category_id: string | null
          content: string
          cover_image: Json | null
          created_at: string
          excerpt: string
          id: string
          is_featured: boolean
          published_at: string | null
          seo_description: string
          seo_title: string
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          tags: string[]
          title: string
          trainer_id: string | null
          updated_at: string
        }
        Insert: {
          author_name?: string
          category_id?: string | null
          content?: string
          cover_image?: Json | null
          created_at?: string
          excerpt?: string
          id?: string
          is_featured?: boolean
          published_at?: string | null
          seo_description?: string
          seo_title?: string
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title: string
          trainer_id?: string | null
          updated_at?: string
        }
        Update: {
          author_name?: string
          category_id?: string | null
          content?: string
          cover_image?: Json | null
          created_at?: string
          excerpt?: string
          id?: string
          is_featured?: boolean
          published_at?: string | null
          seo_description?: string
          seo_title?: string
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          tags?: string[]
          title?: string
          trainer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string | null
          id: string
          membership_plan_id: string | null
          message: string | null
          name: string
          page_path: string | null
          phone: string
          source: Database["public"]["Enums"]["enquiry_source"]
          status: Database["public"]["Enums"]["enquiry_status"]
          subject: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          membership_plan_id?: string | null
          message?: string | null
          name: string
          page_path?: string | null
          phone: string
          source?: Database["public"]["Enums"]["enquiry_source"]
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          membership_plan_id?: string | null
          message?: string | null
          name?: string
          page_path?: string | null
          phone?: string
          source?: Database["public"]["Enums"]["enquiry_source"]
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enquiries_membership_plan_id_fkey"
            columns: ["membership_plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiry_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          enquiry_id: string
          id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          enquiry_id: string
          id?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          enquiry_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enquiry_notes_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string
          category: string
          created_at: string
          id: string
          image: Json
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption?: string
          category?: string
          created_at?: string
          id?: string
          image: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption?: string
          category?: string
          created_at?: string
          id?: string
          image?: Json
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      homepage_sections: {
        Row: {
          content: Json
          is_visible: boolean
          key: string
          updated_at: string
        }
        Insert: {
          content: Json
          is_visible?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          is_visible?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      membership_plans: {
        Row: {
          created_at: string
          duration_label: string
          duration_months: number | null
          features: string[]
          id: string
          is_popular: boolean
          name: string
          price_npr: number
          published: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_label?: string
          duration_months?: number | null
          features?: string[]
          id?: string
          is_popular?: boolean
          name: string
          price_npr: number
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_label?: string
          duration_months?: number | null
          features?: string[]
          id?: string
          is_popular?: boolean
          name?: string
          price_npr?: number
          published?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          audience: string
          benefits: string[]
          body: string
          created_at: string
          id: string
          image: Json | null
          published: boolean
          seo_description: string
          seo_title: string
          short_description: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
          what_to_expect: string
        }
        Insert: {
          audience?: string
          benefits?: string[]
          body?: string
          created_at?: string
          id?: string
          image?: Json | null
          published?: boolean
          seo_description?: string
          seo_title?: string
          short_description?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          what_to_expect?: string
        }
        Update: {
          audience?: string
          benefits?: string[]
          body?: string
          created_at?: string
          id?: string
          image?: Json | null
          published?: boolean
          seo_description?: string
          seo_title?: string
          short_description?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          what_to_expect?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string
          area: string
          city: string
          description: string
          email: string
          facebook_url: string
          google_business_url: string
          google_maps_url: string
          gym_name: string
          id: boolean
          instagram_url: string
          logo: Json | null
          opening_hours: Json
          phone: string
          short_name: string
          tiktok_url: string
          updated_at: string
          whatsapp_message: string
          whatsapp_number: string
        }
        Insert: {
          address?: string
          area?: string
          city: string
          description?: string
          email?: string
          facebook_url?: string
          google_business_url?: string
          google_maps_url?: string
          gym_name: string
          id?: boolean
          instagram_url?: string
          logo?: Json | null
          opening_hours?: Json
          phone?: string
          short_name: string
          tiktok_url?: string
          updated_at?: string
          whatsapp_message?: string
          whatsapp_number?: string
        }
        Update: {
          address?: string
          area?: string
          city?: string
          description?: string
          email?: string
          facebook_url?: string
          google_business_url?: string
          google_maps_url?: string
          gym_name?: string
          id?: boolean
          instagram_url?: string
          logo?: Json | null
          opening_hours?: Json
          phone?: string
          short_name?: string
          tiktok_url?: string
          updated_at?: string
          whatsapp_message?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          photo: Json | null
          published: boolean
          rating: number
          review_date: string | null
          sort_order: number
          source: string
          source_url: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          photo?: Json | null
          published?: boolean
          rating: number
          review_date?: string | null
          sort_order?: number
          source?: string
          source_url?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          photo?: Json | null
          published?: boolean
          rating?: number
          review_date?: string | null
          sort_order?: number
          source?: string
          source_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      trainers: {
        Row: {
          bio: string
          certifications: string[]
          created_at: string
          id: string
          name: string
          photo: Json | null
          position: string
          published: boolean
          slug: string
          social_links: Json
          sort_order: number
          specializations: string[]
          updated_at: string
          years_experience: number
        }
        Insert: {
          bio?: string
          certifications?: string[]
          created_at?: string
          id?: string
          name: string
          photo?: Json | null
          position?: string
          published?: boolean
          slug: string
          social_links?: Json
          sort_order?: number
          specializations?: string[]
          updated_at?: string
          years_experience?: number
        }
        Update: {
          bio?: string
          certifications?: string[]
          created_at?: string
          id?: string
          name?: string
          photo?: Json | null
          position?: string
          published?: boolean
          slug?: string
          social_links?: Json
          sort_order?: number
          specializations?: string[]
          updated_at?: string
          years_experience?: number
        }
        Relationships: []
      }
      transformations: {
        Row: {
          after_image: Json
          before_image: Json
          consent_confirmed: boolean
          created_at: string
          duration_label: string
          goal: string
          id: string
          person_name: string
          published: boolean
          result: string
          sort_order: number
          testimonial: string
          updated_at: string
        }
        Insert: {
          after_image: Json
          before_image: Json
          consent_confirmed?: boolean
          created_at?: string
          duration_label?: string
          goal?: string
          id?: string
          person_name: string
          published?: boolean
          result?: string
          sort_order?: number
          testimonial?: string
          updated_at?: string
        }
        Update: {
          after_image?: Json
          before_image?: Json
          consent_confirmed?: boolean
          created_at?: string
          duration_label?: string
          goal?: string
          id?: string
          person_name?: string
          published?: boolean
          result?: string
          sort_order?: number
          testimonial?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_valid_image: { Args: { image: Json }; Returns: boolean }
      submit_enquiry: {
        Args: {
          p_email?: string
          p_membership_plan_id?: string
          p_message?: string
          p_name: string
          p_page_path?: string
          p_phone: string
          p_source?: Database["public"]["Enums"]["enquiry_source"]
          p_subject?: string
          p_website?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      enquiry_source:
        | "contact_form"
        | "free_trial"
        | "membership"
        | "whatsapp"
        | "website"
      enquiry_status:
        | "new"
        | "contacted"
        | "interested"
        | "follow_up"
        | "converted"
        | "closed"
        | "spam"
      post_status: "draft" | "published" | "archived"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      enquiry_source: [
        "contact_form",
        "free_trial",
        "membership",
        "whatsapp",
        "website",
      ],
      enquiry_status: [
        "new",
        "contacted",
        "interested",
        "follow_up",
        "converted",
        "closed",
        "spam",
      ],
      post_status: ["draft", "published", "archived"],
    },
  },
} as const

