"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const answerSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    pic: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    answerer: {
        // 回答者
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    voteCount: {
        // 赞同数
        type: Number,
        required: true,
        default: 0
    },
    popular: {
        type: Boolean,
        select: false,
        default: false
    },
    auditStatus: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
exports.default = model('Answer', answerSchema);
//# sourceMappingURL=index.js.map