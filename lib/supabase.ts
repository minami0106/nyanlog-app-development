import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types"

// 環境変数からSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// シングルトンパターンでクライアントを保持（複数初期化によるエラーを防ぐ）
let client: SupabaseClient<Database> | undefined

/**
 * フロントエンド・バックエンド両方から呼び出せる共通のSupabaseクライアント。
 * このカリキュラムアプリでは認証を使わないため、anonキーで初期化する。
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!client) {
    client = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return client
}

// 直接importしても使えるようにエクスポート
export const supabase = getSupabaseClient()
