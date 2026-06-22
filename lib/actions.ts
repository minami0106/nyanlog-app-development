"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase"
import type { Diary, DiaryInsert, Profile } from "@/lib/types"

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    return data;
  }

  const { data: guestData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", "04c6551c-46bd-4ef5-a03c-b0dd89f055dc")
    .maybeSingle();

  console.log("取得データ:", guestData);
  return guestData;
}

export async function createProfile(name: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .insert({ name })
    .select("*")
    .single()

  if (error) throw new Error("プロフィールの登録に失敗しました")
  revalidatePath("/")
  return data
}

export async function createDiary(input: DiaryInsert): Promise<Diary> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diaries")
    .insert(input)
    .select("*")
    .single()

  if (error) throw new Error("日記の保存に失敗しました")
  revalidatePath("/")
  return data
}

export async function getDiaries(profileId: string): Promise<Diary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diaries")
    .select("*")
    .eq("profile_id", profileId)
    .order("number", { ascending: false })

  if (error) return []
  return data ?? []
}

export async function getDiaryByNumber(profileId: string, number: number, direction: "current" | "next" | "prev" = "current"): Promise<Diary | null> {
  const supabase = await createClient();
  let query = supabase.from("diaries").select("*").eq("profile_id", profileId)

  if (direction === "current") {
    query = query.eq("number", number)
  } else if (direction === "next") {
    query = query.gt("number", number).order("number", { ascending: true }).limit(1)
  } else {
    query = query.lt("number", number).order("number", { ascending: false }).limit(1)
  }

  const { data, error } = await query.maybeSingle()
  if (error) return null
  return data
}

export async function toggleFavorite(id: string, current: boolean): Promise<Diary> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diaries")
    .update({ is_favorite: !current })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error("お気に入りの更新に失敗しました")
  revalidatePath("/")
  return data
}

export async function deleteDiary(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("diaries").delete().eq("id", id)

  if (error) throw new Error("日記の削除に失敗しました")
  revalidatePath("/")
}

