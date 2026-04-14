import { Message } from "discord.js";
import { rollDice } from "../utility/dice";

const DICE_ROLL = /^!(?<rolls>\d+)d(?<sides>\d+)(?<secret>\?)?$/

export const filter = async (message: Message) => {
    if (! (DICE_ROLL.test(message.content)) ) return false;
    return true;
}

export const execute = async (message: Message) => {
    const id = message.guild?.id

    try {
        id && console.log('Issuing citation:', 'https://discord.com/channels/'+id+'/'+message.channel.id+'/'+message.id);


        const result = message.content.match(DICE_ROLL)?.groups

        if(!result) return

        const rolls = parseFloat(result['rolls'])
        const sides = parseFloat(result['sides'])
        const secret = !!result['secret']

        if(rolls<=0 || sides<=1)
        {
            await message.reply({ content: "Dice need to have at least 2 sides, and you need to roll at least 1 die!", ephemeral: true } as any)
            return;
        }
        if(rolls>=100)
        {
            await message.reply({ content: "You're asking a lot. Please roll less than 100 dice!", ephemeral: true } as any)
            return;
        }

        const [results, sum] = rollDice(rolls, sides)

        await message.reply(({embeds:[{
            title:"Results",
            description: "**Numbers Rolled: **"+ results +
            "\n**Highest: **"+ results[0] + 
            "\n**Lowest: **"+ results[results.length-1] +
            "\n**Sum: **: " + sum}]
            , ephemeral: secret} as any))
        
    } catch (e) {
        console.error("dice roll encountered an error: " + e)
    }
}