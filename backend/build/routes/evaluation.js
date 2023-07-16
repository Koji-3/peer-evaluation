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
const evaluation_1 = require("../models/evaluation");
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
/* auth0 jwt config */
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.AUTH0_API_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
});
const router = express_1.default.Router();
/* router */
// 評価を投稿する
router.post('/:evaluateeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluation = yield (0, evaluation_1.createEvaluation)(req.body.evaluation, req.params.evaluateeId);
    if (evaluation) {
        res.json({ evaluation });
    }
    else {
        res.json({ evaluation: null });
    }
}));
// 評価一覧を取得する(未ログイン or 他のユーザー)
router.get('/:evaluateeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluations = yield (0, evaluation_1.getPublishedEvaluations)(req.params.evaluateeId);
    if (evaluations) {
        res.json({ evaluations });
    }
    else {
        res.json({ evaluations: null });
    }
}));
// 評価を公開する
router.put('/publish/:evaluationId', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, evaluation_1.updateEvaluation)({ evaluationId: req.params.evaluationId, isPublished: true });
    res.json(result);
}));
// 評価を非公開にする
router.put('/unpublish/:evaluationId', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, evaluation_1.updateEvaluation)({ evaluationId: req.params.evaluationId, isPublished: false });
    res.json(result);
}));
// 評価を削除する
router.delete('/:evaluationId', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, evaluation_1.updateEvaluation)({ evaluationId: req.params.evaluationId, isDeleted: true });
    res.json(result);
}));
// 評価一覧を取得する(ユーザー自身)
router.get('/self/:evaluateeId', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluations = yield (0, evaluation_1.getAllEvaluations)(req.params.evaluateeId);
    if (evaluations) {
        res.json({ evaluations });
    }
    else {
        res.json({ evaluations: null });
    }
}));
exports.default = router;
