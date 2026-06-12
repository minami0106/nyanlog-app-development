"use client"

import { useState } from "react"
import Image from "next/image"
import { ImagePlus, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createDiary } from "@/lib/actions"
import { generateCatDiary } from "@/lib/ai"
import type { Diary } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// 写真アップロードをシミュレートするためのサンプル画像とシーンヒント
const SAMPLE_PHOTOS = [
  { url: "/cats/cat-1.png", hint: "窓際で日向ぼっこをしている" },
  { url: "/cats/cat-2.png", hint: "毛布の上で丸くなって眠っている" },
  { url: "/cats/cat-3.png", hint: "毛糸玉で元気に遊んでいる" },
  { url: "/cats/cat-4.png", hint: "ソファで大きく伸びをしている" },
]

export function DiaryComposer({
  profileId,
  onCreated,
}: {
  profileId: string
  onCreated: (diary: Diary) => void
}) {
  const [selected, setSelected] = useState<(typeof SAMPLE_PHOTOS)[number] | null>(null)
  const [draft, setDraft] = useState("")
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleGenerate() {
    if (!selected) {
      toast.error("まずは写真を選んでください")
      return
    }
    setGenerating(true)
    try {
      const text = await generateCatDiary(selected.hint)
      setDraft(text)
    } catch {
      toast.error("AI日記の生成に失敗しました")
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!selected || !draft.trim()) return
    setSaving(true)
    try {
      const diary = await createDiary({
        profile_id: profileId,
        image_url: selected.url,
        ai_diary_text: draft.trim(),
      })
      toast.success("日記を保存しました")
      onCreated(diary)
      setSelected(null)
      setDraft("")
    } catch {
      toast.error("保存に失敗しました")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <ImagePlus className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">今日の一枚を投稿</h2>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">写真を選んでください（アップロードをシミュレート）</p>
      <div className="mb-4 grid grid-cols-4 gap-2">
        {SAMPLE_PHOTOS.map((photo) => {
          const isActive = selected?.url === photo.url
          return (
            <button
              key={photo.url}
              type="button"
              onClick={() => setSelected(photo)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                isActive ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-border",
              )}
              aria-label={`写真を選択: ${photo.hint}`}
              aria-pressed={isActive}
            >
              <Image src={photo.url || "/placeholder.svg"} alt={photo.hint} fill className="object-cover" sizes="120px" />
              {isActive && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mb-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleGenerate}
          disabled={!selected || generating}
          className="w-full"
        >
          <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
          {generating ? "AIが日記を書いています..." : "AIに日記を書いてもらう"}
        </Button>
      </div>

      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="AIが生成した日記がここに表示されます。手直しもできます。"
        rows={4}
        className="mb-3 resize-none"
      />

      <Button type="button" onClick={handleSave} disabled={!selected || !draft.trim() || saving} className="w-full">
        {saving ? "保存中..." : "日記を保存する"}
      </Button>
    </Card>
  )
}
