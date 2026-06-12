"use client"

import { useState } from "react"
import { Cat, BookOpen } from "lucide-react"
import { ProfileSetup } from "@/components/profile-setup"
import { DiaryComposer } from "@/components/diary-composer"
import { DiaryCard } from "@/components/diary-card"
import { DiaryViewer } from "@/components/diary-viewer"
import { toggleFavorite, deleteDiary } from "@/lib/actions"
import type { Diary, Profile } from "@/lib/types"
import { toast } from "sonner"

export function NyanlogApp({
  initialProfile,
  initialDiaries,
}: {
  initialProfile: Profile | null
  initialDiaries: Diary[]
}) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)
  const [diaries, setDiaries] = useState<Diary[]>(initialDiaries)
  const [viewing, setViewing] = useState<Diary | null>(null)

  // プロフィール未登録ならセットアップ画面を表示
  if (!profile) {
    return <ProfileSetup onCreated={setProfile} />
  }

  function handleCreated(diary: Diary) {
    setDiaries((prev) => [diary, ...prev])
  }

  async function handleToggleFavorite(target: Diary) {
    // 楽観的更新
    const updated = { ...target, is_favorite: !target.is_favorite }
    setDiaries((prev) => prev.map((d) => (d.id === target.id ? updated : d)))
    if (viewing?.id === target.id) setViewing(updated)
    try {
      await toggleFavorite(target.id, target.is_favorite)
    } catch {
      // 失敗したら元に戻す
      setDiaries((prev) => prev.map((d) => (d.id === target.id ? target : d)))
      toast.error("お気に入りの更新に失敗しました")
    }
  }

  async function handleDelete(target: Diary) {
    const prev = diaries
    setDiaries((cur) => cur.filter((d) => d.id !== target.id))
    if (viewing?.id === target.id) setViewing(null)
    try {
      await deleteDiary(target.id)
      toast.success("日記を削除しました")
    } catch {
      setDiaries(prev)
      toast.error("削除に失敗しました")
    }
  }

  const favoriteCount = diaries.filter((d) => d.is_favorite).length

  return (
    <main className="mx-auto min-h-svh w-full max-w-2xl px-4 pb-16">
      <header className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Cat className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tight">Nyanlog</h1>
            <p className="mt-1 text-xs text-muted-foreground">{profile.name}さんの猫日記</p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium">{diaries.length}</span>
        </div>
      </header>

      <DiaryComposer profileId={profile.id} onCreated={handleCreated} />

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">タイムライン</h2>
          {favoriteCount > 0 && (
            <span className="text-sm text-muted-foreground">お気に入り {favoriteCount}件</span>
          )}
        </div>

        {diaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <Cat className="mb-3 h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground text-pretty">
              まだ日記がありません。上のフォームから最初の一枚を投稿しましょう。
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {diaries.map((diary) => (
              <DiaryCard
                key={diary.id}
                diary={diary}
                onOpen={setViewing}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {viewing && (
        <DiaryViewer
          profileId={profile.id}
          initial={viewing}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setViewing(null)}
        />
      )}
    </main>
  )
}
