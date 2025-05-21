import { ApplicationCommandType, ApplicationCommandOptionType} from 'discord.js';
import {CommandConfig} from '../commands.js'

export const config: CommandConfig = {
	name: 'd', 
	description: 'Roll a die/dice.', 
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: 'sides',
		type: ApplicationCommandOptionType.Integer,
		description: 'The number of sides on the die',
		required: true
	},{
        name: 'rolls',
        type: ApplicationCommandOptionType.Integer,
        description: 'The number of dice to roll (default 1)',
        required: false
    },{
        name: 'secret',
        type: ApplicationCommandOptionType.Boolean,
        description: 'Hides the results from everyone else.',
        required: false
    }]
};

export const execute = async (interaction) => {
	await interaction.deferReply();

    let sides = interaction.options.getInteger('sides')
    let rolls = interaction.options.getInteger('rolls')||1
    let secret = interaction.options.getBoolean('secret')||false

    if(rolls<=0 || sides<=1)
    {
        interaction.editReply({ content: "Dice need to have at least 2 sides, and you need to roll at least 1 die!", ephemeral: true })
        return;
    }

    if(rolls>=100)
    {
        await interaction.editReply({ content: "You're asking a lot. Please roll less than 100 dice!", ephemeral: true })
        return;
    }

    let results: number[] = []
    let sum: number = 0

    for(let i=0; i<rolls; i++)
    {
        let r = await Math.floor(Math.random()*sides)+1
        sum+=r
        await insertSorted(r, results)
    }

    await interaction.editReply({embeds:[{
        title:"Results",
        description: "**Numbers Rolled: **"+ results +
        "\n**Highest: **"+ results[0] + 
        "\n**Lowest: **"+ results[results.length-1] +
        "\n**Sum: **: " + sum}]
        , ephemeral: secret})
}

function insertSorted(num: number, arr: number[])
{
    if(arr.length===0)
    {
        arr[0]=num; return;
    }

    let i;
    for(i=0; i<arr.length; i++)
    {
        if(num>=arr[i])
        {
            break;
        }
    }
    arr.splice(i,0, num)
}