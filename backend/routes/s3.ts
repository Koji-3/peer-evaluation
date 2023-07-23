import express from 'express'
import multer from 'multer'
import { auth } from 'express-oauth2-jwt-bearer'

import { uploadIcon, getIcon } from '../models/s3'
import { errorMessages } from '../const/errorMessages'

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
      res.json({ key: null, error: errorMessages.icon.create })
      return
    }
    const key = await uploadIcon(req.file, null, req.params.evaluatorName)
    res.json({ key })
  } catch (e: any) {
    res.json({ key: null, error: e.message })
    console.error('error in route /icon/upload-icon/evaluator/:evaluatorName:', e)
  }
})

// s3にユーザーアイコンをアップロードする
router.post('/upload-icon/user', checkJwt, upload.single('icon_file'), async (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ key: null, error: errorMessages.icon.create })
    return
  }
  try {
    if (!req.file) {
      res.json({ key: null, error: errorMessages.icon.create })
      return
    }
    const key = await uploadIcon(req.file, auth0Id, null)
    res.json({ key })
  } catch (e: any) {
    res.json({ key: null, error: e.message })
    console.error('error in route /icon/upload-icon/user:', e)
  }
})

// s3からアイコンを取得する
router.get('/get-icon', async (req, res) => {
  if (!req.query.key) {
    res.json({ imageSrc: null })
    return
  }
  try {
    const icon = await getIcon(req.query.key as string)
    const base64Image = Buffer.from(icon.Body as Buffer).toString('base64')
    const imageSrc = `data:image/jpeg;base64,${base64Image}`
    res.send({ imageSrc })
  } catch (e: any) {
    res.json({ imageSrc: null, error: e.message })
    console.error('error in route /icon/get-icon:', e)
  }
})

export default router
