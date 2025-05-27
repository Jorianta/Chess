import { GuildChannel, MessageFlags, MessageReaction, TextChannel, User } from 'discord.js';
import CONFIG from '../config.js';
import client from '../client.js';
import { log } from 'console';
import { submitQuote } from '../data.js';

// this should only work when a user reacts with a camera emoji to a message by someone else outside of quote channels
export const filter = async (reaction: MessageReaction, user: User) => {
	// reaction is not a camera
	if (reaction.emoji.name !== '📸') return false;
    console.log("camera")
    // avoid requoting
    if(reaction.message.reactions.cache.find(reaction => (reaction.emoji.name === '📸' && reaction.me))) return false;
    console.log("fresh quote")
	// no self clipping or bot clipping
	if ((!reaction.message.author) || reaction.message.author.bot || reaction.message.author.id == user.id) return false;
    console.log("not self")
    // no quoting quotes
    let quoteChannel = CONFIG.getQuoteChannelId(reaction.message.guild.id)
    if (reaction.message.channel.id === quoteChannel) return false;
    console.log("valid channel")

	return true;
}

export const execute = async (reaction: MessageReaction, user: User) => {
    try{
        console.log('quoting message ', reaction.message.id);

        //put on our own camera. This will prevent us from requoting probably hopefully
        reaction.message.react('📸')

        const quoteChannel = await CONFIG.findQuoteChannel(reaction.message.guild);
        if(quoteChannel == null || !(quoteChannel instanceof TextChannel))
        {
            console.error(`Guild ${reaction.message.guild.name} has no text channel named ${CONFIG.quoteChannel} for quotes, or it no longer exists.`)
            return; 
        }
        
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

        submitQuote(reaction.message.guildId,author.id,user.id)
        
    } catch (e) {
        console.error("quoting encountered an error: " + e)
    }
}

export const executeRemove = async (reaction: MessageReaction) => {
	
}