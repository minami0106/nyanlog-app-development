import { NyanlogApp } from "@/components/nyanlog-app"
import { getProfile, getDiaries } from "@/lib/actions"

export default async function Page() {
  // サーバー側で飼い主プロフィールと日記一覧を取得
  const profile = await getProfile()
  const diaries = profile ? await getDiaries(profile.id) : []

  return <NyanlogApp initialProfile={profile} initialDiaries={diaries} />
}
