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
const errorMessages_1 = require("../const/errorMessages");
/* auth0 jwt config */
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.AUTH0_API_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
});
/* router */
const router = express_1.default.Router();
// Auth0からのコールバック時にAuth0のidからuserIdを取得する
router.get('/auth0', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const auth0Id = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.payload.sub;
    if (!auth0Id) {
        res.json({ user: null, error: errorMessages_1.errorMessages.user.create });
        return;
    }
    try {
        const user = yield (0, user_1.getUserByAuth0Id)(auth0Id);
        res.json({ user });
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ user: null, error: e.message });
            console.error('error in route /user/auth0: ', e);
        }
    }
}));
// 新規登録
router.post('/signup', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const auth0Id = (_b = req.auth) === null || _b === void 0 ? void 0 : _b.payload.sub;
    if (!auth0Id) {
        res.json({ user: null, error: errorMessages_1.errorMessages.user.create });
        return;
    }
    const isGoogleIntegration = auth0Id.startsWith('google-oauth2');
    try {
        const user = yield (0, user_1.createUser)(req.body.user, auth0Id);
        res.json({ user });
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ user: null, error: e.message });
            console.error('create user error in route /user/signup:', e);
        }
    }
    if (!isGoogleIntegration) {
        try {
            // auth0の名前も変更する
            (0, auth0_1.updateName)(auth0Id, req.body.user.name);
        }
        catch (e) {
            if (e instanceof Error) {
                res.json({ user: null, error: e.message });
                console.error('updateAuth0Name user error in route /user/signup:', e);
            }
        }
    }
}));
// ユーザーTOPでユーザー情報を取得する
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_1.getUserById)(req.params.id);
        res.json({ user });
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ user: null, error: e.message });
            console.error('error in route /user/:id:', e);
        }
    }
}));
// ユーザー情報変更
router.put('/update', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const auth0Id = (_c = req.auth) === null || _c === void 0 ? void 0 : _c.payload.sub;
    if (!auth0Id) {
        res.json({ user: null, error: errorMessages_1.errorMessages.user.update });
        return;
    }
    const isGoogleIntegration = auth0Id.startsWith('google-oauth2');
    if (isGoogleIntegration) {
        try {
            const user = yield (0, user_1.updateUser)(auth0Id, req.body.newUser);
            res.json({ user });
        }
        catch (e) {
            if (e instanceof Error) {
                res.json({ user: null, error: e.message });
                console.error('updateUser error in route /user/update:', e);
            }
        }
    }
    else {
        try {
            const user = yield (0, user_1.updateUser)(auth0Id, req.body.newUser);
            // auth0の名前も変更する
            (0, auth0_1.updateName)(auth0Id, req.body.newUser.name);
            res.json({ user });
        }
        catch (e) {
            if (e instanceof Error) {
                res.json({ user: null, error: e.message });
                console.error('updateAuth0Name error in route /user/update:', e);
            }
        }
    }
}));
// メールアドレス変更
router.put('/update-email', checkJwt, (req, res) => {
    var _a;
    const auth0Id = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.payload.sub;
    if (!auth0Id) {
        res.json({ updateEmail: false, message: errorMessages_1.errorMessages.user.updateEmail });
        return;
    }
    try {
        (0, auth0_1.updateEmail)(auth0Id, req.body.email);
        res.json({ updateEmail: true });
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ updateEmail: false, error: e.message });
        }
    }
});
// 認証メール再送
router.post('/resend-email-verification', checkJwt, (req, res) => {
    var _a;
    const auth0Id = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.payload.sub;
    if (!auth0Id) {
        res.json({ resendEmailVerification: false, message: errorMessages_1.errorMessages.user.resendEmailVerification });
        return;
    }
    try {
        (0, auth0_1.sendEmailVerification)(auth0Id, 'resend');
        res.json({ resendEmailVerification: true });
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ resendEmailVerification: false, error: e.message });
        }
    }
});
// 退会
router.delete('/delete', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const auth0Id = (_d = req.auth) === null || _d === void 0 ? void 0 : _d.payload.sub;
    if (!auth0Id) {
        res.json({ deleteUser: false, message: errorMessages_1.errorMessages.user.delete });
        return;
    }
    try {
        yield (0, user_1.deleteUser)(auth0Id);
        (0, auth0_1.deleteUser)(auth0Id);
        res.json({ deleteUser: true });
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ deleteUser: false, error: e.message });
            console.error('error in route /user/delete:', e);
        }
    }
}));
exports.default = router;
