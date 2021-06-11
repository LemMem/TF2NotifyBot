import * as Discord from 'discord.js';
import * as Config from './config.json';
import * as DBWrapper from './db-wrapper';
import * as Axios from 'axios';
const channels: string[] = [
	'rglgg',
	'kritzkast',
	'cappingtv',
	'cappingtv2',
	'teamfortresstv',
	'teamfortresstv2',
	'teamfortresstv3',
	'essentialstf',
]; //Feel free to PR for more channels
const previousChannelStatus: boolean[] = [
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false
]

async function isChannelLive(id: number) {
	const userToPoll = channels[id];
	const headers = {
			'Client-ID': Config.twitch,
			'Accept':    'application/vnd.twitchtv.v5+json'
	};
	const channel = await Axios.default(`https://api.twitch.tv/kraken/users?login=${userToPoll}`, {headers: headers});
	const channelID = channel.data.users[0]._id;
	const streamObject = await Axios.default(`https://api.twitch.tv/kraken/streams?channel=${channelID}`, {headers: headers});
	if(streamObject.data.streams.length === 0) return false;
	const streamStatus = streamObject.data.streams[0].stream_type;
	if (streamStatus === 'live') return true;
	else return false;

}

async function pollAllChannels() {
	for (let i = 0; i < channels.length; i++) {
		previousChannelStatus[i] = await isChannelLive(i);
	}
}

const client: Discord.Client = new Discord.Client();
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

async function sendMessagesFromPoll() {

}

//client.login(Config.token);
