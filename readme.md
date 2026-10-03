# Pommu 動画埋め込み（YouTube / ニコニコ動画）

DLsiteの「pommu」で、投稿内にYouTubeまたはニコニコ動画のリンクがある場合に、その投稿の下へ動画の再生ウィンドウを埋め込むTampermonkeyユーザースクリプトです。

複数の動画リンクがある投稿では、タブで動画を切り替えられます。YouTubeとニコニコ動画が混在していても、タブの表示で見分けられます。

## 対応サイト

https://ch.dlsite.com/pommu/

## インストール

Tampermonkey必須。

↓Google Chrome版↓
https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja

↓Firefox版↓
https://addons.mozilla.org/ja/firefox/addon/tampermonkey/

Tampermonkeyを起動し、ユーティリティ → URLからインポートで以下のURLを入力してください。

https://raw.githubusercontent.com/4STRA1/pommu-youtube-embed/main/pommu-youtube-embed.user.js

インストール画面が表示されたら「インストール」を選択してください。

また、js本体のプログラムコードをコピーして、新規ユーザースクリプトに貼り付けて保存することでもインストールできます。

## 機能

- 投稿内のYouTube・ニコニコ動画のリンクを自動検出
- 投稿の下に再生ウィンドウを埋め込み
- 複数の動画リンクがある場合はタブで切り替え
- タブにサイト名（YouTube / ニコニコ）とサイトごとの連番を表示し、サイトごとに色分け
- 同じ動画のリンクが複数あっても、1つにまとめて表示
- YouTubeの通常動画・Shorts・Liveに対応
- "youtu.be"形式のURLに対応
- ニコニコ動画の通常URL・短縮URL（nico.ms）に対応
- 開始時間の指定に対応（YouTube: `t=` / `start=`、ニコニコ: `from=`）
- 最初はサムネイル（ニコニコはプレースホルダー）のみ表示し、タップした時にプレイヤーを読み込む（読み込みが軽い）
- 無限スクロールなどで後から追加された投稿にも対応
- プレイヤーをタップしても投稿詳細へ遷移しない

## 使い方

Pommuでタイムラインや投稿詳細を開きます。

投稿にYouTubeまたはニコニコ動画のリンクが含まれていると、その投稿の下に再生ボタン付きの表示が出ます。

- YouTube：動画のサムネイルが表示されます。
- ニコニコ動画：サムネイルは取得しないため、「ニコニコ動画 sm…」と書かれた暗いプレースホルダーが表示されます。

タップすると、その場でプレイヤーに切り替わり、再生されます。ニコニコ動画で自動再生が始まらない場合は、プレイヤー内の再生ボタンを押してください。

投稿に複数の動画リンクがある場合は、上に「YouTube 1」「ニコニコ 1」「YouTube 2」…のタブが表示されます。タブを押すと、表示する動画を切り替えられます。

- 左端の線と選択時の色：YouTubeは赤、ニコニコは濃いグレーです。
- 番号はサイトごとに数えます。
- 切り替えた直後は再生前の表示（サムネイルなど）になるので、再生したい場合はもう一度タップしてください。

リンクが1つだけの投稿には、タブは表示されません。

## 対応するURL

YouTube

- 通常の動画：https://www.youtube.com/watch?v=XXXXXXXXXXX
- Shorts：https://www.youtube.com/shorts/XXXXXXXXXXX
- YouTube Live：https://www.youtube.com/live/XXXXXXXXXXX
- 短縮URL：https://youtu.be/XXXXXXXXXXX

ニコニコ動画

- 通常の動画：https://www.nicovideo.jp/watch/smXXXXXXXX
- 短縮URL：https://nico.ms/smXXXXXXXX
- 動画IDは `sm` / `nm` / `so` から始まるもの、および数字のみのIDに対応しています。

開始時間の指定にも対応しています。

- https://youtu.be/XXXXXXXXXXX?t=90
- https://www.nicovideo.jp/watch/smXXXXXXXX?from=90

## 埋め込みの仕組み

投稿内のリンクから動画IDを取り出し、各サービスの埋め込みプレイヤーをiframeで表示します。

- YouTube：`youtube-nocookie.com`
- ニコニコ動画：`embed.nicovideo.jp`

プレイヤーはタップするまで読み込まないため、投稿が多い画面でも表示が重くなりにくくなっています。

## 通信について

このスクリプトは、以下のURLへ通信します。

- `https://i.ytimg.com`：YouTubeのサムネイル画像の取得
- `https://www.youtube-nocookie.com/embed/`：YouTube動画をタップした時のプレイヤー読み込み
- `https://embed.nicovideo.jp/watch/`：ニコニコ動画をタップした時のプレイヤー読み込み

Pommu側のAPIへ追加のリクエストを送信する仕組みはありません。

## 権限について

Tampermonkeyの特別な権限（GM_*）は使用していません（`@grant none`）。

## 更新

スクリプトにはGitHubのRawファイルを更新先として設定しています。

GitHub上でスクリプトを更新し、"@version"を変更することで新しいバージョンを公開できます。

現在のバージョン：

"1.5"

更新用URL：

https://raw.githubusercontent.com/4STRA1/pommu-youtube-embed/main/pommu-youtube-embed.user.js

## GitHub

リポジトリ：

https://github.com/4STRA1/pommu-youtube-embed

作者：

https://github.com/4STRA1

## 注意事項

このスクリプトはDLsite、YouTube、ニコニコ動画の公式機能ではありません。

動画の投稿者が埋め込みを禁止している場合や、年齢制限・非公開・削除などの動画は、プレイヤー内にエラーが表示され、再生できません。

Pommu側のCSP（Content Security Policy）の設定によっては、サムネイルやプレイヤーが表示されない場合があります。

ニコニコ動画のプレイヤーは、自動再生がブラウザやサービス側の仕様で効かない場合があります。

YouTube・ニコニコ動画側の仕様変更やPommu側の画面構成の変更によって、動作しなくなる可能性があります。
