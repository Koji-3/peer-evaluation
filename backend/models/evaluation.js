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
exports.createEvaluation = void 0;
const dynamodb_1 = __importDefault(require("@cyclic.sh/dynamodb"));
const crypto_1 = __importDefault(require("crypto"));
const db = (0, dynamodb_1.default)('motionless-crab-hoseCyclicDB');
const evaluations = db.collection('evaluations');
const createEvaluation = (evaluation) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = crypto_1.default.randomUUID();
    if (!evaluation)
        return;
    const newEvaluation = yield evaluations.set(uuid, evaluation);
    return newEvaluation;
});
exports.createEvaluation = createEvaluation;
// export const getEvaluation = async(): Promise<any> => {
//   const testEvaluation = await evaluations.get("test_evaluation1")
//   console.log('get', testEvaluation)
// }
// export const getAllEvaluationsByUser = async(): Promise<any> => {
//   const evaluationsByUser = await evaluations.filter({user_id: 'test1', is_deleted: false})
//   console.log('getEvaluationsByUser', evaluationsByUser)
// }
// export const getPublishedEvaluationsByUser = async(): Promise<any> => {
//   const evaluationsByUser = await evaluations.filter({user_id: 'test1', is_published: true, is_deleted: false})
//   console.log('getEvaluationsByUser', evaluationsByUser)
// }
