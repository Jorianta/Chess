import { ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction} from 'discord.js';
import {CommandConfig} from '../commands.js'
import { tallyCitations } from '../data/citations.js';

export const config: CommandConfig = {
    name: 'count_citations', 
    description: 'Check server stats on citations.', 
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'quoted-user',
        type: ApplicationCommandOptionType.User,
        description: 'See how often this user was cited.',
        required: true
    }]
};

export async function execute(interaction: ChatInputCommandInteraction) {

    const DEFER = interaction.deferReply()

    const guild = interaction.guildId
    const quoted_user = interaction.options.getUser('quoted-user')

    const count = tallyCitations(guild, quoted_user.id)

    await DEFER;
    count.catch(error => {
        interaction.editReply("I ran into an issue...")
    }).then(count => {
        if(!count) return;

        interaction.editReply(`@${quoted_user.username} has been quoted ${count} times.`)
    })
}