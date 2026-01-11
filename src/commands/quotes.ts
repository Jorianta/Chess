import { ApplicationCommandType, ApplicationCommandOptionType} from 'discord.js';
import {CommandConfig} from '../commands.js'

export const config: CommandConfig = {
    name: 'quotes', 
    description: 'Check server stats on quotes.', 
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'quoted-user',
        type: ApplicationCommandOptionType.User,
        description: 'See how often this user was quoted.',
        required: false
    },{
        name: 'clipping-user',
        type: ApplicationCommandOptionType.Integer,
        description: 'See how many times this user quoted someone.',
        required: false
    }]
};

export const execute = async (interaction) => {

    try{

    }
    catch (e) {
        console.error("Quotes encountered an error: " + e)
    }
}