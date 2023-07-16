import express from 'express'
import multer from 'multer'
import { auth } from 'express-oauth2-jwt-bearer'

import { uploadIcon, getIcon } from '../models/s3'

const router = express.Router()
const upload = multer()

/* auth0 jwt config */
const checkJwt = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
})

/* router */
// s3にゲストアイコンをアップロードする(未登録の評価者用)
router.post('/upload-icon/evaluator/:evaluatorName', upload.single('icon_file'), async (req, res) => {
  try {
    if (!req.file) {
      res.json({ uploadIcon: false })
      return
    }
    const result = await uploadIcon(req.file, null, req.params.evaluatorName)
    if (!!result) {
      res.json({ uploadIcon: true })
    }
  } catch (e) {
    // TODO: エラー処理
    res.json({ uploadIcon: false })
  }
})

// s3にユーザーアイコンをアップロードする
router.post('/upload-icon/user/:auth0id', checkJwt, upload.single('icon_file'), async (req, res) => {
  try {
    if (!req.file) {
      res.json({ uploadIcon: false })
      return
    }
    const result = await uploadIcon(req.file, req.params.auth0id, null)
    if (!!result) {
      res.json({ uploadIcon: true })
    }
  } catch (e) {
    // TODO: エラー処理
    res.json({ uploadIcon: false })
  }
})

// s3からアイコンを取得する
router.get('/get-icon', checkJwt, async (req, res) => {
  if (!req.query.key) {
    res.json({ file: false })
    return
  }
  const icon = await getIcon(req.query.key as string)
  res.send({ file: icon.Body })
})

export default router
