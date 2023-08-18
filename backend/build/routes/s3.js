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
const multer_1 = __importDefault(require("multer"));
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const s3_1 = require("../models/s3");
const errorMessages_1 = require("../const/errorMessages");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
/* auth0 jwt config */
const checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: process.env.AUTH0_API_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG,
});
/* router */
// s3にゲストアイコンをアップロードする(未登録の評価者用)
router.post('/upload-icon/evaluator/:evaluatorName', upload.single('icon_file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.json({ key: null, error: errorMessages_1.errorMessages.icon.create });
            return;
        }
        const key = yield (0, s3_1.uploadIcon)(req.file, null, req.params.evaluatorName);
        res.json({ key });
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ key: null, error: e.message });
            console.error('error in route /icon/upload-icon/evaluator/:evaluatorName:', e);
        }
    }
}));
// s3にユーザーアイコンをアップロードする
router.post('/upload-icon/user', checkJwt, upload.single('icon_file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const auth0Id = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.payload.sub;
    if (!auth0Id) {
        res.json({ key: null, error: errorMessages_1.errorMessages.icon.create });
        return;
    }
    try {
        if (!req.file) {
            res.json({ key: null, error: errorMessages_1.errorMessages.icon.create });
            return;
        }
        const key = yield (0, s3_1.uploadIcon)(req.file, auth0Id, null);
        res.json({ key });
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ key: null, error: e.message });
            console.error('error in route /icon/upload-icon/user:', e);
        }
    }
}));
// s3からアイコンを取得する
router.get('/get-icon', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.key) {
        res.json({ imageSrc: null });
        return;
    }
    try {
        const icon = yield (0, s3_1.getIcon)(req.query.key);
        const base64Image = Buffer.from(yield icon.Body.transformToByteArray()).toString('base64');
        const imageSrc = `data:image/jpeg;base64,${base64Image}`;
        res.send({ imageSrc });
    }
    catch (e) {
        if (e instanceof Error) {
            res.json({ imageSrc: null, error: e.message });
            console.error('error in route /icon/get-icon:', e);
        }
    }
}));
exports.default = router;
