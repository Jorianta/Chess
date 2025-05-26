import {store} from 'data-store'
import { quote, User } from 'discord.js';

class QuoteData
{
    private store: store = new store({ path: __dirname+'/data/quoteStats.json' });


    constructor(){

    }

    public submitQuote(quoted: User, clipper: User)
    {
        let year = new Date().getFullYear()

        let quotedId = quoted.id
        let clipperId = clipper.id

        if(store.has('clips.'+year+'.'+clipperId)){
            let clips = store.get('clips.'+year+'.'+clipperId)
            store.set('clips.'+year+'.'+clipperId, clips+1)
        }
        else store.set('clips.'+year+'.'+clipperId, 1)

        if(store.has('quotes.'+year+'.'+quotedId)){
            let quotes = store.get('quotes.'+year+'.'+quotedId)
            store.set('quotes.'+year+'.'+quotedId, quotes+1)
        }
        else store.set('quotes.'+year+'.'+quotedId, 1)
    }
}

const QUOTEDATA: QuoteData = new QuoteData()
export default QUOTEDATA
