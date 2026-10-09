import { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction} from 'discord.js';
import {CommandConfig} from '../commands.js'
import { tallyCitations } from '../data/citations.js';

export const config: CommandConfig = {
    name: 'count_citations', 
    description: 'Check server stats on citations.', 
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'cited-user',
        type: ApplicationCommandOptionType.User,
        description: 'See how often this user was cited.',
        required: true
    }]
};

export async function execute(interaction: ChatInputCommandInteraction) {

    const DEFER = interaction.deferReply()

    const guild = interaction.guildId
    const quoted_user = interaction.options.getUser('cited-user')

    const count = tallyCitations(guild, quoted_user.id)

    await DEFER;
    count.catch(error => {
        interaction.editReply("I ran into an issue...")
    }).then(count => {
        if(typeof count !== 'number') {
            interaction.editReply("I ran into an issue...")
            return;
        }

        interaction.editReply(`<@${quoted_user.id}> has been cited ${count} times.`)
    })
}