import { Message } from "discord.js";
import { submitCitation } from "../data.js";

export const filter = async (message: Message) => {
	if (! (message.content.toLowerCase().includes('vore')) ) return false;
	return true;
}

export const execute = async (message: Message) => {
	try {
		console.log('Issuing citation:', 'https://discord.com/channels/'+message.guild.id+'/'+message.channel.id+'/'+message.id);

		await message.reply({ content: "https://tenor.com/view/protocol-violated-vore-arstotzka-protocol-violated-gif-5689365621593841494"})
		submitCitation(message.guild.id, message.author.id, "vore")
	} catch (e) {
		console.error("forbidden word encountered an error: " + e)
	}
}