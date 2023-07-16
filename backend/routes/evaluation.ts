import express from 'express'
import { createEvaluation } from '../models/evaluation'
// import {auth} from'express-oauth2-jwt-bearer'

/* auth0 jwt config */
// const checkJwt = auth({
//   audience: process.env.AUTH0_API_AUDIENCE,
//   issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//   tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG
// });

const router = express.Router()
/* router */
// ユーザーTOPでユーザー情報を取得する
router.post('/:evaluateeId', async (req, res) => {
  const evaluation = await createEvaluation(req.body.evaluation)
  if (evaluation) {
    res.json({ evaluation })
  } else {
    res.json({ evaluation: null })
  }
})

export default router
