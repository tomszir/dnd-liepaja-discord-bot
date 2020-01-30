const CommandContext = require('@/libs/commands/CommandContext');

const logger = require('@/logger');

module.exports = client => {
  return async (command, message, userArgs) => {
    const ctx = new CommandContext({ client, message });

    const args = {};

    // Parse the arguments.
    for (let i = 0; i < command.arguments.length; i++) {
      const arg = userArgs[i];
      const argument = command.arguments[i];

      // Missing argument.
      if (!arg) break;

      // Call the validation function, defaults to True if none is present.
      const valid = argument.validate ? await argument.validate({ client, value: arg }) : true;

      // Invalid argument.
      if (!valid) break;

      // The argument is the last one and gets joined with the previous ones.
      if (argument.joined) {
        args[argument.name] = args.slice(i, command.arguments.length).join(' ');
        break;
      }

      args[argument.name] = arg;
    }

    if (!ctx.member.hasPermission('ADMINISTRATOR')) {
      const missingRoles = [];

      command.roles.forEach(role => {
        if (!ctx.member.roles.map(r => r.name).includes(role)) {
          missingRoles.push(role);
        }
      });

      if (missingRoles.length > 0) {
        // ...
      }
    }

    if (command.developerOnly) {
      if (!config.developers.includes(ctx.author.id)) {
        // ...
      }
    }

    try {
      command.execute(ctx, args);
    } catch (error) {
      logger.error(`An error has occured while executing command: '${command.fullName}'`, {
        error
      });
    }
  };
};
