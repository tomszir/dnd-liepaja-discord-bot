const fs = require('fs');
const path = require('path');

module.exports = class CommandLoader {
  constructor() {
    this.commands = [];
  }

  load(baseDir) {
    this.commands = [];

    fs.readdirSync(baseDir)
      .filter(f => !f.endsWith('.js'))
      .forEach(dir => {
        fs.readdirSync(path.join(baseDir, dir))
          .filter(f => f.endsWith('.js') && !f.startsWith('__'))
          .forEach(file => {
            try {
              const Command = require(path.join(baseDir, dir, file));
              const command = new Command();

              command.group = dir;

              this.add(command);
            } catch (err) {
              console.error(`Something went wrong while loading the command - ${file}`, err);
            }
          });
      });

    console.log(`Loaded ${this.commands.length} commands(s)...`);
  }

  get(identifier) {
    return this.commands.find(
      c => c.name === identifier || c.identifier === identifier || c.aliases.includes(identifier)
    );
  }

  add(command) {
    if (this.get(command.identifier))
      throw Error(`A command with this exact identifier already exists - ${command.identifier}!`);

    this.commands.push(command);
  }
};
