import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const periodicalSchema = new Schema(
  {
    __v: {
      type: Number,
      select: false
    },
    pic: {
      type: String,
      required: true
    },
    title: {
      type: String,
      index: true, // 辅助索引
      required: true, // 验证必填
      max: 120, // 最大值验证
      min: 3 // 最小值验证
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    describe: {
      type: String,
      required: true
    },
    pv: {
      type: Number,
      required: true,
      default: 0
    },
    topics: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Topic'
        }
      ],
      select: false
    },
    voteCount: {
      // 投票数
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
      select: false,
      default: 0
    }
  },
  { timestamps: true }
);

export default model('Periodical', periodicalSchema);
