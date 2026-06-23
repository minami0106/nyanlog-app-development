import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { getProfile, getDiaries } from "@/lib/actions";
import { NyanlogApp } from "@/components/nyanlog-app";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. ログインしていない場合はログインページへ
  if (!user) {
    redirect("/login");
  }

  // 2. プロフィールを取得。なければ空のオブジェクトを渡すなどの安全策
  const profile = await getProfile();

  // 3. プロフィールが存在する場合のみ日記を取得
  // プロフィールがない場合は空配列を渡すことで、データなし（空の画面）を保証
  const diaries = profile ? await getDiaries(profile.id) : [];

  return (
    <NyanlogApp
      initialProfile={profile || { id: "", user_id: user.id }}
      initialDiaries={diaries}
    />
  );
}