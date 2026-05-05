export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {

      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image_url: string | null;
          meta_title: string | null;
          meta_description: string | null;
          status: "draft" | "published";
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          featured_image_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          status?: "draft" | "published";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          featured_image_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          status?: "draft" | "published";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_calculations: {
        Row: {
          id: number;
          user_id: string;
          calculator_type: string;
          label: string | null;
          input_data: Json;
          result_data: Json;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          calculator_type: string;
          label?: string | null;
          input_data: Json;
          result_data: Json;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          calculator_type?: string;
          label?: string | null;
          input_data?: Json;
          result_data?: Json;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type SavedCalculation =
  Database["public"]["Tables"]["saved_calculations"]["Row"];

export type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
