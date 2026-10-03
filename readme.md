# Pommu YouTube埋め込み

DLsiteの「pommu」で、投稿内にYouTubeのリンクがある場合に、その投稿の下へ動画の再生ウィンドウを埋め込むTampermonkeyユーザースクリプトです。

複数のYouTubeリンクがある投稿では、タブで動画を切り替えられます。

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

- 投稿内のYouTubeリンクを自動検出
- 投稿の下にYouTubeの再生ウィンドウを埋め込み
- 複数のYouTubeリンクがある場合はタブで切り替え
- 同じ動画のリンクが複数あっても、1つにまとめて表示
- YouTubeの通常動画に対応
- YouTube Shortsに対応
- YouTube Liveに対応
- "youtu.be"形式のURLに対応
- `t=` や `start=` で指定した開始時間に対応
- 最初はサムネイルのみ表示し、タップした時にプレイヤーを読み込む(読み込みが軽い)
- 無限スクロールなどで後から追加された投稿にも対応
- プレイヤーをタップしても投稿詳細へ遷移しない

## 使い方

Pommuでタイムラインや投稿詳細を開きます。

投稿にYouTubeのリンクが含まれていると、その投稿の下にサムネイルと再生ボタンが表示されます。

サムネイルをタップすると、その場でプレイヤーに切り替わり、自動再生されます。

投稿に複数のYouTubeリンクがある場合は、サムネイルの上に「動画1」「動画2」…のタブが表示されます。タブを押すと、表示する動画を切り替えられます。切り替えた直後はサムネイルが表示されるので、再生したい場合はもう一度タップしてください。

## 対応するYouTube URL

以下の形式に対応しています。

通常の動画

https://www.youtube.com/watch?v=XXXXXXXXXXX

Shorts

https://www.youtube.com/shorts/XXXXXXXXXXX

YouTube Live

https://www.youtube.com/live/XXXXXXXXXXX

短縮URL

https://youtu.be/XXXXXXXXXXX

開始時間の指定にも対応しています。

https://youtu.be/XXXXXXXXXXX?t=90

## 埋め込みの仕組み

投稿内のリンクから動画IDを取り出し、YouTubeの埋め込みプレイヤー（`youtube-nocookie.com`）をiframeで表示します。

プレイヤーはサムネイルをタップするまで読み込まないため、投稿が多い画面でも表示が重くなりにくくなっています。

## 通信について

このスクリプトは、以下のURLへ通信します。

- `https://i.ytimg.com`：サムネイル画像の取得
- `https://www.youtube-nocookie.com/embed/`：サムネイルをタップした時のプレイヤー読み込み

Pommu側のAPIへ追加のリクエストを送信する仕組みはありません。

## 権限について

Tampermonkeyの特別な権限（GM_*）は使用していません（`@grant none`）。

## 更新

スクリプトにはGitHubのRawファイルを更新先として設定しています。

GitHub上でスクリプトを更新し、"@version"を変更することで新しいバージョンを公開できます。

現在のバージョン：

"1.3"

更新用URL：

https://raw.githubusercontent.com/4STRA1/pommu-youtube-embed/main/pommu-youtube-embed.user.js

## GitHub

リポジトリ：

https://github.com/4STRA1/pommu-youtube-embed

作者：

https://github.com/4STRA1

## 注意事項

このスクリプトはDLsiteおよびYouTubeの公式機能ではありません。

動画の投稿者が埋め込みを禁止している場合や、年齢制限・非公開・削除などの動画は、プレイヤー内にエラーが表示され、再生できません。

Pommu側のCSP（Content Security Policy）の設定によっては、サムネイルやプレイヤーが表示されない場合があります。

YouTube側の仕様変更やPommu側の画面構成の変更によって、動作しなくなる可能性があります。
