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
- GitHub Pagesへの実デプロイと公開URL上の挙動

## Pages公開作業（2026-10-24）
ユーザーによるリポジトリのpublic化を確認。
actions/configure-pages@v5（enablement: true）をdeploy前に追加した。
ローカルのユニットテスト8件・ビルドと、GitHub Actions上のビルド・ブラウザテストは成功。
Actions run 40050686460 の初回Pages有効化は
「Resource not accessible by integration」で拒否された。
設定APIへの環境からのアクセスもForbidden。Pagesの有効化・公開は未完了。

管理者が https://github.com/family-mmyr/last-viewer/settings/pages で
Build and deployment → Source → GitHub Actionsを選択する必要がある。
その後、同runの失敗ジョブのみを再実行する。
https://github.com/family-mmyr/last-viewer/actions/runs/40050686460

## 公開後のiPhone Safari確認手順
1. iOS 16以降のSafariで https://family-mmyr.github.io/last-viewer/ を開く。
2. 縦横向きで画面が収まり、タップと日本語入力が使えることを確認する。
3. 標準速度で開始し、コメントなしで「脱出成功」になることを確認する。
4. リセットし、開始前に「絵画を調べて」を送信。最初に管理者記録が発見されることを確認する。
5. 停止後に行動が増えないこと、再開できることを確認する。
6. 再度リセットし「タクが怪しい」を送信。絵画探索と真相エンドを確認する。
7. ページ更新・戻る操作後に起動できることを確認する。保存機能はなく進行は初期化される。
