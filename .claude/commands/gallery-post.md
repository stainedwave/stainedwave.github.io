# gallery-post

gallery_photo/ フォルダの画像と記事内容をもとに、ギャラリー投稿を作成してGitHubにpushするスキル。

## トリガー

ユーザーが「このファイル使って」「gallery_photo/〇〇 を使って」など、gallery_photo/ 内のファイルを指定しながら記事内容を渡してきたとき。

## 手順

### 1. 画像の確認とコピー

```
gallery_photo/ の中身を確認し、指定されたファイルを特定する。
```

- `gallery_photo/` に置かれたファイルを `assets/images/gallery/` にコピーする
- ファイル名はそのまま使う（例: `1.jpg` → `assets/images/gallery/1.jpg`）
- すでに同名ファイルが存在する場合はユーザーに確認する

### 2. 投稿ファイルの作成

`_gallery/YYYY-MM-DD-slug.md` を作成する。

**ファイル名のルール:**
- 日付はユーザー指定があればそれを使う。なければ今日の日付
- slug は記事タイトルを英数字・ハイフンに変換したもの（例: `studio-session`）

**frontmatter:**

```yaml
---
title: "記事タイトル"
date: YYYY-MM-DD HH:MM:SS +0900
image: /assets/images/gallery/ファイル名
description: "記事の一行説明（description がなければ冒頭文から抜粋）"
---
```

**本文:**
- ユーザーから渡された文章をそのまま記載する
- 段落の区切りは空行で表現する（Markdown 標準）
- 文章の改変・要約はしない

### 3. 表示・レイアウトの確認ポイント

作成前に以下を意識する（変更不要なら確認のみ）:

| 場所 | 期待される表示 |
|------|--------------|
| TOPページ GALLERY セクション | 最新3件の画像がグリッドで自動表示される |
| `/gallery/` 一覧 | 全投稿が新しい順に3列グリッドで表示される |
| 投稿詳細ページ（PC） | 画像が max 680px センタリング、全景が見える状態 |
| 投稿詳細ページ（スマホ） | 画像が画面幅いっぱい、全景が見える状態 |

レイアウト崩れが起きやすいケース:
- `object-fit: cover` は使わない（画像がトリミングされる）
- 画像に `max-height` を設定しない（縦長画像が切れる）
- `.gallery-post-hero` に `overflow: hidden` を使う場合は `height: auto` とセットで

### 4. git push

```
git add assets/images/gallery/<ファイル名> _gallery/<投稿ファイル名>
git commit -m "Add gallery post: <タイトル>"
git push origin main
```

push 後、GitHub Pages のデプロイに 2〜3 分かかることをユーザーに伝える。

## ファイル構成（参考）

```
stainedwave.github.io/
├── gallery_photo/          ← ユーザーが画像を置く場所（リポジトリ管理外）
├── assets/images/gallery/  ← 実際に参照される画像の置き場所
├── _gallery/               ← 投稿 .md ファイル（Jekyll コレクション）
│   └── YYYY-MM-DD-slug.md
├── gallery/
│   └── index.html          ← 一覧ページ（Liquid で自動生成）
└── _layouts/
    └── gallery-post.html   ← 投稿詳細ページのレイアウト
```

## 注意事項

- `_config.yml` の `future: false` により、**未来日時の投稿は本番に表示されない**。日時指定はユーザーに確認する
- 投稿の並び順は **日付の新しい順**（`sort: "date" | reverse`）
- TOPページへの反映は `limit:3` で自動。手動の変更不要
