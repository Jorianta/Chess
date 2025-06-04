import { ApplicationCommandType, ApplicationCommandOptionType, CommandInteraction, GuildMember, Snowflake, EmojiResolvable, parseEmoji, PartialEmoji, GuildFeature} from 'discord.js';
import {CommandConfig} from '../commands.js'
import e from 'express';

export const config: CommandConfig = {
    name: 'custom-role', 
    description: 'Create a role to customize your name color and emoji', 
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: 'color',
        type: ApplicationCommandOptionType.String,
        description: 'The hexcode color you want your name to be (include the #)',
        required: false
    }, {
        name: 'emoji',
        type: ApplicationCommandOptionType.String,
        description: 'The emoji you want attached to your name',
        required: false
    }]
};

export const execute = async (interaction: CommandInteraction<'cached'>) => {
    await interaction.deferReply({flags: ["Ephemeral"]})
    try{
        let color = interaction.options["getString"]('color')||null
        let emojiString = interaction.options["getString"]('emoji')||null

        if(!interaction.guild.features.includes("ROLE_ICONS"))
        {
            emojiString = null;
        }

        let hexexp = new RegExp(/^#[0-9A-F]{6}$/i)

        if(color!=null && !hexexp.test(color))
        {
            interaction.editReply("The string you provided for a color couldn't be interpreted.")
            return;
        }

        let emoji: PartialEmoji = emojiString!=null? parseEmoji(emojiString) : null

        let user = interaction.user
        let user_role = interaction.guild.roles.cache.find(r => r.name == user.username)

        
        if(!user_role)
        {
            console.log(`Creating new custom role for ${user.username}`)
            await interaction.guild.roles.create(
                {
                    color: color,
                    icon: emoji? emoji.id || emoji.name : null ,
                    hoist: true,
                    mentionable: false,
                    name: user.username,
                    permissions: [],
                    position: interaction.guild.members.me.roles.highest.position,
                    reason: "They asked nicely."
                }
            ).then(
            r => {
                try {
                    interaction.member.roles.add(r)
                }
                catch(e)
                {
                    console.error("Custom role could not add the role: " + e)
                }
            },
            e => {
                console.log(`Custom role encountered an error while creating a role for ${user.username}: ${e}`)
            })
            
            interaction.editReply("Enjoy your custom role!")
            return;
        }

        console.log(`Updating custom role for ${user.username}`)

        if(color) user_role.setColor(color).catch(e => console.error("Custom role encountered an error while setting th color: " + e))
        if(emoji) user_role.setIcon(emoji.id || emoji.name || null).catch(e => console.error("Custom role encountered an error while setting the icon: " + e))

        interaction.editReply("Enjoy your custom role!")

    }
    catch (e) {
        console.error("Custom role encountered an error: " + e)
        throw e
    }
}