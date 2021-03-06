import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const answerSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false
    },
    pic: { // 此答案的缩略图，可以省略
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
    questionId: { // 属于那一个问题
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
    popular: { // 是否要推荐展示
      type: Boolean,
      select: false,
      default: false
    },
    auditStatus: { // 审核状态
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default model('Answer', answerSchema);
