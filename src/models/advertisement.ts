import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const advertisementSchema = new Schema(
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
      required: true, // 验证必填
      max: 120, // 最大值验证
      min: 3 // 最小值验证
    },
    link: {
      type: String,
      required: true, // 验证必填
      validate: {
        validator(v) {
          return /http/.test(v);
        },
        message: 'link格式不正确!'
      }
    },
    description: {
      // 简介
      type: String
    },
    auditStatus: { // 审核状态
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default model('Advertisement', advertisementSchema);
