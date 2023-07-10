const express = require('express');
const router = express.Router();
const { uploadIcon, getIcon } = require('../models/s3')
const multer = require('multer');

const upload = multer();

/* auth0 jwt config */
const { auth } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
  audience: process.env.AUTH0_API_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG
});

/* router */
// s3にアイコンをアップロードする
router.post('/upload-icon/:auth0id', checkJwt, upload.single('icon_file'), async(req, res) => {
  try {
    const result = await uploadIcon(req.file, req.params.auth0id)
    if(!!result) {
      res.json({uploadIcon: true});
    }
  } catch (e) {
    // TODO: エラー処理
    res.json({uploadIcon: false})
  }
});

// s3からアイコンを取得する
router.get('/get-icon', checkJwt,  async(req, res) => {
  console.log(req.query.key)
  const icon = await getIcon(req.query.key)
  res.send({file: icon.Body})
});

module.exports = router;