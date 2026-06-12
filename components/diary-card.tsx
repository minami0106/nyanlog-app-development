"use client"

import Image from "next/image"
import { Star, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Diary } from "@/lib/types"
import { cn } from "@/lib/utils"

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
    <Card className="overflow-hidden p-0">
      <button
        type="button"
        onClick={() => onOpen(diary)}
        className="relative block aspect-video w-full"
        aria-label={`日記 No.${diary.number} を開く`}
      >
        <Image
          src={diary.image_url || "/placeholder.svg"}
          alt="愛猫の写真"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
          No.{diary.number}
        </span>
      </button>
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <time className="text-xs text-muted-foreground">{formatDate(diary.created_at)}</time>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleFavorite(diary)}
              aria-label={diary.is_favorite ? "お気に入りを解除" : "お気に入りに追加"}
              aria-pressed={diary.is_favorite}
            >
              <Star
                className={cn(
                  "h-4 w-4 transition-colors",
                  diary.is_favorite ? "fill-primary text-primary" : "text-muted-foreground",
                )}
              />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(diary)}
              aria-label="この日記を削除"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-pretty">{diary.ai_diary_text}</p>
      </div>
    </Card>
  )
}
