const express = require('express');
const router = express.Router();
const { createUser, getUserByAuth0Id, getUserById, updateUser } = require('../models/user')
const { updateEmail } = require('../models/auth0')

/* auth0 jwt config */
const { auth } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG
});

/* router */
// マイページでユーザー情報を取得する
router.get('/:id', async(req, res) => {
  const user = await getUserById(req.params.id)
  if(user) {
    res.json({user});                                     
  } else {
    res.json({user: null})
  }
});

// Auth0からのコールバック時にAuth0のidからuserIdを取得する
router.get('/auth/:auth0id', checkJwt,  async(req, res) => {
  const user = await getUserByAuth0Id(req.params.auth0id)
  if(user) {
    res.json({user});                                     
  } else {
    res.json({user: null})
  }
});

// 新規登録
router.post('/signup', checkJwt, async(req, res) => {
  const user = await createUser(req.body.user)
  res.json({user});
});

// ユーザー情報変更(Auth0以外)
router.put('/update/:id', checkJwt, async(req, res) => {
  const user = await updateUser(req.params.id, req.body.user)
  if(user) {
    res.json({user});                                     
  } else {
    res.json({user: null})
  }
});


// メールアドレス変更
router.put('/update-email/:auth0id', checkJwt, async(req, res) => {
  try {
    await updateEmail(req.params.auth0id, req.body.email)
  } catch (e) {
    res.json({updateEmail: false})
  }
  res.json({updateEmail: true});
});

module.exports = router;