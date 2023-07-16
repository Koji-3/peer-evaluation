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
exports.deleteUser = exports.decreaseUserAvarageEvaluation = exports.increaseUserAvarageEvaluation = exports.increaseUserAllEvaluationNum = exports.updateUser = exports.getUserById = exports.getUserByAuth0Id = exports.createUser = void 0;
const dynamodb_1 = __importDefault(require("@cyclic.sh/dynamodb"));
const short_uuid_1 = __importDefault(require("short-uuid"));
const crypto_1 = __importDefault(require("crypto"));
const db = (0, dynamodb_1.default)('motionless-crab-hoseCyclicDB');
const users = db.collection('users');
const createUser = (user, auth0id) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = short_uuid_1.default.generate();
    if (!user)
        return undefined;
    const defaultAverageEvaluation = { e1: 0, e2: 0, e3: 0, e4: 0, e5: 0, e6: 0 };
    const newUser = Object.assign(Object.assign({}, user), { is_deleted: false, auth0_id: auth0id, averageEvaluation: defaultAverageEvaluation, publishedEvaluationNum: 0, allEvaluationNum: 0 });
    const result = yield users.set(uuid, newUser);
    return result;
});
exports.createUser = createUser;
const getUserByAuth0Id = (auth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    const userbyAuth0Id = yield users.filter({ auth0_id: auth0Id });
    if (!userbyAuth0Id.results.length)
        return undefined;
    // TODO: is_deletedがtrueのときの処理
    return userbyAuth0Id.results[0];
});
exports.getUserByAuth0Id = getUserByAuth0Id;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users.get(id);
    // TODO: そのidのユーザーがいないときの処理
    // TODO: is_deletedがtrueのときの処理
    return Object.assign(Object.assign({}, user.props), { id: user.key });
});
exports.getUserById = getUserById;
const updateUser = (auth0Id, newUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield (0, exports.getUserByAuth0Id)(auth0Id));
    const updatedUser = yield users.set(user.key, newUser);
    return updatedUser;
});
exports.updateUser = updateUser;
const increaseUserAllEvaluationNum = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users.get(userId);
    const { allEvaluationNum } = user.props;
    const newAllEvaluationNum = allEvaluationNum + 1;
    yield users.set(user.key, Object.assign(Object.assign({}, user), { allEvaluationNum: newAllEvaluationNum }));
});
exports.increaseUserAllEvaluationNum = increaseUserAllEvaluationNum;
const increaseUserAvarageEvaluation = (userId, evaluation) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users.get(userId);
    const { averageEvaluation, publishedEvaluationNum } = user.props;
    const newAverageEvaluation = {
        e1: Math.round(((averageEvaluation.e1 * publishedEvaluationNum + evaluation.e1.point) / (publishedEvaluationNum + 1)) * 10) / 10,
        e2: Math.round(((averageEvaluation.e2 * publishedEvaluationNum + evaluation.e2.point) / (publishedEvaluationNum + 1)) * 10) / 10,
        e3: Math.round(((averageEvaluation.e3 * publishedEvaluationNum + evaluation.e3.point) / (publishedEvaluationNum + 1)) * 10) / 10,
        e4: Math.round(((averageEvaluation.e4 * publishedEvaluationNum + evaluation.e4.point) / (publishedEvaluationNum + 1)) * 10) / 10,
        e5: Math.round(((averageEvaluation.e5 * publishedEvaluationNum + evaluation.e5.point) / (publishedEvaluationNum + 1)) * 10) / 10,
        e6: Math.round(((averageEvaluation.e6 * publishedEvaluationNum + evaluation.e6.point) / (publishedEvaluationNum + 1)) * 10) / 10,
    };
    const newPublishedEvaluationNum = publishedEvaluationNum + 1;
    yield users.set(user.key, Object.assign(Object.assign({}, user), { averageEvaluation: newAverageEvaluation, publishedEvaluationNum: newPublishedEvaluationNum }));
});
exports.increaseUserAvarageEvaluation = increaseUserAvarageEvaluation;
const decreaseUserAvarageEvaluation = (userId, evaluation) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users.get(userId);
    const { averageEvaluation, publishedEvaluationNum } = user.props;
    const newAverageEvaluation = {
        e1: Math.round(((averageEvaluation.e1 * publishedEvaluationNum - evaluation.e1.point) / (publishedEvaluationNum - 1)) * 10) / 10,
        e2: Math.round(((averageEvaluation.e2 * publishedEvaluationNum - evaluation.e2.point) / (publishedEvaluationNum - 1)) * 10) / 10,
        e3: Math.round(((averageEvaluation.e3 * publishedEvaluationNum - evaluation.e3.point) / (publishedEvaluationNum - 1)) * 10) / 10,
        e4: Math.round(((averageEvaluation.e4 * publishedEvaluationNum - evaluation.e4.point) / (publishedEvaluationNum - 1)) * 10) / 10,
        e5: Math.round(((averageEvaluation.e5 * publishedEvaluationNum - evaluation.e5.point) / (publishedEvaluationNum - 1)) * 10) / 10,
        e6: Math.round(((averageEvaluation.e6 * publishedEvaluationNum - evaluation.e6.point) / (publishedEvaluationNum - 1)) * 10) / 10,
    };
    const newPublishedEvaluationNum = publishedEvaluationNum - 1;
    yield users.set(user.key, Object.assign(Object.assign({}, user), { averageEvaluation: newAverageEvaluation, publishedEvaluationNum: newPublishedEvaluationNum }));
});
exports.decreaseUserAvarageEvaluation = decreaseUserAvarageEvaluation;
const deleteUser = (auth0Id) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.deleteUser = deleteUser;
// FIXME: データ確認用なので最後に消す
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUserList = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersList = yield users.list();
    console.log('getUserList', usersList);
});
// FIXME: データ確認用なので最後に消す
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersList = yield users.list();
    const targetKeys = usersList.results.map((result) => result.key);
    targetKeys.forEach((key) => __awaiter(void 0, void 0, void 0, function* () {
        yield users.delete(key);
    }));
});
// FIXME: データ確認用なので最後に消す
// deleteAllUser()
getUserList();
