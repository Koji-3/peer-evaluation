"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateEmail = exports.sendEmailVerification = exports.updateName = void 0;
const auth0_1 = require("auth0");
const errorMessages_1 = require("../const/errorMessages");
const auth0ManagementClient = new auth0_1.ManagementClient({
    domain: process.env.AUTH0_DOMAIN || '',
    clientId: process.env.AUTH0_MANEGEMENT_API_CLIENT_ID,
    clientSecret: process.env.AUTH0_MANEGEMENT_API_CLIENT_SECRET,
    scope: 'create:users read:users update:users delete:users',
});
const updateName = (auth0id, newName) => {
    auth0ManagementClient.updateUser({ id: auth0id }, { name: newName }, (e) => {
        if (e) {
            console.error('updateUser error', e);
            throw new Error(errorMessages_1.errorMessages.user.update);
        }
    });
};
exports.updateName = updateName;
const sendEmailVerification = (auth0id, type) => {
    auth0ManagementClient.sendEmailVerification({ user_id: auth0id, client_id: process.env.REACT_APP_AUTH0_CLIENT_ID }, (e) => {
        if (e) {
            console.error('sendEmailVerification error', e);
            throw new Error(type === 'updateEmail' ? errorMessages_1.errorMessages.user.updateEmail : errorMessages_1.errorMessages.user.resendEmailVerification);
        }
    });
};
exports.sendEmailVerification = sendEmailVerification;
const updateEmail = (auth0id, newEmail) => {
    auth0ManagementClient.updateUser({ id: auth0id }, { email: newEmail }, (e) => {
        if (e) {
            console.error('updateUser error', e);
            throw new Error(errorMessages_1.errorMessages.user.updateEmail);
        }
        // メールアドレス変更後に新しいメールアドレスにverificationメールを送る
        (0, exports.sendEmailVerification)(auth0id, 'updateEmail');
    });
};
exports.updateEmail = updateEmail;
const deleteUser = (auth0id) => {
    // 退会処理でauth0上のデータは物理削除する
    auth0ManagementClient.deleteUser({ id: auth0id }, (e) => {
        if (e) {
            console.error('deleteUser error', e);
            throw new Error(errorMessages_1.errorMessages.user.delete);
        }
    });
};
exports.deleteUser = deleteUser;
