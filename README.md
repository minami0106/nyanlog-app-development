# Nyanlog

Next.jsとSupabaseを用いた猫日記アプリケーションです。
ユーザー登録、写真投稿による日記自動生成、AIチャットボット、お気に入り機能を通じて、愛猫の日記と振り返りを効率化します。

## サイトイメージ
![Nyanlogのトップページ](./docs/アプリのメインページ画像.png)

## サイトURL
https://nyanlog-iota.vercel.app/login  
下記アカウントでログイン可能です。  
メールアドレス：test02@example.com  
パスワード：222222

## 使用技術
* フロントエンド: Next.js 15.3, Tailwind CSS
* バックエンド: Next.js (API Routes)
* データベース・認証: Supabase
* AI連携: Google Generative AI (Gemini 2.0 Flash)
* デプロイ：Vercel
* バージョン管理：Git, GitHub
* テスト・デバッグ：DevTools (Chrome)

## 設計ドキュメント
* [要件定義・基本設計・詳細設計の一覧 Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1uB_QvXU_HTi7Fc_vpEdMSRz32dq5SfFwcHpVb603KR8/edit?gid=0#gid=0)
* 詳細設計時のワイヤーフレーム、ER図、ワークフロー図の画像はdocsディレクトリに格納しています。[（こちらからアクセス）](https://github.com/minami0106/nyanlog-app-development/tree/main/docs)

## 機能一覧
* ユーザー登録、ログイン機能（メールアドレスとGoogleアカウント）
* 写真投稿による日記自動生成機能
* AIチャットボット機能（Gemini 2.0 flashモデルを使用）
* お気に入り機能

## テスト・修正の設計及び実施書
* [テスト・修正の設計及び実施書 Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1evB9mIqTyzHspx-W_cPy5kVOpLEtSpaH1qZlwgHI0kM/edit?gid=0#gid=0)

## 備考
* 活用した生成AIとその用途
    * ChatGPT：要件定義、設計、各種リサーチ
    * v0：アプリのモック作成
    * GitHub Copilot Chat：ローカル環境でのコードの修正相談
* リファクタリングのルール
    * 2つ以上のファイルで使う、行数が10行以上のUIコンポーネントはcomponentsフォルダに移行
    * 2つ以上のファイルで使う、行数が10行以上の関数はlibフォルダに移行
    * 変数名で2つ以上の単語が入る場合は、「isPublished」のように二つ目以降の単語の頭を大文字とする

