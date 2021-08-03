const Discord = require('discord.js');
const client = new Discord.Client();
const mongoProvider = require('./mongo_provider');

function getToken() {
  var fs = require('fs');
  var token = fs.readFileSync('token.txt').toString();
  return token;
}

// connnect to mongo atlas
mongoProvider.startMongo();

// commands prefix
const prefix = '::'

// Embed build functions
function errorSaveEmbed(title) {
  return embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription("The *::save* command requires the following structure:")
    .addField('Command', '::save', true)
    .addField('Playlist name', 'Example', true)
    .addField('Playlist URL', 'www.example.com', true)
    .setColor(0xff0000);
}

function errorDeleteEmbed(title) {
  return embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setDescription("The *::delete* command requires the following structure:")
    .addField('Command', '::delete', true)
    .addField('Playlist ID', 'id_number', true)
    .setColor(0xff0000);
}

function saveEmbed(username, avatarUrl, pl_name, id_num, pl_url) {
  return embed = new Discord.MessageEmbed()
    .setTitle(`Playlist saved correctly by ${username}!`)
    .setThumbnail(avatarUrl)
    .setColor(0x49d1cd)
    .addField("Playlist name", pl_name, true)
    .addField("Playlist ID", id_num, true)
    .addField("URL", pl_url)
    .setFooter("Use ::help command to see MOB's abilities.")
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if(msg.content === "::help") {
    msg.channel.send(
      new Discord.MessageEmbed()
        .setTitle("List of MOB's commands")
        .addField("Command", "::show\n\n::save\n\n::delete",true)
        .addField("Parameter 1", "~~None~~\n\nPlaylists name\n\nID", true)
        .addField("Parameter 2", "~~None~~\n\nPlaylists URL\n\n~~None~~", true)
        .setFooter("Doubts and suggestions to: raulcepedac@hotmail.com")
        .setColor(0x00ffff)
    );
  }
})

client.on('message', async msg => {
  if(msg.content === '::show') {
    const results = await mongoProvider.fetch(msg.guild.id);
    // console.log(results);
    if(results == null) {
      msg.channel.send(new Discord.MessageEmbed()
        .setTitle('No playlists saved yet')
        .setDescription("Use the *::save* command to save a playlist")
        .setColor(0x00ffff)
        .setFooter("Use ::help command to see MOB's abilities.")
      );
    } else {
      const fetchResults = await mongoProvider.fetch(msg.guild.id);
      const fetchedPlaylists = fetchResults.playlists;
      console.log(fetchedPlaylists.length > 0);
      if(fetchedPlaylists.length > 0) {
        var playlistsString = '';
        fetchedPlaylists.forEach((pl) => {
          playlistsString += "{ #" + pl.id_num + "  ["  + pl.name + "]  " + pl.url + " }\n";
        });
        console.log(playlistsString);      
          (await msg.channel.send("**Saved playlists:**\n*ID*\t\t*Name*\t\t\t\t*URL*```css\n" + playlistsString + "```")).react('❤️');
      } else {
        msg.channel.send(new Discord.MessageEmbed()
          .setTitle('No playlists saved yet!')
          .setDescription('You can use the *::save* command to save playlists.')
          .setColor(0xff0000)
        );
      }
    }
  }
});

client.on('message', async msg => {
  
  if(!msg.content.startsWith('::save')) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
  if(args.length < 3) {
    msg.channel.send(errorSaveEmbed("Missing arguments"));
  } else if (args.length > 3) {
    msg.channel.send(errorSaveEmbed("Unused arguments"));
  }
  else {
    const server_id = msg.guild.id;
    const pl_name = args[1];
    const pl_url = args[2];
    
    const saveResults = await mongoProvider.save(server_id, pl_name,pl_url);
    console.log(saveResults)
    if(saveResults == null) {
      return;
    } else {
      msg.channel.send(saveEmbed(msg.author.username, msg.author.displayAvatarURL(), pl_name, saveResults.id_num, pl_url))
    }
    // console.log(`name: ${args[1]}, url: ${args[2]}, server_id: ${msg.guild.id}`);
  }
  
});

client.on('message', async msg => {
  if(!msg.content.startsWith('::delete')) return;
  const args = msg.content.slice(prefix.length).trim().split(' ');
  if(args.length < 2) {
    msg.channel.send(errorDeleteEmbed("Missing arguments"));
  } else if (args.length > 2) {
    msg.channel.send(errorDeleteEmbed("Unused arguments"));
  } else {
    const id_num = parseInt(args[1]);
    
    const deleteResults = await mongoProvider.remove(msg.guild.id, id_num);
    if(deleteResults) {
      msg.channel.send(new Discord.MessageEmbed()
        .setTitle(`Playlist deleted correctly by ${msg.author.username}`)
        .setThumbnail(msg.author.displayAvatarURL())
        .setColor(0xff0000)
      );
      
    }
  }
})

client.on('message', async msg => {
  if(!msg.content.startsWith('::random')) return;
  try {
    const fetchResults = await mongoProvider.fetch(msg.guild.id); 
    const count = fetchResults.count
    randomIndex = Math.floor(Math.random()  * count)
    const playlist = fetchResults.playlists[randomIndex]
    const playlistNum = playlist.id_num
    const playlistName = playlist.name
    const playlistURL = playlist.url
    const playlistString = "{ #" + playlistNum + "  ["  + playlistName + "]  " + playlistURL + " }\n";
    (await msg.channel.send("**Saved playlists:**\n*ID*\t\t*Name*\t\t\t\t*URL*```css\n" + playlistString + "```")).react('❤️');
  } catch (error) {
    console.log(error)
  }
  

})


client.login(process.env.DISCORD_TOKEN);
// client.login(getToken());

