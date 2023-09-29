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
const async_lock_1 = __importDefault(require("async-lock"));
const evaluation_1 = require("../models/evaluation");
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const errorMessages_1 = require("../const/errorMessages");
/* auth0 jwt config */
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.AUTH0_API_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
});
const lock = new async_lock_1.default();
const LOCK_KEY = 'evaluation_lock_key';
const router = express_1.default.Router();
/* router */
// 紹介を投稿する
router.post('/:evaluateeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('投稿lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`);
    lock.acquire(`${LOCK_KEY}_${req.params.evaluateeId}`, (done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('投稿 start');
        try {
            const evaluation = yield (0, evaluation_1.createEvaluation)(req.body.evaluation, req.params.evaluateeId);
            done(undefined, evaluation);
        }
        catch (e) {
            done(e, undefined);
        }
    }), (e, result) => {
        console.log('投稿 finish');
        if (e) {
            console.error('error in route /evaluation/:evaluateeId:', e);
            return res.json({ evaluations: null, error: e.message });
        }
        return res.json({ evaluation: result });
    });
}));
// 紹介一覧を取得する(未ログイン or 他のユーザー)
router.get('/list/:evaluateeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('一覧取得lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`);
    lock.acquire(`${LOCK_KEY}_${req.params.evaluateeId}`, (done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('一覧取得 start');
        try {
            const evaluations = yield (0, evaluation_1.getEvaluations)(req.params.evaluateeId);
            done(undefined, evaluations);
        }
        catch (e) {
            done(e, undefined);
        }
    }), (e, result) => {
        console.log('一覧取得 finish');
        if (e) {
            console.error('error in route /evaluation/list/:evaluateeId:', e);
            return res.json({ evaluations: null, error: e.message });
        }
        return res.json({ evaluations: result });
    });
}));
// 紹介一覧を取得する(ユーザー自身)
router.get('/list/self/:evaluateeId', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const auth0Id = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.payload.sub;
    if (!auth0Id) {
        res.json({ evaluations: null, error: errorMessages_1.errorMessages.evaluation.get });
        return;
    }
    console.log('自分の一覧取得lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`);
    lock.acquire(`${LOCK_KEY}_${req.params.evaluateeId}`, (done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('自分の一覧取得 start');
        try {
            const evaluations = yield (0, evaluation_1.getEvaluations)(req.params.evaluateeId, auth0Id);
            done(undefined, evaluations);
        }
        catch (e) {
            done(e, undefined);
        }
    }), (e, result) => {
        console.log('自分の一覧取得 finish');
        if (e) {
            console.error('error in route /evaluation/list/self/:evaluateeId:', e);
            return res.json({ evaluations: null, error: e.message });
        }
        return res.json({ evaluations: result });
    });
}));
// 紹介を取得する(未ログイン or 他のユーザー)
router.get('/:evaluateeId/:evaluationId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('詳細取得lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`);
    lock.acquire(`${LOCK_KEY}_${req.params.evaluateeId}`, (done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('詳細取得 start');
        try {
            const evaluation = yield (0, evaluation_1.getEvaluation)(req.params.evaluationId);
            done(undefined, evaluation);
        }
        catch (e) {
            done(e, undefined);
        }
    }), (e, result) => {
        console.log('詳細取得 finish');
        if (e) {
            console.error('error in route /evaluation/:evaluationId:', e);
            return res.json({ evaluation: null, error: e.message });
        }
        return res.json({ evaluation: result });
    });
}));
// 紹介を取得する(ユーザー自身)
router.get('/self/:evaluateeId/:evaluationId', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const auth0Id = (_b = req.auth) === null || _b === void 0 ? void 0 : _b.payload.sub;
    if (!auth0Id) {
        res.json({ evaluation: null, error: errorMessages_1.errorMessages.evaluation.get });
        return;
    }
    console.log('自分の詳細取得lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`);
    lock.acquire(`${LOCK_KEY}_${req.params.evaluateeId}`, (done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('自分の詳細取得 start');
        try {
            const evaluation = yield (0, evaluation_1.getEvaluation)(req.params.evaluationId, auth0Id);
            done(undefined, evaluation);
        }
        catch (e) {
            done(e, undefined);
        }
    }), (e, result) => {
        console.log('自分の詳細取得 finish');
        if (e) {
            console.error('error in route /evaluation/self/:evaluationId:', e);
            return res.json({ evaluation: null, error: e.message });
        }
        return res.json({ evaluation: result });
    });
}));
// 紹介を公開する
router.put('/publish/:evaluateeId/:evaluationId', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('公開lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`);
    lock.acquire(`${LOCK_KEY}_${req.params.evaluateeId}`, (done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('公開 start');
        try {
            const result = yield (0, evaluation_1.updateEvaluation)({ evaluationId: req.params.evaluationId, isPublished: true });
            done(undefined, result);
        }
        catch (e) {
            done(e, undefined);
        }
    }), (e, result) => {
        console.log('公開 finish');
        if (e) {
            console.error('error in route /evaluation/publish/:evaluationId:', e);
            return res.json({ update: false, error: e.message });
        }
        return res.json(result);
    });
}));
// 紹介を非公開にする
router.put('/unpublish/:evaluateeId/:evaluationId', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('非公開lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`);
    lock.acquire(`${LOCK_KEY}_${req.params.evaluateeId}`, (done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('非公開 start');
        try {
            const result = yield (0, evaluation_1.updateEvaluation)({ evaluationId: req.params.evaluationId, isPublished: false });
            done(undefined, result);
        }
        catch (e) {
            done(e, undefined);
        }
    }), (e, result) => {
        console.log('非公開 finish');
        if (e) {
            console.error('error in route /evaluation/unpublish/:evaluationId:', e);
            return res.json({ update: false, error: e.message });
        }
        return res.json(result);
    });
}));
// 紹介を削除する
router.delete('/:evaluateeId/:evaluationId', checkJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('削除lock key: ', `${LOCK_KEY}_${req.params.evaluateeId}`);
    lock.acquire(`${LOCK_KEY}_${req.params.evaluateeId}`, (done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('削除 start');
        try {
            const result = yield (0, evaluation_1.updateEvaluation)({ evaluationId: req.params.evaluationId, isDeleted: true });
            done(undefined, result);
        }
        catch (e) {
            done(e, undefined);
        }
    }), (e, result) => {
        console.log('削除 finish');
        if (e) {
            console.error('error in route /evaluation/:evaluationId:', e);
            return res.json({ update: false, error: e.message });
        }
        return res.json(result);
    });
}));
exports.default = router;
