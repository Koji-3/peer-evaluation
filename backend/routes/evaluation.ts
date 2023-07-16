import express from 'express'
import { createEvaluation, getAllEvaluations, getPublishedEvaluations, updateEvaluation } from '../models/evaluation'
import { auth } from 'express-oauth2-jwt-bearer'

/* auth0 jwt config */
const checkJwt = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
})

const router = express.Router()

/* router */
// 評価を投稿する
router.post('/:evaluateeId', async (req, res) => {
  const evaluation = await createEvaluation(req.body.evaluation, req.params.evaluateeId)
  if (evaluation) {
    res.json({ evaluation })
  } else {
    res.json({ evaluation: null })
  }
})

// 評価一覧を取得する(未ログイン or 他のユーザー)
router.get('/:evaluateeId', async (req, res) => {
  const evaluations = await getPublishedEvaluations(req.params.evaluateeId)
  if (evaluations) {
    res.json({ evaluations })
  } else {
    res.json({ evaluations: null })
  }
})

// 評価を公開する
router.put('/publish/:evaluationId', checkJwt, async (req, res) => {
  const result = await updateEvaluation({ evaluationId: req.params.evaluationId, isPublished: true })
  res.json(result)
})

// 評価を非公開にする
router.put('/unpublish/:evaluationId', checkJwt, async (req, res) => {
  const result = await updateEvaluation({ evaluationId: req.params.evaluationId, isPublished: false })
  res.json(result)
})

// 評価を削除する
router.delete('/:evaluationId', checkJwt, async (req, res) => {
  const result = await updateEvaluation({ evaluationId: req.params.evaluationId, isDeleted: true })
  res.json(result)
})

// 評価一覧を取得する(ユーザー自身)
router.get('/self/:evaluateeId', checkJwt, async (req, res) => {
  const evaluations = await getAllEvaluations(req.params.evaluateeId)
  if (evaluations) {
    res.json({ evaluations })
  } else {
    res.json({ evaluations: null })
  }
})

export default router
