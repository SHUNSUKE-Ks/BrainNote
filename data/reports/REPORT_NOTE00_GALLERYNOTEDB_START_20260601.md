# Report: note00-gallerynotedb_vol1.1 開発開始

## 基本情報

- Report ID: report_note00_gallerynotedb_start_20260601
- Project Name: note00-gallerynotedb_vol1.1
- Source App: NACC System
- Clone Source: git@github.com:SHUNSUKE-Ks/nacc_system.git
- Target Path: C:/Users/enjoy/InBox2026/InBox0601/06_AppList/note00-gallerynotedb_vol1.1
- Created At: 2026-06-01
- Status: prepared

## 目的

NACC Systemをベースに、化粧品用途ではない汎用ノートアプリのサンプルとして再構成する。
既存アプリが持つGallery、DB、Relationの仕組みを活用し、UPNOTE仕様のノート機能を追加する。

## 初期方針

- NACC Systemを `06_AppList` にクローンする
- プロジェクト名を `note00-gallerynotedb_vol1.1` へ差し替える
- 化粧品・業務用途の既存データは削除する
- Gallery / DB / Relation の構造は、汎用ノートDBとして再利用できる範囲を残す
- 既存ノート機能はすぐ消さず、UPNOTE専用ノート機能を別系統で作る
- UPNOTE専用ノート機能が安定してから、古いノート機能の処遇を判断する

## UPNOTE仕様ノートの実装方針

UPNOTE仕様ノートは、あとから別アプリでも使い回せるように分離する。

想定分離単位：

- note domain model
- note editor component
- note list / gallery component
- note tag filter
- note relation panel
- note persistence adapter
- note state controller

## State設計

ユーザー状態を明示し、後から状態別ショートカットを入れやすくする。

初期state案：

```json
{
  "activeSurface": "editor",
  "activeNoteId": null,
  "selectionMode": "none",
  "editorMode": "idle",
  "sidePanel": "tags",
  "filterTags": [],
  "relationFocusId": null,
  "isDirty": false
}
```

状態の意味：

- `activeSurface`: editor / gallery / database / relation / sidePanel
- `activeNoteId`: 現在開いているノート
- `selectionMode`: none / single / multi
- `editorMode`: idle / writing / composing / preview
- `sidePanel`: tags / outline / relation / metadata
- `filterTags`: tag filter対象
- `relationFocusId`: relation表示の中心ノード
- `isDirty`: 未保存変更の有無

## 残す候補機能

- 既存のtag system
- Gallery view
- DB view
- Relation view
- record/detail編集の基本構造
- data schema / sample data loadingの仕組み

## 削除候補

- 化粧品固有のサンプルデータ
- NACC業務固有のラベル、説明文、カテゴリ
- 汎用ノートアプリに不要な固定項目
- 旧PWAアイコン、旧アプリ名表示

## PWA Icon方針

BrainNoteとは別物として、以下の方向で検討する。

- Gallery + Note + DB が一目で伝わる形
- ノート紙、カード、ノード接続を組み合わせる
- 色はBrainNoteと被りすぎない落ち着いた配色
- 小さいサイズでも識別できる単純なシルエット

## 開発Plan

1. `06_AppList` にNACC Systemをクローン
2. Project name / package name / app title を `note00-gallerynotedb_vol1.1` 系へ変更
3. 既存データと化粧品固有文言を棚卸し
4. 削除してよいデータと、再利用する構造を分ける
5. UPNOTE専用ノート機能のdomain / component / stateを新設
6. Gallery / DB / RelationとUPNOTEノートを接続
7. PWA icon案を作成
8. BrainNoteへ進捗Reportを追加

## DONE定義

- クローン先でアプリが起動できる
- プロジェクト名が差し替わっている
- 化粧品固有データが消えている
- 汎用ノート用の初期サンプルデータが入っている
- UPNOTE専用ノート機能が既存ノートから分離されている
- Stateで現在のユーザー状態が追える
- Gallery / DB / Relationでノートを扱える
- PWA iconの初期案が入っている

## Codexメモ

削除作業は、clone後に構造を確認してから行う。
既存ノートやtag機能は参考実装として扱い、すぐに消さない。

## 準備実行結果

- Clone完了: C:/Users/enjoy/InBox2026/InBox0601/06_AppList/note00-gallerynotedb_vol1.1
- SSH cloneはHost key verificationで停止したため、HTTPS cloneで取得した
- 旧remoteは誤push防止のため `upstream-nacc` にrenameした
- Project/PWA nameを `note00-gallerynotedb_vol1.1` 系へ変更した
- NACC由来の商品・栄養素・ギャラリーサンプル・初期ブログデータを空にした
- UPNOTE専用の分離領域 `src/features/upnote` を追加した
- `DevStart_note00-gallerynotedb_vol1.1.md` をclone先に追加した
- `npm install` 完了
- `npm run build` 成功
- clone先local commit: `b0cae2e Prepare note00 gallery note db`
