"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roundToFirstDecimal = void 0;
const roundToFirstDecimal = (num) => {
    return Math.round(num * 10) / 10;
};
exports.roundToFirstDecimal = roundToFirstDecimal;
