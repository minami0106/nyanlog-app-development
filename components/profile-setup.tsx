"use client"

import { useState } from "react"
import { Cat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createProfile } from "@/lib/actions"
import type { Profile } from "@/lib/types"
import { toast } from "sonner"

export function ProfileSetup({ onCreated }: { onCreated: (profile: Profile) => void }) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const profile = await createProfile(name.trim())
      if (profile) {
        toast.success(`ようこそ、${profile.name}さん`)
        onCreated(profile)
      }
    } catch (err) {
      toast.error("登録に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Cat className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-balance">Nyanlogへようこそ</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            愛猫の写真をアップロードすると、AIが猫目線の日記を書いてくれます。まずは飼い主のお名前を教えてください。
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="owner-name" className="text-sm font-medium">
              飼い主のお名前
            </label>
            <Input
              id="owner-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: みなみ"
              maxLength={30}
              required
            />
          </div>
          <Button type="submit" disabled={loading || !name.trim()} className="w-full">
            {loading ? "登録中..." : "はじめる"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
