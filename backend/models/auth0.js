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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateEmail = exports.updateName = void 0;
const auth0_1 = require("auth0");
const auth0ManagementClient = new auth0_1.ManagementClient({
    domain: process.env.AUTH0_DOMAIN || '',
    clientId: process.env.AUTH0_MANEGEMENT_API_CLIENT_ID,
    clientSecret: process.env.AUTH0_MANEGEMENT_API_CLIENT_SECRET,
    scope: 'create:users read:users update:users delete:users',
});
const updateName = (auth0id, newName) => {
    auth0ManagementClient.updateUser({ id: auth0id }, { name: newName }, (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e)
            throw e;
    }));
};
exports.updateName = updateName;
const updateEmail = (auth0id, newEmail) => {
    auth0ManagementClient.updateUser({ id: auth0id }, { email: newEmail }, (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e)
            throw e;
        // メールアドレス変更後に新しいメールアドレスにverificationメールを送る
        auth0ManagementClient.sendEmailVerification({ user_id: auth0id }, (e) => {
            if (e)
                throw e;
        });
    }));
};
exports.updateEmail = updateEmail;
const deleteUser = (auth0id) => {
    // 退会処理でauth0上のデータは物理削除する
    auth0ManagementClient.deleteUser({ id: auth0id }, (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e)
            throw e;
    }));
};
exports.deleteUser = deleteUser;
