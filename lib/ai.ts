"use server"

import { generateText } from "ai"

/**
 * AIが猫目線の日記を自動生成する。
 * 本来は画像を解析するが、このデモではアップロードした写真の「シーン」をヒントに、
 * 猫になりきった一人称の日記文を生成する。
 */
export async function generateCatDiary(sceneHint: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      system:
        "あなたは飼い猫です。飼い主がアップロードした写真のシーンをもとに、" +
        "猫の一人称（「ボク」や「ワタシ」など気ままに）で、その日の出来事を日記として書いてください。" +
        "気まぐれで愛らしい猫らしさを出し、絵文字は使わず、80〜120文字程度の日本語で書いてください。",
      prompt: `今日の写真のシーン: ${sceneHint}\nこのシーンをもとに、猫目線の日記を書いてください。`,
    })
    return text.trim()
  } catch (error) {
    console.log("[v0] generateCatDiary error:", error)
    // AI Gatewayが使えない場合（クレジットカード未登録など）のフォールバック。
    // シーンに応じた猫目線の日記をランダムに返す。
    return fallbackDiary(sceneHint)
  }
}

function fallbackDiary(sceneHint: string): string {
  const templates = [
    `今日は${sceneHint}。ぽかぽかして、いつのまにかウトウトしちゃったニャ。気持ちのいい一日だった。`,
    `${sceneHint}ところを飼い主に見られたみたい。恥ずかしいけど、まあいいか。今日も平和なりよ。`,
    `${sceneHint}。あんまり気分が良かったから、ついしっぽがゆれちゃった。明日も同じ場所で過ごそうっと。`,
    `ふと気づいたら${sceneHint}。退屈しのぎにはちょうどいいニャ。夜はおいしいごはんが待ってるはず。`,
  ]
  return templates[Math.floor(Math.random() * templates.length)]
}
