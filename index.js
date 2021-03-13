const Discord = require('discord.js');
const client = new Discord.Client();

function getToken() {
  var fs = require('fs');
  var token = fs.readFileSync('token.txt').toString();
  return token;
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'embed') {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Playlist saved correctly by ${msg.author.username}!`)
        .setThumbnail(msg.author.displayAvatarURL())
        .setColor(0x49d1cd)
        .addField("Name", "YHLQMDLG", true)
        .addField("Playlist ID", "1", true)
        .addField("URL", "https://www.youtube.com/playlist?list=PL8va0X5IHAfOfX2Hnnv42sTk_PpDRMFZ0")
        .setFooter("Use ::help command to see MOB's abilities.")
    msg.channel.send(embed);
        
    // msg.reply(msg.author.displayAvatarURL());
  }
});

client.login(getToken());
