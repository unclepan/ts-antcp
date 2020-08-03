"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_1 = __importDefault(require("../../models/answers/comments"));
class CommentsCtl {
    async find(ctx) {
        const { per_page = 10 } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1;
        const perPage = Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const { questionId, answerId } = ctx.params;
        const { rootCommentId } = ctx.query; // 可选参数放query上
        const { auditStatus = 1 } = ctx.query; // 审核状态
        ctx.body = await comments_1.default.find({
            content: q,
            questionId,
            answerId,
            rootCommentId,
            auditStatus
        })
            .limit(perPage)
            .skip(page * perPage)
            .populate('commentator replyTo');
    }
    async checkCommentExist(ctx, next) {
        const comment = await comments_1.default.findById(ctx.params.id).select('+commentator');
        if (!comment) {
            ctx.throw(404, '评论不存在');
        }
        if (ctx.params.questionId &&
            comment.questionId.toString() !== ctx.params.questionId) {
            ctx.throw(404, '该问题下没有此评论');
        }
        if (ctx.params.answerId &&
            comment.answerId.toString() !== ctx.params.answerId) {
            ctx.throw(404, '该答案下没有此评论');
        }
        ctx.state.comment = comment;
        await next();
    }
    async findById(ctx) {
        const { fields = '' } = ctx.query;
        const selectFields = fields
            .split(';')
            .filter((f) => f)
            .map((f) => '+' + f)
            .join(' ');
        const populateStr = fields
            .split(';')
            .filter((f) => f)
            .map((f) => f)
            .join(' ');
        const comment = await comments_1.default.findById(ctx.params.id)
            .select(selectFields)
            .populate(populateStr);
        ctx.body = comment;
    }
    async create(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
            rootCommentId: { type: 'string', required: false },
            replyTo: { type: 'string', required: false }
        });
        const commentator = ctx.state.user._id;
        const { questionId, answerId } = ctx.params;
        const comment = await new comments_1.default(Object.assign(Object.assign({}, ctx.request.body), { commentator,
            questionId,
            answerId })).save();
        ctx.body = comment;
    }
    async checkCommentator(ctx, next) {
        const { comment } = ctx.state;
        if (comment.commentator.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限，该评论不等于当前登录用户');
        }
        await next();
    }
    async update(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: false }
        });
        const { content } = ctx.request.body; // 修改评论之允许修改评论内容，不能把二级评论变成一级评论等
        await ctx.state.comment.update({ content });
        ctx.body = ctx.state.comment;
    }
    async delete(ctx) {
        await comments_1.default.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }
}
exports.default = new CommentsCtl();
//# sourceMappingURL=comments.js.map