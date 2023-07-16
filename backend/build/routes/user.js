"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const user_1 = require("../models/user");
const auth0_1 = require("../models/auth0");
/* auth0 jwt config */
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.AUTH0_API_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
});
/* router */
const router = express_1.default.Router();
// Auth0からのコールバック時にAuth0のidからuserIdを取得する
router.get('/auth/:auth0id', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_1.getUserByAuth0Id)(req.params.auth0id);
    if (user) {
        res.json({ user });
    }
    else {
        res.json({ user: null });
    }
}));
// 新規登録
router.post('/signup/:auth0id', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // auth0の名前も変更する
    const [user] = yield Promise.all([(0, user_1.createUser)(req.body.user, req.params.auth0id), (0, auth0_1.updateName)(req.params.auth0id, req.body.user.name)]);
    res.json({ user });
}));
// ユーザーTOPでユーザー情報を取得する
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, user_1.getUserById)(req.params.id);
    if (user) {
        res.json({ user });
    }
    else {
        res.json({ user: null });
    }
}));
// ユーザー情報変更
router.put('/update/:auth0id', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // auth0の名前も変更する
    const [user] = yield Promise.all([(0, user_1.updateUser)(req.params.auth0id, req.body.user), (0, auth0_1.updateName)(req.params.auth0id, req.body.user.name)]);
    if (user) {
        res.json({ user });
    }
    else {
        res.json({ user: null });
    }
}));
// メールアドレス変更
router.put('/update-email/:auth0id', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, auth0_1.updateEmail)(req.params.auth0id, req.body.email);
    }
    catch (e) {
        res.json({ updateEmail: false });
    }
    res.json({ updateEmail: true });
}));
// 退会
router.delete('/:auth0id', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Promise.all([(0, user_1.deleteUser)(req.params.auth0id), (0, auth0_1.deleteUser)(req.params.auth0id)])
        .then(() => {
        res.json({ deleteUser: true });
    })
        .catch(() => {
        res.json({ deleteUser: false });
    });
}));
exports.default = router;
