"use client"

import Image from "next/image"
import { Heart, Trash2 } from "lucide-react"
import type { Diary } from "@/lib/types"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function DiaryCard({
  diary,
  onOpen,
  onToggleFavorite,
  onDelete,
}: {
  diary: Diary
  onOpen: (diary: Diary) => void
  onToggleFavorite: (diary: Diary) => void
  onDelete: (diary: Diary) => void
}) {
  return (
    <div className="group relative h-full w-full overflow-hidden bg-[#f3ede4]">
      {/* 写真をクリックすると詳細が開くメインボタン */}
      <button
        type="button"
        onClick={() => onOpen(diary)}
        className="relative block h-full w-full aspect-square"
        aria-label={`${formatDate(diary.created_at)}の日記を開く`}
      >
        <Image
          src={diary.image_url || "/placeholder.svg"}
          alt="愛猫の写真"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, 300px"
        />
        {/* 🌟 No.1バッジを削除し、ホバーした時だけ上品に浮かび上がるグレージュの透過膜 */}
        <div className="absolute inset-0 bg-[#3d3934]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      {/* 🌟 右上にお気に入りのハートとゴミ箱を小さく配置（ホバーで表示、スマホは常時表示） */}
      <div className="absolute right-2 top-2 flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 bg-white/70 backdrop-blur-md p-1 rounded-full shadow-sm">
        <button
          type="button"
          onClick={() => onToggleFavorite(diary)}
          className="rounded-full p-1 text-[#8c7e6e] hover:text-[#d96666] transition-colors"
          aria-label={diary.is_favorite ? "お気に入りを解除" : "お気に入りに追加"}
        >
          {/* 🌟 星からハートへ変更 */}
          <Heart
            className={`h-4 w-4 transition-all ${diary.is_favorite ? "fill-[#d96666] text-[#d96666]" : "text-[#8c7e6e]"
              }`}
          />
        </button>
        <button
          type="button"
          onClick={() => onDelete(diary)}
          className="rounded-full p-1 text-[#8c7e6e] hover:text-red-600 transition-colors"
          aria-label="この日記を削除"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}