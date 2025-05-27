
import Store from "data-store"
import { read, readFileSync } from "fs";
import { ContainerComponent, Guild, Channel } from "discord.js";
import { log } from "./logging.js";
import client from "./client.js";

console.log("Loading Config...")

class BotConfig {

    //May want to move the CONFIG.json closer to here
    private store: Store

    private _botName: string
    private _debug: boolean
    private _logEvents: boolean
    private _emojiTimeout: number
    private _token: string
    private _quoteChannel: string

    private _dbhost: string
    private _quoteChannels: {[key: string]: string} = {};

    constructor()
    {
        //I cant figure out why, but relative file names are based on the rootdir in tsconfig
        this.store = new Store({ path: './dist/CONFIG.json' });
        const config = this.store.data

        //make sure token is configured
        if (!config.token || config.token == 'PASTE YOUR TOKEN HERE' || config.token == '') {
        
            this.token = 'PASTE YOUR TOKEN HERE';

            console.log("The bot Token was unconfigured")
        
            process.exit(1);
        }
        
        try{
            this._botName=config.botName||"Chess"
            this._debug=config.debug||false
            this._logEvents=config.logEvents||false
            this._emojiTimeout=config.emojiTimeout||10
            this._token = config.token
            this._quoteChannel = config.quotesChannel||"quotes"
            this._dbhost = config.dbHost||"localhost"
        }
        catch(e)
        {
            log(e)
        }
    }

    public get botName()
    {
        return this._botName
    }

    public get debug()
    {
        return this._debug
    }

    public get logEvents()
    {
        return this._logEvents
    }

    public get emojiTimeout()
    {
        return this._emojiTimeout
    }

    public get dbHost()
    {
        return this._dbhost
    }

    public set token(token: string)
    {
        this._token = token
        this.store.set('token', token)
    }

    public get token()
    {
        return this._token
    }

    public findQuoteChannel(guild: Guild): Promise<Channel> | null
    {
        
        if(this._quoteChannels[guild.id])
        {
            return client.channels.fetch(this._quoteChannels[guild.id])
        }

        else return null
    }

    public getQuoteChannelId(guildId: string): string | null
    {
        if(this._quoteChannel[guildId])
        {
            return this._quoteChannels[guildId]
        }

        return null;
    }

    public saveQuoteChannel(guildId: string, channelId: string)
    {
        this._quoteChannels[guildId] = channelId;
    }

    public set quoteChannel(channelName: string)
    {
        this._quoteChannel = channelName;
        this.store.set('quoteChannel', channelName)
    }

    public get quoteChannel()
    {
        return this._quoteChannel
    }
}

const CONFIG: BotConfig = new BotConfig()
export default CONFIG