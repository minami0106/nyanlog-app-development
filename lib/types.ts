/**
 * Supabaseのテーブル構造に完全適合する型定義。
 * Allow Nullable: OFF の列はすべて必須（non-null）として定義している。
 */

// profiles テーブル（飼い主情報）
export type Profile = {
  id: string // uuid, PK
  created_at: string // timestamptz
  name: string // text
}

// diaries テーブル（日記データ）
export type Diary = {
  id: string // uuid, PK
  created_at: string // timestamptz
  number: number // int8, 自動連番
  profile_id: string // uuid
  image_url: string // text
  ai_diary_text: string // text
  is_favorite: boolean // bool, default false
}

// Insert時の型（DBが自動生成する列は除外）
export type DiaryInsert = {
  profile_id: string
  image_url: string
  ai_diary_text: string
}

export type ProfileInsert = {
  name: string
}

// supabase-js のジェネリック型に渡すためのDatabase型
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert & { id?: string; created_at?: string }
        Update: Partial<Profile>
      }
      diaries: {
        Row: Diary
        Insert: DiaryInsert & {
          id?: string
          created_at?: string
          is_favorite?: boolean
        }
        Update: Partial<Diary>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
