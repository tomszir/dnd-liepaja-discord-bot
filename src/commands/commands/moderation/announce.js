const { RichEmbed } = require('discord.js');
const Command = require('../../Command');

module.exports = class extends Command {
  constructor() {
    super({
      name: 'announce',
      description:
        'Announce an upcoming event. Sends a notification in the announcement channel (if one is set).',
      roles: ['D&D Moderator']
    });
  }

  async execute(ctx, args) {
    const channel = ctx.channel.guild.channels.find(c => c.name === 'announcements');

    if (!channel)
      return Command.sendErrorMessage(
        ctx,
        'No announcement channel found! Please create a `#announcements` channel.'
      );

    const announcement = new RichEmbed();
    const steps = [
      {
        message: 'What will be the title of this event? (a few words)',
        callback: response => {
          announcement.setTitle(response.content);
        }
      },
      {
        message: 'How can you describe the event in one or two sentences? (a brief description)',
        callback: response => {
          announcement.setDescription(response.content);
        }
      },
      {
        message: 'Where is the event happening? (a location)',
        callback: response => {
          announcement.addField('Place', response.content);
        }
      },
      {
        message: 'When and when is the event happening? (a time and a date)',
        callback: response => {
          announcement.addField('Date & Time', response.content);
        }
      }
    ];

    const embed = new RichEmbed()
      .setDescription('Setting up...')
      .setColor(await ctx.getAvatarPrimaryColor());

    const message = await ctx.channel.send(embed);
    const filter = r => r.author.id === ctx.author.id;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      embed.setTitle('Creating Announcement...');
      embed.setDescription(step.message);
      embed.setFooter(`Step ${i + 1} of ${steps.length}`);

      await message.edit(embed);

      const responses = await message.channel.awaitMessages(filter, { maxMatches: 1 });
      const response = responses.first();

      await step.callback(response);
      await response.delete();
    }

    message.edit(
      new RichEmbed()
        .setColor(await ctx.getAvatarPrimaryColor())
        .setDescription('A new announcement has been created!')
    );
    channel.send(announcement);
  }
};
