"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const s3_1 = __importDefault(require("./routes/s3"));
const evaluation_1 = __importDefault(require("./routes/evaluation"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
// express
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
// cors
console.log(process.env.FRONTEND_PROD_ORIGIN);
const allowedOrigins = [process.env.FRONTEND_LOCAL_ORIGIN, process.env.FRONTEND_PROD_ORIGIN];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
}));
// routes
app.use('/user', user_1.default);
app.use('/s3', s3_1.default);
app.use('/evaluation', evaluation_1.default);
app.listen(port);
