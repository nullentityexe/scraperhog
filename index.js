import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

import { REST, Routes, Client, GatewayIntentBits } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
 

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async() => {
const commands = []
const foldersPath  = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = pathToFileURL(filePath)
        const command = await import(fileUrl);
        if('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        }else{
            console.log(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
}
}


const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try{
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
    );

    if(process.env.GUILD_ID){
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        )
    }
}catch(error) {
    console.error(error);
}

client.login(process.env.DISCORD_TOKEN)
})();



client.on("messageCreate", async (message) => {

if(!message.author.bot){
    message.reply("Hey there!")
}
})

