"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDiaryByNumber } from "@/lib/actions"
import type { Diary } from "@/lib/types"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * 連番（number）を基準に前後の日記へ移動できるビューア。
 * getDiaryByNumber を direction 付きで呼び出して単一データを取得する。
 */
export function DiaryViewer({
  profileId,
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
  const [loading, setLoading] = useState(false)

  async function move(direction: "prev" | "next") {
    setLoading(true)
    try {
      const next = await getDiaryByNumber(profileId, diary.number, direction)
      if (next) {
        setDiary(next)
      } else {
        toast.info(direction === "next" ? "最新の日記です" : "最初の日記です")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <Card className="relative w-full max-w-lg overflow-hidden p-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-8 w-8 bg-card/80 backdrop-blur"
          onClick={onClose}
          aria-label="閉じる"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative aspect-video w-full">
          <Image
            src={diary.image_url || "/placeholder.svg"}
            alt="愛猫の写真"
            fill
            className="object-cover"
            sizes="600px"
          />
          <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
            No.{diary.number}
          </span>
        </div>

        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <time className="text-xs text-muted-foreground">{formatDate(diary.created_at)}</time>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleFavorite(diary)}
              aria-label={diary.is_favorite ? "お気に入りを解除" : "お気に入りに追加"}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  diary.is_favorite ? "fill-primary text-primary" : "text-muted-foreground",
                )}
              />
            </Button>
          </div>
          <p className="min-h-16 text-sm leading-relaxed text-pretty">{diary.ai_diary_text}</p>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Button type="button" variant="outline" onClick={() => move("prev")} disabled={loading} className="flex-1">
              <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
              前の日記
            </Button>
            <Button type="button" variant="outline" onClick={() => move("next")} disabled={loading} className="flex-1">
              次の日記
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
