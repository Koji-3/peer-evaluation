import express from 'express'
import { auth } from 'express-oauth2-jwt-bearer'
import { createUser, getUserByAuth0Id, getUserById, updateUser, deleteUser } from '../models/user'
import { updateName as updateAuth0Name, updateEmail as updateAuth0Email, deleteUser as deleteAuth0User } from '../models/auth0'
import { errorMessages } from '../const/errorMessages'

/* auth0 jwt config */
const checkJwt = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
})

/* router */
const router = express.Router()

// Auth0からのコールバック時にAuth0のidからuserIdを取得する
router.get('/auth0', checkJwt, async (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ user: null, error: errorMessages.user.create })
    return
  }
  try {
    const user = await getUserByAuth0Id(auth0Id)
    res.json({ user })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ user: null, error: e.message })
      console.error('error in route /user/auth0: ', e)
    }
  }
})

// 新規登録
router.post('/signup', checkJwt, async (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ user: null, error: errorMessages.user.create })
    return
  }
  const isGoogleIntegration = auth0Id.startsWith('google-oauth2')
  try {
    const user = await createUser(req.body.user, auth0Id)
    res.json({ user })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ user: null, error: e.message })
      console.error('create user error in route /user/signup:', e)
    }
  }
  if (!isGoogleIntegration) {
    try {
      // auth0の名前も変更する
      updateAuth0Name(auth0Id, req.body.user.name)
    } catch (e) {
      if (e instanceof Error) {
        res.json({ user: null, error: e.message })
        console.error('updateAuth0Name user error in route /user/signup:', e)
      }
    }
  }
})

// ユーザーTOPでユーザー情報を取得する
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id)
    res.json({ user })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ user: null, error: e.message })
      console.error('error in route /user/:id:', e)
    }
  }
})

// ユーザー情報変更
router.put('/update', checkJwt, async (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ user: null, error: errorMessages.user.update })
    return
  }
  const isGoogleIntegration = auth0Id.startsWith('google-oauth2')
  if (isGoogleIntegration) {
    try {
      const user = await updateUser(auth0Id, req.body.newUser)
      res.json({ user })
    } catch (e) {
      if (e instanceof Error) {
        res.json({ user: null, error: e.message })
        console.error('updateUser error in route /user/update:', e)
      }
    }
  } else {
    try {
      const user = await updateUser(auth0Id, req.body.newUser)
      // auth0の名前も変更する
      updateAuth0Name(auth0Id, req.body.newUser.name)
      res.json({ user })
    } catch (e) {
      if (e instanceof Error) {
        res.json({ user: null, error: e.message })
        console.error('updateAuth0Name error in route /user/update:', e)
      }
    }
  }
})

// メールアドレス変更
router.put('/update-email', checkJwt, (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ updateEmail: false, message: errorMessages.user.updateEmail })
    return
  }
  try {
    updateAuth0Email(auth0Id, req.body.email)
    res.json({ updateEmail: true })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ updateEmail: false, error: e.message })
    }
  }
})

// 退会
router.delete('/delete', checkJwt, async (req, res) => {
  const auth0Id = req.auth?.payload.sub
  if (!auth0Id) {
    res.json({ deleteUser: false, message: errorMessages.user.delete })
    return
  }
  try {
    await deleteUser(auth0Id)
    deleteAuth0User(auth0Id)
    res.json({ deleteUser: true })
  } catch (e) {
    if (e instanceof Error) {
      res.json({ deleteUser: false, error: e.message })
      console.error('error in route /user/delete:', e)
    }
  }
})

export default router
