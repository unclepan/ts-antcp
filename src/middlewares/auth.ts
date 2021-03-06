import jwt from 'jsonwebtoken';
import Token from '../models/token';
import config from  '../config';
const { secret } = config;

export default class Auth {
  level: number;
  static USER: number;
  static ADMIN: number;
  static SUPER_ADMIN: number;
  constructor(level = 1) {
    this.level = level;
    Auth.USER = 8; // 普通用户
    Auth.ADMIN = 16; // 管理员
    Auth.SUPER_ADMIN = 32; // 超级管理员
  }
  get m() {
    return async(ctx: any, next: any) => { // 自己编写的认证
      const { authorization: authorizationForHeader } = ctx.request.header; // 从header
      const authorizationForCookie = ctx.cookies.get('auth'); // 从cookies
      const authorization = authorizationForCookie || authorizationForHeader || '';
      const token: string = authorization.replace('Bearer ', '');
      const tm = await Token.findOne({token});
      if (tm) {
        try {
          const user: any = jwt.verify(token, secret);
          if (user.scope < this.level) {
            ctx.throw(403, '权限不足');
          }
          ctx.state.user = user; // 通常放一些用户信息
        } catch (err) {
          // 401 未认证（err.name 等于 'TokenExpiredError' 是token已过期）
          if (err.name === 'TokenExpiredError') {
            await Token.findByIdAndRemove(tm._id);
          }
          ctx.throw(401, '用户未通过验证');
        }
      } else {
        ctx.throw(401, '当前用户登陆不合法');
      }
      await next();
    };
  }
  get isLogin() {
    return async(ctx: any, next: any) => {
      const token: string = ctx.params.token;
      const tm = await Token.findOne({token});
      if (tm) {
        try {
          const user: any = jwt.verify(token, secret);
          ctx.state.user = user; // 通常放一些用户信息
          await next();
        } catch (err) {
          await Token.findByIdAndRemove(tm._id);
          ctx.body = false;
        }
      } else {
        ctx.body = false;
      }
    };
  }
  static verifyToken(token: string) {
    try {
      jwt.verify(token, secret);
      return true;
    } catch (e) {
      return false;
    }
  }
}
