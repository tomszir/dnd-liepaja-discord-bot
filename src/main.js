const Client = require('@/libs/Client');
const config = require('@config');
const client = new Client();

/*
ADD SECRET FEATURE "SHUT UP FANDANGO"
*/

client.login(config.discord.token);
