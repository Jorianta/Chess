import { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction} from 'discord.js';
import {CommandConfig} from '../commands.js'
import { tallyQuotes } from '../data/quotes.js';

export const config: CommandConfig = {
    name: 'count_quotes', 
    description: 'Check server stats on quotes.', 
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'quoted-user',
        type: ApplicationCommandOptionType.User,
        description: 'See how often this user was quoted.',
        required: true
    }]
};

export async function execute(interaction: ChatInputCommandInteraction) {

    const DEFER = interaction.deferReply()

    const guild = interaction.guildId
    const quoted_user = interaction.options.getUser('quoted-user')

    const count = tallyQuotes(guild, quoted_user.id)

    await DEFER;
    count.catch(error => {
        interaction.editReply("I ran into an issue...")
    }).then(count => {
        if(typeof count !== 'number') {
            interaction.editReply("I ran into an issue...")
            return;
        }

        interaction.editReply(`<@${quoted_user.id}> has been quoted ${count} times.`)
    })
}