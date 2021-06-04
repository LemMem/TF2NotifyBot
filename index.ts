import * as Discord from 'discord.js';
import * as Config from './config.json';
import * as DBWrapper from './db-wrapper';

const client: Discord.Client = new Discord.Client();
let commands = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(Config.prefix) || message.author.bot) return;

	const args: string[] = message.content.slice(Config.prefix.length).trim().split(/ +/);
	const command: string = args.shift().toLowerCase();
  //I have to do this the shitty way and not the cool way because the dynamic stuff relys on javascript bs
  switch (command) {
    case 'bind':
      if (!args.length) {message.channel.send('You must provide the ID for the channel you wish to bind the bot to.'); break;}
      if(!message.member.permissions.has('ADMINISTRATOR')) {message.channel.send('You must have the Admin permission to bind the bot to a channel!'); break;}
      message.channel.send('Binding bot to that channel...');
      const guildID: string = message.guild.id;
      const channelID: string = args[0];
      DBWrapper.BindToChannel(channelID, guildID);
      message.channel.send('Done!');
      break;
    default:
      message.channel.send('That\'s not a valid command!');
      break;
  }
});

client.login(Config.token);
