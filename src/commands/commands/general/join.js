const { RichEmbed } = require('discord.js');
const Command = require('../../Command');

const config = require('../../../config');

const memberRole = config.memberRole;
const rules = config.rules;
const schools = config.schools;

// Get formatted rules.
function getRuleString() {
  return rules.map((r, i) => `\`${i + 1}.\` | ${r}`);
}

// Get formatted school names/emojis.
function getSchoolString() {
  return schools.map(s => `${s.emoji}  |  \`${s.name}\`­`).join('\n');
}

// Assigns a role to user, creates it if doesn't exist.
async function assignRole(name, member, hoist = false) {
  const guild = member.guild;
  const getRole = () => guild.roles.find(r => r.name === name);

  // If the role doesn't exist, create it.
  if (!getRole())
    await guild.createRole({
      hoist,
      name,
      mentionable: true,
      color: Math.floor(Math.random() * 16777215).toString(16)
    });

  // Assign the role to the member.
  member.addRole(getRole());
}

module.exports = class extends Command {
  constructor() {
    super({
      name: 'join',
      description: 'Join the server and accept the rules.'
    });
  }

  async execute(ctx, args) {
    // Name some variables.
    const member = ctx.member;
    const originalMessage = ctx.message;

    // Create the embed.
    const avatarPrimaryColor = await ctx.getAvatarPrimaryColor();
    const embed = new RichEmbed()
      .setColor(avatarPrimaryColor)
      .setAuthor('To gain access read the rules and choose your school.', member.user.avatarURL)
      .addField('Rules (you accept these by joining):', getRuleString())
      .addField('A list of schools:', getSchoolString())
      .setFooter("If you're having problems, please contact a moderator.");

    // Send the message.
    const message = await ctx.channel.send(embed);

    // Allow only the joined member and the select emojis.
    const filter = (r, u) => schools.map(s => s.emoji).includes(r.emoji.name) && u.id === member.id;

    // Add all school emojis to the message.
    for (let i = 0; i < schools.length; i++) {
      await message.react(schools[i].emoji);
    }

    // Collect all incoming reactions from the joined user.
    const collector = message.createReactionCollector(filter, { max: 1 });

    // A reaction was collected.
    collector.on('collect', async reaction => {
      // The school that was selected.
      const school = schools.find(s => s.emoji === reaction.emoji.name);
      const schoolRoleName = school.role || school.name;

      // Create the new embed.
      const newEmbed = new RichEmbed()
        .setColor(embed.color)
        .setAuthor(`Successfully joined!`, member.user.avatarURL);

      // Edit the message to show the edited embed & clear reactions.
      await message.clearReactions();
      await message.edit(newEmbed);

      originalMessage.delete(5000);
      message.delete(5000);

      // Get previous school role.
      const schoolRoles = member.guild.roles.filter(r =>
        schools.map(s => s.role || s.name).includes(r.name)
      );

      // Remove previous school role.
      await member.removeRoles(schoolRoles);
      await assignRole(memberRole, member);

      // Assign the roles to the user.
      if (school.disabled) return;

      await assignRole(schoolRoleName, member, true);
    });

    collector.on('end', collected => {
      if (collected.size > 0) return;

      // Create the new embed.
      const newEmbed = new RichEmbed().setColor(0xea2e3b).setFooter('Timed out. Please try again.');
      newEmbed.author = embed.author;

      message.edit(newEmbed);
      message.clearReactions();
    });
  }
};
