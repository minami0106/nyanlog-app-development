"use client"

import { useState } from "react"
import { Cat, BookOpen, Heart } from "lucide-react"
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

  // 🌟 追加：すべて表示するか、お気に入りのみ表示するかを管理するステート（'all' または 'favorites'）
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all')

  if (!profile) {
    return <ProfileSetup onCreated={setProfile} />
  }

  const handleCreated = (diary: Diary) => {
    setDiaries((prev) => [diary, ...prev])
  }

  const handleToggleFavorite = async (target: Diary) => {
    const updated = { ...target, is_favorite: !target.is_favorite }
    setDiaries((prev) =>
      prev.map((d) => (d.id === target.id ? updated : d))
    )
    if (viewing?.id === target.id) setViewing(updated)
    try {
      await toggleFavorite(target.id, target.is_favorite)
    } catch {
      setDiaries((prev) =>
        prev.map((d) => (d.id === target.id ? target : d))
      )
      toast.error("お気に入りの更新に失敗しました")
    }
  }

  const handleDelete = async (target: Diary) => {
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

  // 🌟 追加：選択されたモードに応じて表示する日記をフィルタリングする
  const displayedDiaries = diaries.filter((d) => {
    if (filterMode === "favorites") {
      return d.is_favorite
    }
    return true
  })

  return (
    // 🎨 ファチュイテ風ニュアンスカラー：背景をやわらかな淡いシルキーベージュ（bg-[#fcfaf7]）に
    <main className="mx-auto min-h-svh w-full max-w-4xl bg-[#fcfaf7] px-4 pb-16 text-[#4a4641]">
      <header className="flex items-center justify-between py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3ede4]">
            <Cat className="h-5 w-5 text-[#8c7e6e]" aria-hidden="true" />
          </div>
          <div>
            {/* 🌟 「みなみさんの猫日記」をスッキリ削除し、ブランドロゴのような佇まいに */}
            <h1 className="text-2xl font-light tracking-widest text-[#3d3934] font-serif">Nyanlog</h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#f3ede4] px-4 py-1.5 text-xs tracking-wider text-[#6b6155]">
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-medium">{diaries.length} posts</span>
        </div>
      </header>

      {/* 日記投稿エリア */}
      {profile ? (
        <DiaryComposer
          profileId={profile.id}
          onCreated={handleCreated}
        />
      ) : (
        <p>ユーザー情報を読み込み中です...</p>
      )}

      <section className="mt-12">
        {/* 🌟 フィルター切り替えタブエリア */}
        <div className="mb-6 flex items-center justify-center border-b border-[#e8dfd3] pb-4">
          <div className="flex rounded-full bg-[#f3ede4] p-1 text-xs font-medium">
            <button
              onClick={() => setFilterMode("all")}
              className={`rounded-full px-5 py-2 transition-all duration-300 tracking-wider ${filterMode === "all"
                ? "bg-[#8c7e6e] text-white shadow-sm"
                : "text-[#6b6155] hover:text-[#3d3934]"
                }`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterMode("favorites")}
              className={`flex items-center gap-1 rounded-full px-5 py-2 transition-all duration-300 tracking-wider ${filterMode === "favorites"
                ? "bg-[#8c7e6e] text-white shadow-sm"
                : "text-[#6b6155] hover:text-[#3d3934]"
                }`}
            >
              <Heart className={`h-3.5 w-3.5 ${filterMode === 'favorites' ? 'fill-current' : ''}`} />
              FAVORITES
            </button>
          </div>
        </div>

        {displayedDiaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e8dfd3] py-20 text-center">
            <Cat className="mb-3 h-8 w-8 text-[#bfaea1]" aria-hidden="true" />
            <p className="text-sm text-[#8c7e6e] font-light">
              {filterMode === "favorites" ? "お気に入りに登録された日記がまだありません。" : "日記がまだありません。"}
            </p>
          </div>
        ) : (
          /* 3列のスクエアグリッド */
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {displayedDiaries.map((diary) => (
              <div
                key={diary.id}
                className="aspect-square overflow-hidden rounded-md bg-[#f3ede4] transition-all duration-300 hover:opacity-90"
              >
                <DiaryCard
                  diary={diary}
                  onOpen={setViewing}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ポップアップビューワー */}
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