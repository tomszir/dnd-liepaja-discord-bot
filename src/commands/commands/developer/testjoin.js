const { RichEmbed } = require('discord.js');
const Command = require('../../Command');
const MemberJoinUtil = require('../../../utils/MemberJoinUtil');

module.exports = class extends Command {
  constructor() {
    super({
      name: 'testjoin',
      description: 'Simulate the "onGuildMemberJoin" event.',
      developerOnly: true
    });
  }

  async execute(ctx, args) {
    const embed = await MemberJoinUtil.createJoinEmbed(ctx.member);
    const message = await ctx.channel.send(embed);

    MemberJoinUtil.runReactionCollector(message, embed, ctx.member);
  }
};
