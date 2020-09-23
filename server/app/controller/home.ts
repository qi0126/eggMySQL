import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async detail() {
    const { ctx } = this;
    var params = this.ctx.params;
    ctx.body = await ctx.service.test.detail(params.id);
  }
  public async findAll() {
    const { ctx } = this;
    ctx.body = await ctx.service.test.findAll();
  }
  public async edit() {
    var params = this.ctx.request.body;
    const { ctx } = this;
    ctx.body = await ctx.service.test.edit(params);
  }
  public async insert() {
    var params = this.ctx.request.body;
    const { ctx } = this;
    ctx.body = await ctx.service.test.insert(params);
  }
  public async delete() {
    var params = this.ctx.params;
    const { ctx } = this;
    ctx.body = await ctx.service.test.delete(params.id);
  }
}
