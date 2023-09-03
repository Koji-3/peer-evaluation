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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUserByAuth0Id = exports.createUser = void 0;
const dynamodb_1 = __importDefault(require("@cyclic.sh/dynamodb"));
const short_uuid_1 = __importDefault(require("short-uuid"));
const crypto_1 = __importDefault(require("crypto"));
const evaluation_1 = require("./evaluation");
const errorMessages_1 = require("../const/errorMessages");
const lib_1 = require("../lib/lib");
const db = (0, dynamodb_1.default)('motionless-crab-hoseCyclicDB');
const users = db.collection('users');
const createUser = (user, auth0id) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = short_uuid_1.default.generate();
    const newUser = Object.assign(Object.assign({}, user), { is_deleted: false, auth0_id: auth0id });
    try {
        const result = yield users.set(uuid, newUser);
        return result;
    }
    catch (e) {
        console.error('createUser error: ', e);
        throw new Error(errorMessages_1.errorMessages.user.create);
    }
});
exports.createUser = createUser;
const getUserByAuth0Id = (auth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userbyAuth0Id = yield users.filter({ auth0_id: auth0Id });
        if (!userbyAuth0Id.results.length || userbyAuth0Id.results[0].props.is_deleted) {
            // FEで出し分けたいのでnullを返す
            return null;
        }
        return userbyAuth0Id.results[0];
    }
    catch (e) {
        console.error('getUserByAuth0Id error: ', e);
        throw new Error(errorMessages_1.errorMessages.user.get);
    }
});
exports.getUserByAuth0Id = getUserByAuth0Id;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users.get(id);
        if (!user || user.props.is_deleted) {
            console.error('!user || user.props.is_deleted in getUserById');
            throw new Error(errorMessages_1.errorMessages.user.get);
        }
        const initialAverageEvaluation = {
            e1: 0,
            e2: 0,
            e3: 0,
            e4: 0,
            e5: 0,
            e6: 0,
        };
        const allEvaluations = yield (0, evaluation_1.getAllEvaluations)(id);
        if (!allEvaluations.length) {
            return Object.assign(Object.assign({}, user.props), { id: user.key, allEvaluationNum: allEvaluations.length, publishedEvaluationNum: 0, averageEvaluation: initialAverageEvaluation });
        }
        const publishedEvaluations = yield (0, evaluation_1.getPublishedEvaluations)(id);
        if (!publishedEvaluations.length) {
            return Object.assign(Object.assign({}, user.props), { id: user.key, allEvaluationNum: allEvaluations.length, publishedEvaluationNum: publishedEvaluations.length, averageEvaluation: initialAverageEvaluation });
        }
        const e1values = publishedEvaluations.map((evaluation) => evaluation.props.e1.point);
        const e2values = publishedEvaluations.map((evaluation) => evaluation.props.e2.point);
        const e3values = publishedEvaluations.map((evaluation) => evaluation.props.e3.point);
        const e4values = publishedEvaluations.map((evaluation) => evaluation.props.e4.point);
        const e5values = publishedEvaluations.map((evaluation) => evaluation.props.e5.point);
        const e6values = publishedEvaluations.map((evaluation) => evaluation.props.e6.point);
        const sumReducer = (sum, currentValue) => sum + currentValue;
        const averageEvaluation = {
            e1: (0, lib_1.roundToFirstDecimal)(e1values.reduce(sumReducer) / e1values.length),
            e2: (0, lib_1.roundToFirstDecimal)(e2values.reduce(sumReducer) / e2values.length),
            e3: (0, lib_1.roundToFirstDecimal)(e3values.reduce(sumReducer) / e3values.length),
            e4: (0, lib_1.roundToFirstDecimal)(e4values.reduce(sumReducer) / e4values.length),
            e5: (0, lib_1.roundToFirstDecimal)(e5values.reduce(sumReducer) / e5values.length),
            e6: (0, lib_1.roundToFirstDecimal)(e6values.reduce(sumReducer) / e6values.length),
        };
        return Object.assign(Object.assign({}, user.props), { id: user.key, allEvaluationNum: allEvaluations.length, publishedEvaluationNum: publishedEvaluations.length, averageEvaluation });
    }
    catch (e) {
        console.error('getUserById error: ', e);
        throw new Error(errorMessages_1.errorMessages.user.get);
    }
});
exports.getUserById = getUserById;
const updateUser = (auth0Id, newUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield (0, exports.getUserByAuth0Id)(auth0Id));
        const updatedUser = yield users.set(user.key, newUser);
        return updatedUser;
    }
    catch (e) {
        console.error('updateUser error: ', e);
        throw new Error(errorMessages_1.errorMessages.user.update);
    }
});
exports.updateUser = updateUser;
const deleteUser = (auth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield (0, exports.getUserByAuth0Id)(auth0Id));
        const uuid = crypto_1.default.randomUUID();
        // 退会処理でdynamoDB上のデータは論理削除する
        const deletedUser = yield users.set(user.key, {
            auth0_id: uuid,
            name: '退会済みユーザー',
            profile: '',
            icon_key: '',
            is_deleted: true,
        });
        return deletedUser;
    }
    catch (e) {
        console.error('deleteUser error: ', e);
        throw new Error(errorMessages_1.errorMessages.user.delete);
    }
});
exports.deleteUser = deleteUser;
/* データ確認用 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserList = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersList = yield users.list();
    console.log('getUserList', usersList);
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersList = yield users.list();
    const targetKeys = usersList.results.map((result) => result.key);
    targetKeys.forEach((key) => __awaiter(void 0, void 0, void 0, function* () {
        yield users.delete(key);
    }));
});
// deleteAllUser()
getUserList();
/* ここまで */
