"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const periodicalCommentSchema = new Schema({
    __v: {
        type: Number,
        select: false
    },
    content: {
        type: String,
        required: true
    },
    commentator: {
        // 评论人
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    periodicalId: {
        // 属于那一篇期刊（为什么不用ref？，因为不用在评论里填充期刊内容）
        type: String,
        required: true
    },
    rootCommentId: {
        // 根评论的id，非必选，因为一级评论没有根评论id
        type: String
    },
    replyTo: {
        // 回复给谁
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    auditStatus: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
exports.default = model('PeriodicalComment', periodicalCommentSchema);
//# sourceMappingURL=comments.js.map