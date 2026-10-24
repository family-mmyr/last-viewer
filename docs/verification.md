# 検証記録
実施日: 2026-10-22

## 自動検証
- npm test: 8件成功（Vitest）
- npm run build: 成功（TypeScript + Vite）
- npm run test:e2e: モバイルChromiumの統合シナリオ1件成功
  - 本番ビルドを /last-viewer/ で表示
  - Canvas描画・横はみ出しなし
  - 開始ボタンからコメントなしで脱出
  - リセットでクリア表示と行動数を初期化
  - 「絵画を調べて」送信で管理者記録を発見
  - 停止後に行動数が増えない
  - ページJavaScriptエラーなし
  - ぽこのチャット本文に十分な表示幅がある

タクへの信頼・無視による探索順の差、疑惑による変更、金庫・出口の前提条件、
ヒントの失効、クリア後の進行禁止、入力長制限はユニットテストで確認。
[モバイル表示のスクリーンショット](mobile-preview.png)

Phaserチャンクが約1.48MB（gzip約340KB）のためViteのサイズ警告が出る。ビルド失敗ではない。
音声・画像等の外部アセットは使用しない。

## ブラウザテストの再実行
標準:
```sh
npm ci
npx playwright install --with-deps chromium
npm run build
npm run test:e2e
```
システムのChromiumを使う場合:
```sh
CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e
```
GitHub Actionsにもビルド後のブラウザテストを設定済み。GitHub Actions上でもユニットテスト・ビルド・ブラウザテストがすべて成功。

## 未検証
- iPhone Safari実機
- WebKitブラウザ
- 公開URL上の実ブラウザ動作（デプロイ自体は成功）

## Pages公開作業（2026-10-24）
リポジトリのpublic化と、ユーザーによるPages設定完了後に失敗ジョブを再実行。
Actions run 40050686460 の再実行でdeploy成功を確認。
ログに「Reported success!」と公開URLが出力された。
https://family-mmyr.github.io/last-viewer/
https://github.com/family-mmyr/last-viewer/actions/runs/40050686460

GitHub Actions上でユニットテスト・ビルド・モバイルChromiumテストも成功。
公開URLを外部取得ツールで開く試みはツールのアクセス制限で失敗したため、
公開URL上のブラウザ動作とiPhone Safari実機は未検証。
今後はmainへのpushで自動デプロイされる。

## 公開後のiPhone Safari確認手順
1. iOS 16以降のSafariで https://family-mmyr.github.io/last-viewer/ を開く。
2. 縦横向きで画面が収まり、タップと日本語入力が使えることを確認する。
3. 標準速度で開始し、コメントなしで「脱出成功」になることを確認する。
4. リセットし、開始前に「絵画を調べて」を送信。最初に管理者記録が発見されることを確認する。
5. 停止後に行動が増えないこと、再開できることを確認する。
6. 再度リセットし「タクが怪しい」を送信。絵画探索と真相エンドを確認する。
7. ページ更新・戻る操作後に起動できることを確認する。保存機能はなく進行は初期化される。
