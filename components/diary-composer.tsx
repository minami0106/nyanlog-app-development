"use client"

import { useState, useRef } from "react"
import { ImagePlus, Sparkles, Send, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { generateCatDiary } from "@/lib/ai"
import { toast } from "sonner"
import type { Diary } from "@/lib/types"

export function DiaryComposer({
  profileId,
  onCreated,
}: {
  profileId: string
  onCreated: (diary: Diary) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) // 🌟 画像プレビュー用
  const [diaryText, setDiaryText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ファイルが選択されたときの処理
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      // 🌟 ローカルのプレビューURLを作成
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  // 1. AIに日記を書いてもらう処理
  const handleGenerateAI = async () => {
    if (!file) {
      toast.error("まずは写真を選んでくださいね")
      return
    }

    setIsGenerating(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const text = await generateCatDiary(formData)
      setDiaryText(text)
      toast.success("AI日記が完成しました！")
    } catch (error) {
      console.error(error)
      toast.error("AI日記の生成に失敗しました")
    } finally {
      setIsGenerating(false)
    }
  }

  // 2. 画像と日記をSupabaseに保存する処理
  const handleSave = async () => {
    if (!file || !diaryText.trim()) {
      toast.error("写真とAI日記の両方が必要です")
      return
    }

    setIsSaving(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `${profileId}/${fileName}`

      // Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 公開URLを取得
      const { data: urlData } = supabase.storage
        .from("posts")
        .getPublicUrl(filePath)

      const imageUrl = urlData.publicUrl

      // Databaseに保存し、生成された本物のデータを取得する
      const { data: insertedData, error: dbError } = await supabase
        .from("diaries")
        .insert([
          {
            profile_id: profileId,
            image_url: imageUrl,
            ai_diary_text: diaryText,
            is_favorite: false,
          }
        ])
        .select()
        .single()

      if (dbError) throw dbError

      // 本物のID（背番号）を含んだデータを画面側に渡します
      onCreated(insertedData as Diary)

      toast.success("日記をコレクションに保存しました！")

      // フォームを上品にリセット
      setFile(null)
      setPreviewUrl(null)
      setDiaryText("")

    } catch (error) {
      console.error(error)
      toast.error("日記の保存に失敗しました")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    // 🎨 全体を柔らかな光を纏うような淡いグレージュ（bg-[#f3ede4]/40）に変更
    <div className="rounded-2xl border border-[#e8dfd3] bg-[#f3ede4]/30 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2 text-[#3d3934]">
        <ImagePlus className="h-4 w-4 text-[#8c7e6e]" />
        <h2 className="text-sm font-medium tracking-widest font-serif">NEW POST</h2>
      </div>

      <div className="space-y-5">
        {/* 写真選択エリア */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e8dfd3] bg-white/50 p-6 transition-all hover:bg-white/80">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            id="file-upload"
          />

          {previewUrl ? (
            /* 🌟 写真が選ばれている時は、洗練されたスクエアプレビューを表示 */
            <div className="relative flex flex-col items-center gap-3">
              <div className="relative h-24 w-24 overflow-hidden rounded-md border border-[#e8dfd3] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#8c7e6e] underline underline-offset-4 hover:text-[#3d3934]"
              >
                写真を変更する
              </button>
            </div>
          ) : (
            /* 写真が選ばれていない時のミニマルな表示 */
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="rounded-full bg-[#f3ede4] p-3 text-[#8c7e6e]">
                <ImagePlus className="h-5 w-5" />
              </div>
              <span className="text-xs text-[#8c7e6e] font-light tracking-wider">愛猫のベストショットをセレクト</span>
            </button>
          )}
        </div>

        {/* AI生成ボタン */}
        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={!file || isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#8c7e6e] bg-transparent py-2.5 text-xs tracking-widest text-[#8c7e6e] transition-all hover:bg-[#8c7e6e] hover:text-white disabled:opacity-30"
        >
          {isGenerating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isGenerating ? "AI ANALYZING..." : "AIに日記を書いてもらう"}
        </button>

        {/* テキストエリア */}
        <div className="relative">
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            placeholder="AIが生成した日記がここに表示されます。手直しもできます。"
            rows={3}
            className="w-full rounded-xl border border-[#e8dfd3] bg-white/70 p-4 text-xs leading-relaxed text-[#4a4641] placeholder-[#bfaea1] focus:border-[#8c7e6e] focus:bg-white focus:outline-none focus:ring-0 font-light resize-none"
          />
        </div>

        {/* 保存ボタン */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!file || !diaryText.trim() || isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8c7e6e] py-3 text-xs tracking-widest text-white shadow-sm transition-all hover:bg-[#766a5c] disabled:opacity-30"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {isSaving ? "SAVING..." : "日記を保存する"}
        </button>
      </div>
    </div>
  )
}
