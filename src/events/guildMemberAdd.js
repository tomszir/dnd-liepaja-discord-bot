const Util = require('@/utils/Util');

// TODO: Implement by-guild based system (getting this from a database, based on guild).
const welcomeChannelName = 'welcome';

module.exports = client => {
  return async member => {
    const guild = member.guild;
    const channel = guild.channels.find(c => c.name === welcomeChannelName);

    if (!channel) return;

    const avatarPrimaryColor = Util.getPrimaryColorOfImageFromUrl(member.user.avatarURL);
    const embed = new RichEmbed()
      .setColor(avatarPrimaryColor)
      .setAuthor(`${member.user.username} has joined the server!`, member.user.avatarURL);

    channel.send(embed);
  };
};
