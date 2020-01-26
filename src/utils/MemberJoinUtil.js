const rgbHex = require('rgb-hex');
const { RichEmbed } = require('discord.js');
const { getColorFromURL } = require('color-thief-node');

// A utility class for verification on join.
module.exports = {
  async run(originalMessage, member) {
    const avatarRGBColor = await getColorFromURL(member.user.avatarURL);
    const avatarPrimaryColor = rgbHex(...avatarRGBColor);
    const embed = new RichEmbed()
      .setColor(avatarPrimaryColor)
      .setAuthor('To gain access read the rules and choose your school.', member.user.avatarURL)
      .addField('A list of schools:', getSchoolString())
      .setFooter("If you're having problems, please contact a moderator.");

    // Send the message.
    const message = await originalMessage.channel.send(embed);

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
      await assignOrCreateRole(memberRole, member);

      // Assign the roles to the user.
      if (school.disabled) return;

      await assignOrCreateRole(schoolRoleName, member, true);
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
