import { Message } from "discord.js";
import { submitCitation } from "../data/citations.js";
import { ELECTION_REGEX, END } from "./election.js";

const WEEF_REGEX = /weith|weef|bec/i
const HAPPY_REGEX = /happy|smiles|bag/

const messages = [ "${NAME}? No thanks!", "A vote for ${NAME} is a vote for cronyism!", "${NAME} No, Braq yes!", "${NAME} shot Scrappy-doo in Miami."]
const weef = ["I heard Weith has a crippling addiction to Ven-bits...", "Weith is robo-phobic!"]
const happy = ["Happy is from California, nuff said.", "I wouldn't be HAPPY with a BAG in office!"]

export const filter = async (message: Message) => {
    return (Date.now()<END) && ELECTION_REGEX.test(message.content) && (WEEF_REGEX.test(message.content) || HAPPY_REGEX.test(message.content))
}

export const execute = async (message: Message) => {

    if(Math.random() > 0.3){

    }

    let idx = Math.floor(Math.random()*messages.length)
    let r = messages[idx]
    await message.reply({ content: r})
}

function candidateSpecific(){

}