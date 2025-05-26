import { MessageReaction, User } from 'discord.js';
import { glob } from 'glob';
import path from 'path';

const REACTIONS = {};

export function LoadReactions(client){

    client.once('ready', async c => {

        console.log("Loading Commands...")

        let reactionsList = [];
        let reactionFileList = glob.sync('./dist/src/reactions/*.js');

        for (let reactionPath of reactionFileList) {
            let reactionName = path.basename(reactionPath, '.js');

            let reaction;
            try { reaction = await import("./reactions/"+reactionName+".js"); }
            catch (err) {
                console.error('Failed to load reaction:', reactionName);
                console.error(err);
                continue;
            }

            if (!reaction.filter) { console.warn('reaction "' + reactionPath + '" has no filter export'); continue; }
            if (!reaction.execute) { console.warn('reaction "' + reactionPath + '" has no execute export'); continue; }
            if (!(reaction.execute.constructor.name == 'AsyncFunction')) console.warn('reaction "' + reactionPath + '" execute function is not async');
            reactionsList.push(reaction.config);
            REACTIONS[reactionName] = reaction;
            console.log('Loaded reaction:', reactionName);
        }
    });

    client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
        console.log('reaction added:', reaction.emoji.name, 'by', user.tag);

        // Ignore bot reactions
        if (user.bot) return;

        // Loop through reactions and check if any filter matches
        for (let reactionName in REACTIONS) {
            if (await REACTIONS[reactionName].filter(reaction, user)) {
                console.log('running reaction "' + reactionName + '"');
                try {
                    await REACTIONS[reactionName].execute(reaction, user);
                }
                catch (err) {
                    console.error(reactionName, 'encountered an error:', err);
                }
            } else {
                console.log('reaction "' + reactionName + '" filter failed');
            }
        }
    });

    client.on('messageReactionRemove', async (reaction, user) => {
        console.log('reaction removed:', reaction.emoji.name, 'by', user.tag);

        // Ignore bot reactions
        if (user.bot) return;

        // Loop through reactions and check if any filter matches
        for (let reactionName in REACTIONS) {

            if (!REACTIONS[reactionName].executeRemove) continue;

            if (await REACTIONS[reactionName].filter(reaction, user)) {
                console.log('running reaction "' + reactionName + '"');
                try {
                    await REACTIONS[reactionName].executeRemove(reaction, user);
                }
                catch (err) {
                    console.error(reactionName, 'encountered an error:', err);
                }
            } else {
                console.log('reactionRemove "' + reactionName + '" filter failed');
            }
        }
    });
}