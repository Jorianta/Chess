import { ApplicationCommandType, ApplicationCommandOptionType, CommandInteraction, GuildMember, Snowflake, EmojiResolvable, parseEmoji, PartialEmoji, GuildFeature, Interaction, ChatInputCommandInteraction} from 'discord.js';
import {CommandConfig} from '../commands.js'
import e from 'express';

export const config: CommandConfig = {
    name: 'schedule', 
    description: 'Schedule an alert for an event.', 
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'date',
        type: ApplicationCommandOptionType.String,
        description: 'The date (MM/DD or MM/DD/YY, europoors.)',
        required: true
    }, {
        name: 'name',
        type: ApplicationCommandOptionType.String,
        description: 'Name of the event (MM/DD or MM/DD/YY, europoors.)',
        required: true
    }]
};

const date = new RegExp(/^(\d{2})\/(\d{2})$/)

const errorResponse = {content: "I had a lil error there..."}

export function execute(interaction: ChatInputCommandInteraction){
    try{
        const bdayStr = interaction.options.getString("date")

        const groups = date.exec(bdayStr)

        const month = parseFloat(groups[0])
        const day = parseFloat(groups[1])

        if(!(month && day)) {
            interaction.reply(errorResponse)
            return
        }

        // const success = storeDate(month, day)

        // if(!success) {
        //     interaction.reply(errorResponse)
        //     return
        // }

        

    } catch(e){
        console.error("Birthday submission encountered an error: ", e)
    }

}



function scheduleEvent(month: number, day:number, alertMessage: string, recurring: boolean = false): boolean{
    throw("unimplemented")
}