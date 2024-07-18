export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      processed_document_chunks: {
        Row: {
          chunk_index: number
          content: string
          embedding: string
          id: number
          page: number
          processed_document_id: number | null
          user_id: string | null
        }
        Insert: {
          chunk_index: number
          content: string
          embedding: string
          id?: number
          page: number
          processed_document_id?: number | null
          user_id?: string | null
        }
        Update: {
          chunk_index?: number
          content?: string
          embedding?: string
          id?: number
          page?: number
          processed_document_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processed_document_chunks_processed_document_id_fkey"
            columns: ["processed_document_id"]
            isOneToOne: false
            referencedRelation: "processed_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processed_document_chunks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_document_summaries: {
        Row: {
          id: number
          processed_document_id: number | null
          summary: string
          summary_embedding: string
          tags: string[]
          user_id: string | null
        }
        Insert: {
          id?: number
          processed_document_id?: number | null
          summary: string
          summary_embedding: string
          tags: string[]
          user_id?: string | null
        }
        Update: {
          id?: number
          processed_document_id?: number | null
          summary?: string
          summary_embedding?: string
          tags?: string[]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processed_document_summaries_processed_document_id_fkey"
            columns: ["processed_document_id"]
            isOneToOne: false
            referencedRelation: "processed_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processed_document_summaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_documents: {
        Row: {
          file_checksum: string
          file_size: number
          id: number
          num_pages: number
          processing_error: string | null
          processing_finished_at: string | null
          processing_started_at: string | null
          registered_document_id: number | null
          user_id: string | null
        }
        Insert: {
          file_checksum: string
          file_size: number
          id?: number
          num_pages: number
          processing_error?: string | null
          processing_finished_at?: string | null
          processing_started_at?: string | null
          registered_document_id?: number | null
          user_id?: string | null
        }
        Update: {
          file_checksum?: string
          file_size?: number
          id?: number
          num_pages?: number
          processing_error?: string | null
          processing_finished_at?: string | null
          processing_started_at?: string | null
          registered_document_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processed_documents_registered_document_id_fkey"
            columns: ["registered_document_id"]
            isOneToOne: false
            referencedRelation: "registered_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processed_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      registered_documents: {
        Row: {
          id: number
          metadata: Json | null
          registered_at: string
          source_type: string
          source_url: string
          user_id: string | null
        }
        Insert: {
          id?: number
          metadata?: Json | null
          registered_at: string
          source_type: string
          source_url: string
          user_id?: string | null
        }
        Update: {
          id?: number
          metadata?: Json | null
          registered_at?: string
          source_type?: string
          source_url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registered_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

