import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

import { REST, Routes, Client, GatewayIntentBits, Collection } from 'discord.js';
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

client.commands = new Collection()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async() => {
const commandsToRegister = []
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
            client.commands.set(command.data.name, command);
            commandsToRegister.push(command.data.toJSON());
        }else{
            console.log(`The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
}
}


const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try{
    console.log('refreshing commands')
    if(process.env.GUILD_ID){
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commandsToRegister },
        )
    }else{
        await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commandsToRegister },
    );
    }
    

    
}catch(error) {
    console.error(error);
}

client.login(process.env.DISCORD_TOKEN)
})();

client.on('interactionCreate', async interaction => {
    const command = client.commands.get(interaction.commandName);
    try{
     await command.execute(interaction);   
    }catch(error) {
        console.error('Error handling interaction:', error);
    }
})
