import Periodical from '../../models/periodical';

class PeriodicalCtl {
  async find(ctx: any) {
    const { per_page = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1, 1) - 1;
    const perPage = Math.max(per_page * 1, 1);
    const q = new RegExp(ctx.query.q);
    const { auditStatus = 1 } = ctx.query; // 审核状态
    const { popular = false } = ctx.query; // 是否推荐

    ctx.body = await Periodical.find({
      $or: [{ title: q }, { description: q }],
      auditStatus,
      popular
    })
      .limit(perPage)
      .skip(page * perPage);
  }
  async checkPeriodicalExist(ctx: any, next: any) {
    const periodical = await Periodical.findById(ctx.params.id);
    if (!periodical) {
      ctx.throw(404, '期刊不存在');
    }
    ctx.state.periodical = periodical;
    await next();
  }
  async findById(ctx: any) {
    // pv统计
    await Periodical.findByIdAndUpdate(ctx.params.id, { $inc: { pv: 1 } });

    const { fields = '' } = ctx.query;
    const selectFields = fields
      .split(';')
      .filter((f: any) => f)
      .map((f: any) => '+' + f)
      .join(' ');
    const populateStr = fields
      .split(';')
      .filter((f: any) => f)
      .map((f: any) => f)
      .join(' ');
    const periodical = await Periodical.findById(ctx.params.id)
      .select(selectFields)
      .populate(populateStr);
    ctx.body = periodical;
  }
  async create(ctx: any) {
    ctx.verifyParams({
      pic: { type: 'string', required: true },
      title: { type: 'string', required: true },
      content: { type: 'string', required: true },
      author: { type: 'string', required: true },
      describe: { type: 'string', required: true }
    });
    const periodical = await new Periodical({
      ...ctx.request.body,
    }).save();
    ctx.body = periodical;
  }
  async update(ctx: any) {
    ctx.verifyParams({
      pic: { type: 'string', required: false },
      title: { type: 'string', required: false },
      content: { type: 'string', required: false },
      author: { type: 'string', required: false },
      describe: { type: 'string', required: false },
      topics: { type: 'array', required: false },
      popular: { type: 'boolean', required: false },
      auditStatus: { type: 'number', required: false }
    });
    await ctx.state.periodical.update(ctx.request.body);
    ctx.body = ctx.state.periodical;
  }

  async delete(ctx: any) {
    await Periodical.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
  async import(ctx: any) {
    const arr = ctx.request.body.map(item => {
      return {
        pic: `/periodical/2019112/${item.caseId}/${item.imgUrl}`,
        title: item.title,
        content: item.content,
        author: item.author,
        describe: item.describe,
        auditStatus: 1
      };
    });
    const periodicals = await Periodical.insertMany(arr);
    ctx.body = periodicals;
  }
}
export default new PeriodicalCtl();
