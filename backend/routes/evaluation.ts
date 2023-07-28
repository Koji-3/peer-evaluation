import express from 'express'
import { createEvaluation, getEvaluation, getEvaluations, updateEvaluation } from '../models/evaluation'
import { auth } from 'express-oauth2-jwt-bearer'
import { errorMessages } from '../const/errorMessages'

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
  try {
    const evaluation = await createEvaluation(req.body.evaluation, req.params.evaluateeId)
    res.json({ evaluation })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ evaluation: null, error: e.message })
      console.error('error in route /evaluation/:evaluateeId:', e)
    }
  }
})

// 評価一覧を取得する(未ログイン or 他のユーザー)
router.get('/list/:evaluateeId', async (req, res) => {
  try {
    const evaluations = await getEvaluations(req.params.evaluateeId)
    res.json({ evaluations })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ evaluations: null, error: e.message })
      console.error('error in route /evaluation/list/:evaluateeId:', e)
    }
  }
})

// 評価一覧を取得する(ユーザー自身)
router.get('/list/self/:evaluateeId', checkJwt, async (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ evaluations: null, error: errorMessages.evaluation.get })
    return
  }
  try {
    const evaluations = await getEvaluations(req.params.evaluateeId, auth0Id)
    res.json({ evaluations })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ evaluations: null, error: e.message })
      console.error('error in route /evaluation/list/self/:evaluateeId:', e)
    }
  }
})

// 評価を取得する(未ログイン or 他のユーザー)
router.get('/:evaluationId', async (req, res) => {
  try {
    const evaluation = await getEvaluation(req.params.evaluationId)
    res.json({ evaluation })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ evaluation: null, error: e.message })
      console.error('error in route /evaluation/:evaluationId:', e)
    }
  }
})

// 評価を取得する(ユーザー自身)
router.get('/self/:evaluationId', checkJwt, async (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ evaluation: null, error: errorMessages.evaluation.get })
    return
  }

  try {
    const evaluation = await getEvaluation(req.params.evaluationId, auth0Id)
    res.json({ evaluation })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ evaluation: null, error: e.message })
      console.error('error in route /evaluation/self/:evaluationId:', e)
    }
  }
})

// 評価を公開する
router.put('/publish/:evaluationId', checkJwt, async (req, res) => {
  try {
    const result = await updateEvaluation({ evaluationId: req.params.evaluationId, isPublished: true })
    res.json(result)
  } catch (e) {
    if (e instanceof Error) {
      res.json({ update: false, error: e.message })
      console.error('error in route /evaluation/publish/:evaluationId:', e)
    }
  }
})

// 評価を非公開にする
router.put('/unpublish/:evaluationId', checkJwt, async (req, res) => {
  try {
    const result = await updateEvaluation({ evaluationId: req.params.evaluationId, isPublished: false })
    res.json(result)
  } catch (e) {
    if (e instanceof Error) {
      res.json({ update: false, error: e.message })
      console.error('error in route /evaluation/unpublish/:evaluationId:', e)
    }
  }
})

// 評価を削除する
router.delete('/:evaluationId', checkJwt, async (req, res) => {
  try {
    const result = await updateEvaluation({ evaluationId: req.params.evaluationId, isDeleted: true })
    res.json(result)
  } catch (e) {
    if (e instanceof Error) {
      res.json({ update: false, error: e.message })
      console.error('error in route /evaluation/:evaluationId:', e)
    }
  }
})

export default router
