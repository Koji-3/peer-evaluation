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
exports.getPublishedEvaluations = exports.getAllEvaluations = exports.createEvaluation = void 0;
const dynamodb_1 = __importDefault(require("@cyclic.sh/dynamodb"));
const crypto_1 = __importDefault(require("crypto"));
const s3_1 = require("./s3");
const db = (0, dynamodb_1.default)('motionless-crab-hoseCyclicDB');
const evaluations = db.collection('evaluations');
const createEvaluation = (evaluation, evaluateeId) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = crypto_1.default.randomUUID();
    if (!evaluation)
        return;
    const newEvaluation = Object.assign(Object.assign({}, evaluation), { is_published: false, is_deleted: false, evaluateeId });
    const result = yield evaluations.set(uuid, newEvaluation);
    return result;
});
exports.createEvaluation = createEvaluation;
// export const getEvaluation = async(): Promise<any> => {
//   const testEvaluation = await evaluations.get("test_evaluation1")
//   console.log('get', testEvaluation)
// }
const sortByCreatedAt = (results) => {
    const sortedResults = results.sort((a, b) => {
        const unixTimeA = new Date(a.props.created).getTime();
        const unixTimeB = new Date(b.props.created).getTime();
        return unixTimeB - unixTimeA;
    });
    return sortedResults;
};
const addParamsForReturnValueToEvaluations = (results) => __awaiter(void 0, void 0, void 0, function* () {
    const returnValue = yield Promise.all(results.map((result) => __awaiter(void 0, void 0, void 0, function* () {
        if (!result.props.evaluatorIconKey) {
            return Object.assign(Object.assign({}, result.props), { id: result.key, evaluatorIconUrl: undefined });
        }
        else {
            const icon = yield (0, s3_1.getIcon)(result.props.evaluatorIconKey);
            const base64Image = Buffer.from(icon.Body).toString('base64');
            const imageSrc = `data:image/jpeg;base64,${base64Image}`;
            return Object.assign(Object.assign({}, result.props), { id: result.key, evaluatorIconUrl: imageSrc });
        }
    })));
    return returnValue;
});
const getAllEvaluations = (evaluateeId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield evaluations.filter({ evaluateeId, is_deleted: false });
    if (!res.results.length)
        return [];
    const sortedResults = sortByCreatedAt(res.results);
    return addParamsForReturnValueToEvaluations(sortedResults);
});
exports.getAllEvaluations = getAllEvaluations;
const getPublishedEvaluations = (evaluateeId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield evaluations.filter({ evaluateeId, is_published: true, is_deleted: false });
    if (!res.results.length)
        return [];
    const sortedResults = sortByCreatedAt(res.results);
    return addParamsForReturnValueToEvaluations(sortedResults);
});
exports.getPublishedEvaluations = getPublishedEvaluations;
