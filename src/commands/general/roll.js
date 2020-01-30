const { RichEmbed } = require('discord.js');
const Command = require('@/libs/commands/Command');
const Random = require('@/utils/Random');

const config = require('@config');

module.exports = class extends Command {
  constructor() {
    super({
      name: 'roll',
      arguments: [
        {
          name: 'dice'
        }
      ]
    });
  }

  execute(ctx, args) {
    const rolls = Random.fromDiceString(args['dice']);

    ctx.channel.send(rolls.join(', '));
  }
};
