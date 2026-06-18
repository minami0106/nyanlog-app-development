"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseClient } from "@/lib/supabase"
import type { Diary, DiaryInsert, Profile } from "@/lib/types"

/* -------------------------------------------------------------------------- */
/*  Profiles (飼い主情報)                                                       */
/* -------------------------------------------------------------------------- */

/**
 * 飼い主プロフィールを取得（最初の1件）。
 * このカリキュラムアプリでは認証を使わないため、先頭のプロフィールを「ログインユーザー」とみなす。
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.log("[v0] getProfile error:", error.message)
    return null
  }
  return data
}

/** 飼い主プロフィールを新規登録する */
export async function createProfile(name: string): Promise<Profile | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .insert({ name })
    .select("*")
    .single()

  if (error) {
    console.log("[v0] createProfile error:", error.message)
    throw new Error("プロフィールの登録に失敗しました")
  }
  revalidatePath("/")
  return data
}

/* -------------------------------------------------------------------------- */
/*  Diaries (日記データ) - CRUD                                                 */
/* -------------------------------------------------------------------------- */

/** Create: 新しい日記を保存する */
export async function createDiary(input: DiaryInsert): Promise<Diary> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("diaries")
    .insert({
      profile_id: input.profile_id,
      image_url: input.image_url,
      ai_diary_text: input.ai_diary_text,
    })
    .select("*")
    .single()

  if (error) {
    console.log("[v0] createDiary error:", error.message)
    throw new Error("日記の保存に失敗しました")
  }
  revalidatePath("/")
  return data
}

/** Read: 指定した飼い主の日記一覧を取得（新しい順） */
export async function getDiaries(profileId: string): Promise<Diary[]> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("profile_id", profileId)
    .order("number", { ascending: false })

  if (error) {
    console.log("[v0] getDiaries error:", error.message)
    return []
  }
  return data ?? []
}

/**
 * Read: 連番（number）を基準とした単一データ取得。
 * 前後移動のために direction で「次/前/その番号」を指定できる。
 */
export async function getDiaryByNumber(
  profileId: string,
  number: number,
  direction: "current" | "next" | "prev" = "current",
): Promise<Diary | null> {
  const supabase = getSupabaseClient()
  let query = supabase.from("diaries").select("*").eq("profile_id", profileId)

  if (direction === "current") {
    query = query.eq("number", number)
  } else if (direction === "next") {
    // 次の日記 = numberがより大きい中で最小
    query = query.gt("number", number).order("number", { ascending: true }).limit(1)
  } else {
    // 前の日記 = numberがより小さい中で最大
    query = query.lt("number", number).order("number", { ascending: false }).limit(1)
  }

  const { data, error } = await query.maybeSingle()

  if (error) {
    console.log("[v0] getDiaryByNumber error:", error.message)
    return null
  }
  return data
}

/** Update: お気に入り状態（is_favorite）を反転させる */
export async function toggleFavorite(id: string, current: boolean): Promise<Diary> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("diaries")
    .update({ is_favorite: !current })
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    console.log("[v0] toggleFavorite error:", error.message)
    throw new Error("お気に入りの更新に失敗しました")
  }
  revalidatePath("/")
  return data
}

/** Delete: 指定IDの日記を削除する */
export async function deleteDiary(id: string): Promise<void> {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("diaries").delete().eq("id", id)

  if (error) {
    console.log("[v0] deleteDiary error:", error.message)
    throw new Error("日記の削除に失敗しました")
  }
  revalidatePath("/")
}
