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
exports.updateEvaluation = exports.getEvaluations = exports.getEvaluation = exports.createEvaluation = void 0;
const dynamodb_1 = __importDefault(require("@cyclic.sh/dynamodb"));
const crypto_1 = __importDefault(require("crypto"));
const s3_1 = require("./s3");
const user_1 = require("./user");
const errorMessages_1 = require("../const/errorMessages");
const db = (0, dynamodb_1.default)('motionless-crab-hoseCyclicDB');
const evaluations = db.collection('evaluations');
const createEvaluation = (evaluation, evaluateeId) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = crypto_1.default.randomUUID();
    const newEvaluation = Object.assign(Object.assign({}, evaluation), { is_published: false, is_deleted: false, evaluateeId });
    try {
        const result = yield evaluations.set(uuid, newEvaluation);
        yield (0, user_1.increaseUserAllEvaluationNum)(evaluateeId);
        return result;
    }
    catch (e) {
        console.error('createEvaluation error: ', e);
        throw new Error(errorMessages_1.errorMessages.evaluation.create);
    }
});
exports.createEvaluation = createEvaluation;
const getEvaluation = (evaluationId, auth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const evaluation = yield evaluations.get(evaluationId);
        const isPublished = evaluation.props.is_published;
        const isDeleted = evaluation.props.is_deleted;
        if (auth0Id) {
            const user = yield (0, user_1.getUserByAuth0Id)(auth0Id);
            const userId = user === null || user === void 0 ? void 0 : user.key;
            if (!userId) {
                throw new Error(errorMessages_1.errorMessages.evaluation.get);
            }
            if (evaluation.props.evaluateeId === userId) {
                return !isDeleted ? Object.assign(Object.assign({}, evaluation.props), { id: evaluation.key, shouldShowOperateButtons: true }) : null;
            }
            return isPublished || !isDeleted ? Object.assign(Object.assign({}, evaluation.props), { id: evaluation.key, shouldShowOperateButtons: false }) : null;
        }
        else {
            return isPublished || !isDeleted ? Object.assign(Object.assign({}, evaluation.props), { id: evaluation.key, shouldShowOperateButtons: false }) : null;
        }
    }
    catch (e) {
        console.error('getEvaluation error: ', e);
        throw new Error(errorMessages_1.errorMessages.evaluation.get);
    }
});
exports.getEvaluation = getEvaluation;
const sortByCreatedAt = (results) => {
    const sortedResults = results.sort((a, b) => {
        const unixTimeA = new Date(a.props.created).getTime();
        const unixTimeB = new Date(b.props.created).getTime();
        return unixTimeB - unixTimeA;
    });
    return sortedResults;
};
const addParamsForReturnValueToEvaluations = (results, isSelf) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const returnValue = yield Promise.all(results.map((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (!result.props.evaluatorIconKey) {
                return Object.assign(Object.assign({}, result.props), { id: result.key, evaluatorIconUrl: undefined, shouldShowOperateButtons: isSelf });
            }
            else {
                const icon = yield (0, s3_1.getIcon)(result.props.evaluatorIconKey);
                const base64Image = Buffer.from(icon.Body).toString('base64');
                const imageSrc = `data:image/jpeg;base64,${base64Image}`;
                return Object.assign(Object.assign({}, result.props), { id: result.key, evaluatorIconUrl: imageSrc, shouldShowOperateButtons: isSelf });
            }
        })));
        return returnValue;
    }
    catch (e) {
        console.error('addParamsForReturnValueToEvaluations error: ', e);
        throw new Error('addParamsForReturnValueToEvaluations error');
    }
});
const getAllEvaluations = (evaluateeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield evaluations.filter({ evaluateeId, is_deleted: false });
        if (!res.results.length)
            return [];
        const sortedResults = sortByCreatedAt(res.results);
        return addParamsForReturnValueToEvaluations(sortedResults, true);
    }
    catch (e) {
        console.error('getAllEvaluations error: ', e);
        throw new Error('getAllEvaluations error');
    }
});
const getPublishedEvaluations = (evaluateeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield evaluations.filter({ evaluateeId, is_published: true, is_deleted: false });
        if (!res.results.length)
            return [];
        const sortedResults = sortByCreatedAt(res.results);
        return addParamsForReturnValueToEvaluations(sortedResults, false);
    }
    catch (e) {
        console.error('getPublishedEvaluations error: ', e);
        throw new Error('getPublishedEvaluations error');
    }
});
const getEvaluations = (evaluateeId, auth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    if (auth0Id) {
        try {
            const user = yield (0, user_1.getUserByAuth0Id)(auth0Id);
            const userId = user === null || user === void 0 ? void 0 : user.key;
            if (!userId) {
                throw new Error(errorMessages_1.errorMessages.evaluation.get);
            }
            if (evaluateeId === userId) {
                return yield getAllEvaluations(evaluateeId);
            }
            return yield getPublishedEvaluations(evaluateeId);
        }
        catch (e) {
            console.error('getEvaluations error: ', e);
            throw new Error(errorMessages_1.errorMessages.evaluation.get);
        }
    }
    else {
        try {
            return yield getPublishedEvaluations(evaluateeId);
        }
        catch (e) {
            console.error('getEvaluations error: ', e);
            throw new Error(errorMessages_1.errorMessages.evaluation.get);
        }
    }
});
exports.getEvaluations = getEvaluations;
const updateEvaluation = ({ evaluationId, isPublished, isDeleted, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const evaluation = yield evaluations.get(evaluationId);
        const res = yield evaluations.set(evaluationId, Object.assign(Object.assign({}, evaluation), { is_published: isPublished !== null && isPublished !== void 0 ? isPublished : evaluation.props.is_published, is_deleted: isDeleted !== null && isDeleted !== void 0 ? isDeleted : evaluation.props.is_deleted }));
        if (isPublished) {
            yield (0, user_1.increaseUserAvarageEvaluation)(evaluation.props.evaluateeId, evaluation.props);
        }
        else {
            yield (0, user_1.decreaseUserAvarageEvaluation)(evaluation.props.evaluateeId, evaluation.props);
        }
        if (!!res)
            return { update: true };
        return { update: false };
    }
    catch (e) {
        console.error('updateEvaluation error: ', e);
        throw new Error(isDeleted ? errorMessages_1.errorMessages.evaluation.delete : isPublished ? errorMessages_1.errorMessages.evaluation.publish : errorMessages_1.errorMessages.evaluation.unpublish);
    }
});
exports.updateEvaluation = updateEvaluation;
// FIXME: データ確認用なので最後に消す
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteAllEvaluations = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersList = yield evaluations.list();
    const targetKeys = usersList.results.map((result) => result.key);
    targetKeys.forEach((key) => __awaiter(void 0, void 0, void 0, function* () {
        yield evaluations.delete(key);
    }));
});
// FIXME: データ確認用なので最後に消す
// deleteAllEvaluations()
