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
// import {auth} from'express-oauth2-jwt-bearer'
/* auth0 jwt config */
// const checkJwt = auth({
//   audience: process.env.AUTH0_API_AUDIENCE,
//   issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//   tokenSigningAlg: process.env.AUTH0_TOKEN_SIGNING_ALG
// });
const router = express_1.default.Router();
/* router */
// ユーザーTOPでユーザー情報を取得する
router.post('/:evaluateeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const evaluation = yield (0, evaluation_1.createEvaluation)(req.body.evaluation);
    if (evaluation) {
        res.json({ evaluation });
    }
    else {
        res.json({ evaluation: null });
    }
}));
exports.default = router;
