# GitDash

GitHubイシューの分析ダッシュボードです。時系列メトリクス分析とラベルベースのフィルタリング機能を提供します。

## 機能

- **時系列分析**: 今日、今週、今月、先月、先々月のイシュー作成・クローズ数の比較
- **ラベルフィルタリング**: 特定のラベルでイシューを絞り込み分析
- **視覚化**: チャート表示による期間比較とラベル別トップ5分析
- **リアルタイム更新**: GitHub APIからの最新データ表示

## 技術スタック

- **フレームワーク**: Next.js 15.3.4
- **言語**: TypeScript
- **UI**: Tailwind CSS
- **データ取得**: GitHub API
- **状態管理**: React Hooks

## セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## API設定

GitHub APIを使用するため、適切なAPI設定が必要です：

- `src/lib/github-api.ts` でAPIエンドポイントとトークン設定
- API制限に注意して使用してください

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   └── page.tsx        # メインページ
├── components/         # Reactコンポーネント
│   ├── Dashboard.tsx   # メインダッシュボード
│   ├── AnalyticsChart.tsx
│   ├── MetricCard.tsx
│   └── IssueCard.tsx
├── hooks/              # カスタムフック
└── lib/                # ユーティリティ
```

## 利用可能なスクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバー起動
- `npm run lint` - ESLintチェック
