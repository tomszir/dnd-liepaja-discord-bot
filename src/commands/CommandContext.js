const rgbHex = require('rgb-hex');
const Discord = require('discord.js');
const { getColorFromURL } = require('color-thief-node');

module.exports = class CommandContext {
  constructor(client, message) {
    if (!(client instanceof Discord.Client))
      throw Exception('CommandContext client must be an instance of Discord.Client.');
    if (!(message instanceof Discord.Message))
      throw Exception('CommandContext message must be an instance of Discord.Message');

    this.client = client;
    this.message = message;
  }

  get author() {
    return this.message.author;
  }

  get member() {
    return this.message.member;
  }

  get channel() {
    return this.message.channel;
  }

  async getAvatarPrimaryColor() {
    const avatarRGBColor = await getColorFromURL(this.author.avatarURL);
    return rgbHex(...avatarRGBColor);
  }
};
