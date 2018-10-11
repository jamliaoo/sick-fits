const Mutations = {
  async createItem(parent, args, ctx, info) {
    const { data } = args;
    const item = await ctx.db.mutation.createItem({
      data
    }, info);
    return item;
  },

  updateItem(parent, args, ctx, info) {
    const { data, where } = args;
    return ctx.db.mutation.updateItem({
      data,
      where,
    }, info);
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{ id title}`);
    if (!item) return;
    return ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = Mutations;
