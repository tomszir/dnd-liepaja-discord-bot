const fs = require('fs');
const path = require('path');
const { Client, RichEmbed } = require('discord.js');

const CommandLoader = require('./commands/CommandLoader');
const CommandContext = require('./commands/CommandContext');
const MemberJoinUtil = require('./utils/MemberJoinUtil');

const config = require('./config');
const client = new Client();

// Create a custom namespace in the client as to not interfere with default fields.
client.c = {};

// Instantiate the command loader, for command storing, loading and getting.
client.c.commands = new CommandLoader();

// The bot client is ready.
client.on('ready', () => {
  console.log(`${client.user.username}#${client.user.discriminator} - is ready!`);

  // Load the discord commands.
  client.c.commands.load(path.join(__dirname, './commands/commands'));
});

// Someone has issued a command.
client.on('command', (command, message, args) => {
  const ctx = new CommandContext(client, message);

  if (!ctx.member.hasPermission('ADMINISTRATOR')) {
    command.roles.forEach(role => {
      if (!ctx.member.roles.map(r => r.name).includes(role)) {
        return command.constructor.sendErrorMessage(
          ctx,
          'Seems like you do not have the required roles to issue this command.'
        );
      }
    });
  }

  if (command.developerOnly) {
    if (!config.developers.includes(ctx.author.id)) {
      return command.constructor.sendErrorMessage(
        ctx,
        'Sorry! This command is intented only for the developer.'
      );
    }
  }

  try {
    command.execute(ctx, args);
  } catch (err) {
    console.error(`Something went wrong while executing the command - ${command.identifier}!`, err);
    command.constructor.sendErrorMessage(
      ctx,
      'Something has gone wrong while executing this command.'
    );
  }
});

// Someone sent a message.
client.on('message', message => {
  if (message.author.bot) return;

  const prefix = config.discord.prefix;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.split(/ /);
  const commandName = args.shift().substring(prefix.length);
  const command = client.c.commands.get(commandName);

  if (!command) return;

  client.emit('command', command, message);
});

client.on('guildMemberAdd', async member => {
  const guild = member.guild;
  const channel = guild.channels.find(c => c.name === 'welcome');

  if (!channel) return;

  const embed = await MemberJoinUtil.createJoinEmbed(member);
  const message = await ctx.channel.send(embed);

  MemberJoinUtil.runReactionCollector(message, embed, member);
});

// Log into the Discord API.
client.login(config.discord.token);
