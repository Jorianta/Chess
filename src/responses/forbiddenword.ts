import { Message } from "discord.js";
import { submitCitation } from "../data/citations";

export const filter = async (message: Message) => {
	if (! (message.content.toLowerCase().includes('vore')) ) return false;
	return true;
}

export const execute = async (message: Message) => {
	const id = message.guild?.id;

	try {
		id && console.log('Issuing citation:', 'https://discord.com/channels/'+id+'/'+message.channel.id+'/'+message.id);

		await message.reply({ content: "https://tenor.com/view/protocol-violated-vore-arstotzka-protocol-violated-gif-5689365621593841494"})

		id && submitCitation(id, message.author.id, "vore")
	} catch (e) {
		console.error("forbidden word encountered an error: " + e)
	}
}