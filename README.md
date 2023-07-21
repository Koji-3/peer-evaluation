# 他己評価SNS
他己評価SNSは●●●なSNSです。

# フロントエンド
## ローカル
http://localhost:3000  
.envファイルを作成

```
$ yarn
$ yarn start
```
## デプロイ
Vercelを使用。  
https://peer-evaluation.vercel.app/
```
$ yarn pre-push
```
→mainブランチにpushで自動デプロイ

# バックエンド
## ローカル
1. .envファイルを作成
2. cyclic.sh用のAWS変数を適切に設定
3. 
```
$ yarn
$ yarn start.ts
```

## デプロイ
cyclic.shを使用。
```
$ yarn pre-push
$ yarn tsc
```
→mainブランチにpushで自動デプロイ
