const Command = require('@/libs/commands/Command');

module.exports = class extends Command {
  constructor() {
    super({
      name: 'schedule',
      description: 'Schedule an upcoming announcement.',
      roles: ['D&D Moderator']
    });
  }

  execute(ctx, args) {
    ctx.channel.send('Announcing...');
  }
};
