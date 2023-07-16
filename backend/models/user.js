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
const db = (0, dynamodb_1.default)('motionless-crab-hoseCyclicDB');
const users = db.collection('users');
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = short_uuid_1.default.generate();
    if (!user)
        return undefined;
    const newUser = yield users.set(uuid, Object.assign(Object.assign({}, user), { is_deleted: false }));
    return newUser;
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
    return user;
});
exports.getUserById = getUserById;
const updateUser = (auth0Id, newUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (!newUser)
        return;
    const user = (yield (0, exports.getUserByAuth0Id)(auth0Id));
    const updatedUser = yield users.set(user.key, newUser);
    return updatedUser;
});
exports.updateUser = updateUser;
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
