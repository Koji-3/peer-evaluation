import express from 'express'
import { auth } from 'express-oauth2-jwt-bearer'
import { createUser, getUserByAuth0Id, getUserById, updateUser, deleteUser } from '../models/user'
import { updateName as updateAuth0Name, updateEmail as updateAuth0Email, deleteUser as deleteAuth0User } from '../models/auth0'

/* auth0 jwt config */
const checkJwt = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
})

/* router */
const router = express.Router()

// ユーザーTOPでユーザー情報を取得する
router.get('/:id', async (req, res) => {
  const user = await getUserById(req.params.id)
  if (user) {
    res.json({ user })
  } else {
    res.json({ user: null })
  }
})

// Auth0からのコールバック時にAuth0のidからuserIdを取得する
router.get('/auth/:auth0id', checkJwt, async (req, res) => {
  const user = await getUserByAuth0Id(req.params.auth0id)
  if (user) {
    res.json({ user })
  } else {
    res.json({ user: null })
  }
})

// 新規登録
router.post('/signup/:auth0id', checkJwt, async (req, res) => {
  // auth0の名前も変更する
  const [user] = await Promise.all([createUser(req.body.user), updateAuth0Name(req.params.auth0id, req.body.user.name)])
  res.json({ user })
})

// ユーザー情報変更
router.put('/update/:auth0id', checkJwt, async (req, res) => {
  // auth0の名前も変更する
  const [user] = await Promise.all([updateUser(req.params.auth0id, req.body.user), updateAuth0Name(req.params.auth0id, req.body.user.name)])
  if (user) {
    res.json({ user })
  } else {
    res.json({ user: null })
  }
})

// メールアドレス変更
router.put('/update-email/:auth0id', checkJwt, async (req, res) => {
  try {
    await updateAuth0Email(req.params.auth0id, req.body.email)
  } catch (e) {
    res.json({ updateEmail: false })
  }
  res.json({ updateEmail: true })
})

// 退会
router.delete('/:auth0id', checkJwt, async (req, res) => {
  Promise.all([deleteUser(req.params.auth0id), deleteAuth0User(req.params.auth0id)])
    .then(() => {
      res.json({ deleteUser: true })
    })
    .catch(() => {
      res.json({ deleteUser: false })
    })
})

export default router
