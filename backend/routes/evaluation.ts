import express from 'express'
import AsyncLock from 'async-lock'
import { createEvaluation, getEvaluation, getEvaluations, updateEvaluation } from '../models/evaluation'
import { auth } from 'express-oauth2-jwt-bearer'
import { errorMessages } from '../const/errorMessages'

/* auth0 jwt config */
const checkJwt = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
})
const lock = new AsyncLock()
const LOCK_KEY = 'evaluation_lock_key'

const router = express.Router()

/* router */
// 紹介を投稿する
router.post('/:evaluateeId', async (req, res) => {
  console.log('投稿lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`)
  lock.acquire(
    `${LOCK_KEY}_${req.params.evaluateeId}`,
    async (done) => {
      console.log('投稿 start')
      try {
        const evaluation = await createEvaluation(req.body.evaluation, req.params.evaluateeId)
        done(undefined, evaluation)
      } catch (e) {
        done(e as Error, undefined)
      }
    },
    (e, result) => {
      console.log('投稿 finish')
      if (e) {
        console.error('error in route /evaluation/:evaluateeId:', e)
        return res.json({ evaluations: null, error: e.message })
      }
      return res.json({ evaluation: result })
    },
  )
})

// 紹介一覧を取得する(未ログイン or 他のユーザー)
router.get('/list/:evaluateeId', async (req, res) => {
  console.log('一覧取得lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`)
  lock.acquire(
    `${LOCK_KEY}_${req.params.evaluateeId}`,
    async (done) => {
      console.log('一覧取得 start')
      try {
        const evaluations = await getEvaluations(req.params.evaluateeId)
        done(undefined, evaluations)
      } catch (e) {
        done(e as Error, undefined)
      }
    },
    (e, result) => {
      console.log('一覧取得 finish')
      if (e) {
        console.error('error in route /evaluation/list/:evaluateeId:', e)
        return res.json({ evaluations: null, error: e.message })
      }
      return res.json({ evaluations: result })
    },
  )
})

// 紹介一覧を取得する(ユーザー自身)
router.get('/list/self/:evaluateeId', checkJwt, async (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ evaluations: null, error: errorMessages.evaluation.get })
    return
  }
  console.log('自分の一覧取得lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`)

  lock.acquire(
    `${LOCK_KEY}_${req.params.evaluateeId}`,
    async (done) => {
      console.log('自分の一覧取得 start')
      try {
        const evaluations = await getEvaluations(req.params.evaluateeId, auth0Id)
        done(undefined, evaluations)
      } catch (e) {
        done(e as Error, undefined)
      }
    },
    (e, result) => {
      console.log('自分の一覧取得 finish')
      if (e) {
        console.error('error in route /evaluation/list/self/:evaluateeId:', e)
        return res.json({ evaluations: null, error: e.message })
      }
      return res.json({ evaluations: result })
    },
  )
})

// 紹介を取得する(未ログイン or 他のユーザー)
router.get('/:evaluateeId/:evaluationId', async (req, res) => {
  console.log('詳細取得lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`)
  lock.acquire(
    `${LOCK_KEY}_${req.params.evaluateeId}`,
    async (done) => {
      console.log('詳細取得 start')
      try {
        const evaluation = await getEvaluation(req.params.evaluationId)
        done(undefined, evaluation)
      } catch (e) {
        done(e as Error, undefined)
      }
    },
    (e, result) => {
      console.log('詳細取得 finish')
      if (e) {
        console.error('error in route /evaluation/:evaluationId:', e)
        return res.json({ evaluation: null, error: e.message })
      }
      return res.json({ evaluation: result })
    },
  )
})

// 紹介を取得する(ユーザー自身)
router.get('/self/:evaluateeId/:evaluationId', checkJwt, async (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ evaluation: null, error: errorMessages.evaluation.get })
    return
  }
  console.log('自分の詳細取得lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`)
  lock.acquire(
    `${LOCK_KEY}_${req.params.evaluateeId}`,
    async (done) => {
      console.log('自分の詳細取得 start')
      try {
        const evaluation = await getEvaluation(req.params.evaluationId, auth0Id)
        done(undefined, evaluation)
      } catch (e) {
        done(e as Error, undefined)
      }
    },
    (e, result) => {
      console.log('自分の詳細取得 finish')
      if (e) {
        console.error('error in route /evaluation/self/:evaluationId:', e)
        return res.json({ evaluation: null, error: e.message })
      }
      return res.json({ evaluation: result })
    },
  )
})

// 紹介を公開する
router.put('/publish/:evaluateeId/:evaluationId', checkJwt, async (req, res) => {
  console.log('公開lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`)
  lock.acquire(
    `${LOCK_KEY}_${req.params.evaluateeId}`,
    async (done) => {
      console.log('公開 start')
      try {
        const result = await updateEvaluation({ evaluationId: req.params.evaluationId, isPublished: true })
        done(undefined, result)
      } catch (e) {
        done(e as Error, undefined)
      }
    },
    (e, result) => {
      console.log('公開 finish')
      if (e) {
        console.error('error in route /evaluation/publish/:evaluationId:', e)
        return res.json({ update: false, error: e.message })
      }
      return res.json(result)
    },
  )
})

// 紹介を非公開にする
router.put('/unpublish/:evaluateeId/:evaluationId', checkJwt, async (req, res) => {
  console.log('非公開lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`)
  lock.acquire(
    `${LOCK_KEY}_${req.params.evaluateeId}`,
    async (done) => {
      console.log('非公開 start')
      try {
        const result = await updateEvaluation({ evaluationId: req.params.evaluationId, isPublished: false })
        done(undefined, result)
      } catch (e) {
        done(e as Error, undefined)
      }
    },
    (e, result) => {
      console.log('非公開 finish')
      if (e) {
        console.error('error in route /evaluation/unpublish/:evaluationId:', e)
        return res.json({ update: false, error: e.message })
      }
      return res.json(result)
    },
  )
})

// 紹介を削除する
router.delete('/:evaluateeId/:evaluationId', checkJwt, async (req, res) => {
  console.log('削除lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`)
  lock.acquire(
    `${LOCK_KEY}_${req.params.evaluateeId}`,
    async (done) => {
      console.log('削除 start')
      try {
        const result = await updateEvaluation({ evaluationId: req.params.evaluationId, isDeleted: true })
        done(undefined, result)
      } catch (e) {
        done(e as Error, undefined)
      }
    },
    (e, result) => {
      console.log('削除 finish')
      if (e) {
        console.error('error in route /evaluation/:evaluationId:', e)
        return res.json({ update: false, error: e.message })
      }
      return res.json(result)
    },
  )
})

export default router
