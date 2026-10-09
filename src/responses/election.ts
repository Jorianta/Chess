import { Message } from "discord.js";
import { submitCitation } from "../data/citations.js";

export const END = new Date("2026-05-01").getTime()

export const ELECTION_REGEX = /election|vote/i
const WEEF_REGEX = /weith|weef|bec/i
const HAPPY_REGEX = /happy|smiles|bag/

const template = /\${NAME}/g

const pro_braq = ["If I had a vote, I'd vote Braq!", "You should vote braq I think.", 
    "Braquen is the best choice for the election!", "Once you go Braq you never go back!", 
    "Happy is alright I guess, not as cool as Braq tho", "Braq has statistically hit more Fortnite clips than any other candidate."]

const antiGeneric = [ "${NAME}? No thanks!", "A vote for ${NAME} is a vote for cronyism!", "${NAME} No, Braq yes!", 
    "${NAME} shot Scrappy-doo in Miami.", "I heard ${NAME} immigrated from the NOP server.", "If ${NAME} wins, I'll have to do something drastic..."]
const anti_weef =["I heard Weith has a crippling addiction to Ven-bits...", "Weith is robo-phobic!"]
const anti_hap = ["Happy is from California, nuff said.", "I wouldn't be HAPPY with a BAG in office!", "Sr. Happy? More like Sr. Crappy!"]

export const filter = async (message: Message) => {
    return (Date.now()<END) && ELECTION_REGEX.test(message.content)
}

export const execute = async (message: Message) => {
    const content = message.content
    let response = ""
    if(WEEF_REGEX.test(content)){
        response = arrayPropoganda(antiGeneric.concat(anti_weef), "Weith")
    }
    else if(HAPPY_REGEX.test(content)){
        response = arrayPropoganda(antiGeneric.concat(anti_hap), "Happy")
    }
    else {
        response = arrayPropoganda(pro_braq, "Braquen")
    }

    await message.reply({ content: response})
}

function arrayPropoganda(array: string[], name: string){
    let idx = Math.floor(Math.random()*array.length)
    let r = array[idx]

    return r.replace(template, name)
}