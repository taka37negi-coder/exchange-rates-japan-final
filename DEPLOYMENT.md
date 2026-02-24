# Web版デプロイメントガイド

このアプリをWeb版として恒久的に公開する方法を説明します。

## 方法1: Vercel (推奨・最も簡単)

### 必要なもの
- GitHubアカウント(無料)
- Vercelアカウント(無料)

### 手順

#### 1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 「New repository」をクリック
3. リポジトリ名を入力(例: `exchange-rates-japan`)
4. 「Create repository」をクリック

#### 2. コードをGitHubにプッシュ

プロジェクトディレクトリで以下のコマンドを実行:

```bash
cd /home/ubuntu/exchange-rates-japan
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/exchange-rates-japan.git
git push -u origin main
```

#### 3. Vercelでデプロイ

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」→「Continue with GitHub」でGitHubアカウントでログイン
3. 「Import Project」をクリック
4. GitHubから`exchange-rates-japan`リポジトリを選択
5. 以下の設定を確認:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `pnpm install`
6. 「Deploy」をクリック

#### 4. デプロイ完了

数分後、以下のようなURLが発行されます:
```
https://exchange-rates-japan.vercel.app
```

このURLは恒久的に利用可能で、コードを更新してGitHubにプッシュすると自動的に再デプロイされます。

---

## 方法2: Netlify

### 手順

1. [Netlify](https://netlify.com)にアクセス
2. 「Sign Up」→GitHubアカウントでログイン
3. 「Add new site」→「Import an existing project」
4. GitHubリポジトリを選択
5. ビルド設定:
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist/public`
6. 「Deploy site」をクリック

---

## 方法3: GitHub Pages

### 手順

1. プロジェクトに`.github/workflows/deploy.yml`を作成:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v3
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

2. GitHubリポジトリの「Settings」→「Pages」
3. Source: 「Deploy from a branch」
4. Branch: 「gh-pages」を選択
5. 「Save」をクリック

公開URL: `https://あなたのユーザー名.github.io/exchange-rates-japan/`

---

## iPadでの利用方法

### ホーム画面に追加

1. SafariでデプロイされたURLを開く
2. 共有ボタン(□↑)をタップ
3. 「ホーム画面に追加」を選択
4. 名前を確認して「追加」をタップ

これで、ホーム画面からアプリのように起動できます。

### 店頭設置用の設定

#### ガイドアクセスの有効化(アプリから抜けられないようにする)

1. 「設定」→「アクセシビリティ」→「ガイドアクセス」
2. ガイドアクセスをオン
3. パスコードを設定
4. アプリを開いた状態でホームボタンを3回押す(またはサイドボタンを3回押す)
5. 「開始」をタップ

#### 自動ロックをオフ

1. 「設定」→「画面表示と明るさ」
2. 「自動ロック」→「なし」

#### 画面の明るさ調整

1. 「設定」→「画面表示と明るさ」
2. 明るさを適切なレベルに調整
3. 「True Tone」と「Night Shift」をオフにすることをお勧めします

---

## トラブルシューティング

### ビルドエラーが発生する場合

package.jsonに以下のスクリプトが正しく設定されているか確認:

```json
{
  "scripts": {
    "build": "esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  }
}
```

### 為替APIが動作しない場合

ExchangeRate-APIは無料プランでも動作しますが、レート制限があります。
本番環境では、より信頼性の高い有料プランの利用を検討してください。

---

## サポート

ご不明な点がございましたら、お気軽にお問い合わせください。
