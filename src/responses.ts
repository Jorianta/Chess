import { REST } from '@discordjs/rest';
import {glob} from 'glob';
import { Client } from 'discord.js';
import path from 'path';
const RESPONSES = {};

export function LoadResponses(client: Client)
{
    client.once('ready', async c => {
        let responsesList = [];
        let responseFileList = glob.sync('./dist/src/responses/*.js');

        for (let responsePath of responseFileList) {
            let responseName = path.basename(responsePath, '.js');

            let response;
            try { response = await import("./responses/"+responseName+".js");} 
            catch (err) {
                console.error('Failed to load response:', responseName);
                console.error(err);
                continue;
            }

            if (!response.filter) {console.warn('response "'+responsePath+'" has no filter export'); continue;}
            if (!response.execute) {console.warn('response "'+responsePath+'" has no execute export'); continue;}
            if (!(response.execute.constructor.name == 'AsyncFunction')) console.warn('response "'+responsePath+'" execute function is not async');
            responsesList.push(response.config);
            RESPONSES[responseName] = response;
            console.log('Loaded response:', responseName);
        }
    });

    client.on('messageCreate', async message => {
        
        if (message.author.bot) return;
        if (!message.guild) return;

        //loop through responses and check if any filter
        for (let responseName in RESPONSES) {
            if (await RESPONSES[responseName].filter(message)) {
                console.log('running response "'+responseName+'"');
                try {
                    await RESPONSES[responseName].execute(message); 
                }
                catch (err) {
                    console.error(responseName, 'encountered an error:', err);
                }
            }
        }
    });
}