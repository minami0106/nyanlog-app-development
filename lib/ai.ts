"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google" // ←この1行をすぐ下に追加します

/**
 * AIが猫目線の日記を自動生成する。
 * 本来は画像を解析するが、このデモではアップロードした写真の「シーン」をヒントに、
 * 猫になりきった一人称の日記文を生成する。
 */
export async function generateCatDiary(imageFile: File): Promise<string> {
  try {
    // 1. 画像ファイルをAI（Gemini）が読めるバイナリデータ（Base64）に変換する
    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // 2. Gemini APIを呼び出して、画像を直接見せながら日記を作ってもらう
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      temperature: 0.8, // 追加
      system:
        "あなたは飼い主に溺愛されている猫です。 " +
        "アップロードされた写真から自分の状態や周囲の状況、表情を分析し、その瞬間の猫の気持ちになりきって日記を書いてください。\n" +
        "【ルール】\n" +
        "・猫の一人称（「わたし」など猫の性格に合うもの）を使うこと。\n" +
        "・語尾には猫らしい可愛い表現（「～にゃ」「～だにゃ」など）を自然に混ぜること。\n" +
        "・絵文字は使いすぎず、気まぐれで愛らしい猫らしさを出すこと。\n" +
        "・文字数は80～120文字程度の日本語で簡潔にまとめること。\n" +
        "・毎回必ず、今日の日記がこれまでとは異なるエピソードや感情になるように工夫すること。\n" +
        "・同じ表現の繰り返しを避け、常に新しい発見や気持ちを日記にすること。",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "今日のご主人様が撮ってくれた写真だよ！この写真のわたしの気持ちを日記にしてニャ。" },
            {
              type: "image",
              image: base64Image,
              mimeType: imageFile.type,
            },
          ],
        },
      ],
    });

    return text.trim();
  } catch (error) {
    console.error("Geminiの画像解析でエラーが発生しました:", error);
    // AIが使えない場合のフォールバック（仮の日記を返す）
    return fallbackDiary("写真から楽しそうな様子");
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
