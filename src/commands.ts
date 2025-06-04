import { REST } from '@discordjs/rest';
import { Routes as DiscordRestRoutes } from 'discord-api-types/v9';
import {glob} from 'glob';
import { ApplicationCommandType, BaseInteraction, Client, CommandInteraction, Interaction } from 'discord.js';
import path from 'path';
import CONFIG from "./config.js"
import { log } from './logging.js';

const COMMANDS: {[id: string]: Function} = {};

export interface Command {
	config: CommandConfig
	execute: (interaction: CommandInteraction) => void

}

export interface CommandConfig {
	name: string
	description: string
	type: ApplicationCommandType
	options?: any
}

// Stolen from Lospec Discord bot//
export function LoadCommands(client: Client)
{

	const rest = new REST({ version: '9' }).setToken(CONFIG.token);

	client.once('ready', async c => {

		console.log("Loading Commands...")

		let commandsList: CommandConfig[] = [];
		//Still cant figure out relative pathing with node.
		let commandFileList = glob.sync('./dist/src/commands/*.js');

		console.log(commandFileList)

		for (let commandPath of commandFileList) {
			let commandName = path.basename(commandPath, '.js');
			let command: Command;

			
			try { command = await import("./commands/"+commandName+".js"); }
			catch (err) {
				console.error('Failed to load command:', commandName);
				console.error(err);
				continue;
			}

			if (!command.config) {console.warn('⚠ Command "'+commandPath+'" has no config export'); continue;}
			if (!command.execute) {console.warn('⚠ Command "'+commandPath+'" has no execute export'); continue;}
			if (!(command.execute.constructor.name == 'AsyncFunction')) console.warn('command "'+commandPath+'" execute function is not async');
			
			commandsList.push(command.config);
			COMMANDS[command.config.name] = command.execute;
			console.log('Loaded command:', '/'+command.config.name);
		}

		if (commandsList.length == 0) return console.warn('No commands found');

		
		client.guilds.cache.forEach(guild => {
			if(!client.user) return;
			console.log('Joined server:', guild.name);
			rest.put(DiscordRestRoutes.applicationGuildCommands(client.user.id,guild.id), {body: commandsList})
				.then(e => console.log('Added commands to "'+guild.name+'" guild'))
				.catch(err=> console.error('Failed to add commands to "'+guild.name+'" guild'+ err));
		});
	});

	client.on('interactionCreate', async (interaction: BaseInteraction) => {
		if (!interaction.isCommand()) return;
		console.log('/'+ interaction.commandName, 'triggered');

		let command = interaction.commandName;
		let subcommand = interaction.isChatInputCommand() ? interaction.options.getSubcommand(false) : null;
		
		let commandName = command;
		if (subcommand) commandName += '.'+subcommand;
		
		if (!COMMANDS[commandName]) return console.warn('command "'+commandName+'" not found');

		try { 
			console.log('running command "'+commandName+'"');
			await COMMANDS[commandName](interaction as CommandInteraction); 
		}
		catch (err) {
			console.error('/'+commandName, 'encountered an error:', err);
			if (interaction.deferred || interaction.replied) 
			{
				interaction.deleteReply()
				await interaction.followUp({content: 'Failed to run command: \n\n```'+err+'```', ephemeral: true});
			}
			else await interaction.reply({content: 'Failed to run command: \n\n```'+err+'```', ephemeral: true});
		}
	});
}