# 最後の視聴者
React + TypeScript + Vite + Phaserによる、視聴者参加型の自律脱出ゲームMVP。

## 開発
Node.js 22推奨。

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

開発URLは http://localhost:5173/last-viewer/ 。「自律プレイ開始」で探索開始、停止・再開・リセット可能。
コメントなしでも脱出できる。「絵画を調べて」で優先順位、「タクが怪しい」で信頼判断が変わる。
開始から最初の行動までは設定した行動間隔分待つ。リセット時に信頼度も再抽選する。

## GitHub Pages
1. この変更をリポジトリの main にpushする。
2. GitHubの Settings → Pages → Build and deployment → Source を **GitHub Actions** に設定する。
3. Actionsの「Deploy to GitHub Pages」の成功を確認する。手動実行も可能。
4. 公開予定URL: https://family-mmyr.github.io/last-viewer/

workflowがテストとビルドを通してdistをデプロイする。baseは実際のリポジトリ名に合わせて
`/last-viewer/` に設定済み。リポジトリを改名する場合は vite.config.ts も更新する。
main以外を既定ブランチにする場合はworkflowのトリガーも更新する。
公開実行・実機確認の状況は [検証記録](docs/verification.md) を参照。

[仕様](docs/specification.md) / [開発ルール](AGENTS.md)
