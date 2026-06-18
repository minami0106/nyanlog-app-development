"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, X } from "lucide-react"
import type { Diary } from "@/lib/types"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function DiaryViewer({
  initial,
  onToggleFavorite,
  onClose,
}: {
  profileId: string
  initial: Diary
  onToggleFavorite: (diary: Diary) => void
  onClose: () => void
}) {
  const [diary, setDiary] = useState<Diary>(initial)

  const handleFavoriteClick = () => {
    const updated = { ...diary, is_favorite: !diary.is_favorite }
    setDiary(updated)
    onToggleFavorite(diary)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3d3934]/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-[#fcfaf7] shadow-xl border border-[#e8dfd3]">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 text-[#6b6155] hover:bg-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* 写真部分 */}
        <div className="relative aspect-square w-full bg-[#f3ede4]">
          <Image
            src={diary.image_url || "/placeholder.svg"}
            alt="日記の写真"
            fill
            className="object-cover"
          />
        </div>

        {/* テキストコンテンツ部分 */}
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <time className="text-xs tracking-wider text-[#8c7e6e] font-medium">
              {formatDate(diary.created_at)}
            </time>

            {/* 🌟 ポップアップ内のお気に入りも星からハートへ変更 */}
            <button
              onClick={handleFavoriteClick}
              className="flex items-center gap-1 rounded-full border border-[#e8dfd3] bg-white px-3 py-1 text-xs text-[#6b6155] hover:bg-[#fcfaf7] transition-colors"
            >
              <Heart
                className={`h-3.5 w-3.5 transition-all ${diary.is_favorite ? "fill-[#d96666] text-[#d96666]" : "text-[#6b6155]"
                  }`}
              />
              {diary.is_favorite ? "お気に入り" : "お気に入りに追加"}
            </button>
          </div>

          <div className="rounded-lg bg-[#f3ede4]/40 p-4 border border-[#f3ede4]">
            <p className="text-sm leading-relaxed text-[#4a4641] font-light whitespace-pre-wrap">
              {diary.ai_diary_text}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}