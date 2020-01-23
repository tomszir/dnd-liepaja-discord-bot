const { RichEmbed } = require('discord.js');
const Command = require('../../Command');
const config = require('../../../config');

module.exports = class extends Command {
  constructor() {
    super({
      name: 'help'
    });
  }

  execute(ctx, args) {
    const prefix = config.discord.prefix;
    const embed = new RichEmbed()
      .setTitle('Do not fear! Help is here!')
      .setDescription(`The prefix is \`${prefix}\``)
      .addField(
        'Commands:',
        ctx.client.c.commands.commands.map(c => '`' + prefix + c.name + '`').join(', ')
      );

    ctx.channel.send(embed);
  }
};
