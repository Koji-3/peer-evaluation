const express = require('express');
const router = express.Router();
const {createUser, getUserByAuth0Id, getUserById} = require('../models/user')

/* auth0 jwt config */
const { auth } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG
});

/* router */
// マイページでユーザー情報を取得する用
router.get('/:id', async(req, res) => {
  const user = await getUserById(req.params.id)
  if(user) {
    res.json({user});                                     
  } else {
    res.json({user: null})
  }
});

// Auth0からのコールバック時にAuth0のidからuserIdを取得する用
router.get('/auth/:id', checkJwt,  async(req, res) => {
  const user = await getUserByAuth0Id(req.params.id)
  if(user) {
    res.json({user});                                     
  } else {
    res.json({user: null})
  }
});

router.post('/signup', checkJwt, async(req, res) => {
  const user = await createUser(req.body.user)
  res.json({user});
});

module.exports = router;