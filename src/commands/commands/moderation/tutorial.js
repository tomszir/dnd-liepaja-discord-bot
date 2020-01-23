const Command = require('../../Command');

module.exports = class extends Command {
  constructor() {
    super({
      name: 'tutorial',
      description: 'Schedule an upcoming announcement.',
      roles: ['D&D Moderator']
    });
  }

  execute(ctx, args) {
    ctx.channel.send('Announcing...');
  }
};
