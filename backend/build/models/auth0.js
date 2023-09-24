"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuth0ManagementClient = exports.updateEmail = exports.updateName = void 0;
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
            // auth0の名前の更新に失敗しても致命的ではないのでエラーを投げない
            console.error('updateUser error', e);
        }
    });
};
exports.updateName = updateName;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateEmail = (auth0id, newEmail, res) => {
    auth0ManagementClient.updateUser({ id: auth0id }, { email: newEmail }, (e) => {
        if (e) {
            console.error('updateEmail error', e.message);
            if (e.message.includes(errorMessages_1.errorMessages.auth0.emailAlreadyExists)) {
                return res.json({ updateEmail: false, error: errorMessages_1.errorMessages.user.emailAlreadyExists });
            }
            return res.json({ updateEmail: false, error: errorMessages_1.errorMessages.user.updateEmail });
        }
        return res.json({ updateEmail: true });
    });
};
exports.updateEmail = updateEmail;
const getAuth0ManagementClient = () => auth0ManagementClient;
exports.getAuth0ManagementClient = getAuth0ManagementClient;
