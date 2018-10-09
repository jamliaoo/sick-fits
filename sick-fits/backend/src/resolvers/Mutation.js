const Mutations = {
  async createItem(parent, args, ctx, info) {
    const { data } = args;
    const item = await ctx.db.mutation.createItem({
      data
    }, info);
    return item;
  }
};

module.exports = Mutations;
