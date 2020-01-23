const rgbHex = require('rgb-hex');
const { RichEmbed } = require('discord.js');
const { getColorFromURL } = require('color-thief-node');

const memberRole = 'Member';

const messages = ['<!name!> has entered the dungeon.', '<!name!> rolled a natural D20.'];

const schools = [
  {
    emoji: '👌',
    name: 'Liepājas Valsts 1. Ģimnāzija',
    role: 'LV1G'
  },
  {
    emoji: '🤠',
    name: 'Liepājas pilsētas 5. vidusskola',
    role: '5. vsk.'
  },
  {
    emoji: '❓',
    name: 'None of the above'
  }
];

// A utility class for verification on join.
class MemberJoinUtil {
  static getSchoolListString() {
    return '```' + schools.map(s => `${s.emoji} • ${s.name}`).join('\n') + '```';
  }

  static async createJoinEmbed(member) {
    const avatarRGBColor = await getColorFromURL(member.user.avatarURL);
    const avatarPrimaryColor = rgbHex(...avatarRGBColor);
    const embed = new RichEmbed()
      .setColor(avatarPrimaryColor)
      .setAuthor(
        messages[Math.floor(Math.random() * messages.length)].replace(
          '<!name!>',
          member.user.username
        ),
        member.user.avatarURL
      )
      .setDescription(
        'Before you can continue, please choose your school by reacting with the appropriate emoji.'
      )
      .addField('A list of schools:', MemberJoinUtil.getSchoolListString())
      .setFooter("If you're having problems, please contact a moderator.");

    return embed;
  }

  static async runReactionCollector(message, embed, member) {
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

      // Create the new embed.
      const newEmbed = new RichEmbed()
        .setColor(embed.color)
        .setFooter(`${school.name}`)
        .setAuthor(embed.author.name)
        .setImage(member.user.avatarURL);

      // Edit the message to show the edited embed & clear reactions.
      message.edit(newEmbed);
      message.clearReactions();

      // Get previous school role.
      const schoolRole = member.guild.roles.find(r =>
        schools.map(s => s.role || s.name).includes(r.name)
      );

      // Remove previous school role.
      if (schoolRole.name !== (school.role || school.name)) await member.removeRole(schoolRole);

      MemberJoinUtil.assignRole(memberRole, member);

      // Assign the roles to the user.
      if (reaction.emoji.name !== '❓')
        MemberJoinUtil.assignRole(school.role || school.name, member, true);
    });

    // The collecting of reactions has ended.
    collector.on('end', collected => {
      // The reaction was collected.
      if (collected.size > 0) return;

      // Create the new embed.
      const newEmbed = new RichEmbed()
        .setColor(0xea2e3b)
        .setFooter('Failed to react in time. Please use "dnd!join" to try again.');
      newEmbed.author = embed.author;

      // Edit the embed.
      message.edit(newEmbed);
      message.clearReactions();
    });
  }

  static async assignRole(name, member, hoist = false) {
    const guild = member.guild;

    // If the role doesn't exist, create it.
    if (!guild.roles.find(r => r.name == name)) {
      await guild.createRole({
        hoist,
        name: name,
        mentionable: true,
        color: Math.floor(Math.random() * 16777215).toString(16)
      });
    }

    // Assign the role to the member.
    member.addRole(guild.roles.find(r => r.name == name));
  }
}

module.exports = MemberJoinUtil;
