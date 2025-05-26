import { GuildChannel, MessageFlags, MessageReaction, User } from 'discord.js';
import CONFIG from '../config.js';
import client from '../client.js';
import { log } from 'console';

// this should only work when a user reacts with a camera emoji to a message by someone else outside of quote channels
export const filter = async (reaction: MessageReaction, user: User) => {
	// reaction is not a camera
	if (reaction.emoji.name !== '📸') return false;
    // avoid requoting
    if(reaction.message.reactions.cache.find(reaction => (reaction.emoji.name === '📸'))) return false;
	// no self clipping or bot clipping
	if ((!reaction.message.author) || reaction.message.author.bot || reaction.message.author.id == user.id) return false;
    // no quoting quotes
    let quoteChannel = CONFIG.findQuoteChannel(reaction.message.guild)
    if (!quoteChannel || reaction.message.channel === quoteChannel) return false;

	return true;
}

export const execute = async (reaction: MessageReaction, user: User) => {
    try{
        console.log('quoting message ', reaction.message.id);

        //put on our own camera. This will prevent us from requoting
        reaction.message.react('📸')

        const quoteChannel = CONFIG.findQuoteChannel(reaction.message.guild);
        if(quoteChannel == null) return; 
        
        const channel: string = (reaction.message.channel as GuildChannel).id
        const author: User = reaction.message.author 
        const text: string = reaction.message.content
        const link: string = reaction.message.url
        
        quoteChannel.send({
        content: "Quoth <@"+author+"> in <#"+ channel+">:",
        embeds:[{
        description: text 
        +"\n\nClipped by <@"+user+">"+
        "\nOriginal Message: "+ link}]})
        
    } catch (e) {
        log(e)
    }
}

export const executeRemove = async (reaction: MessageReaction) => {
	
}