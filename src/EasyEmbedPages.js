const Discord = require('discord.js');

//the string chunking function
const chunk = (array, chunkSize = 0) => {
    if (!Array.isArray(array)) throw new Error('First Parameter must be an array');
    return array.reduce((previous, current) => {
        let chunk;
        if (previous.length === 0 || previous[previous.length - 1].length === chunkSize) {
            chunk = [];
            previous.push(chunk);
        } else {
            chunk = previous[previous.length - 1];
        }
        chunk.push(current);
        return previous;
    }, []);
}


module.exports = class EasyEmbedPages {

    /**
     * 
     * @param {Discord.TextChannel} channel 
     * @param {Object} data 
     * @param {Function} pageGen - to change embed using a function
     */
    constructor(channel,data = {},pageGen = function(){}){
        this.allowedReactions = ['⏪','⬅️','➡️','⏩','⏹️']; //all reactions... changing anything would break the module

        this.channel = channel instanceof Discord.TextChannel ? channel : null; //the channel in which we will send the embeds

        this.allowStop = data.allowStop || true; //if we want the stop emoji '⏹️' to stop the interactive process
        this.time = data.time || null; //idle time to stop the interactive process

        this.pages = []; //embed pages... automagically generated xD
        this.page = 0; //currect page number

        this.dataPages = data.pages || []; //page data for extra configuration

        this.color = data.color || null; //embed color
        this.url = data.url || null; //embed url
        this.title = data.title || null; //embed title
        this.author = data.author || null; //embed author object
        this.footer = data.footer || null; //embed footer object
        this.thumbnail = data.thumbnail || null; //embed thumbnail
        this.image = data.image || null; //embed large image
        this.description = data.content || data.description || ""; //the content to be presented dynamically

        this.pageGen = pageGen; //the function to customize embeds
    }

    /**
     * The magic function which generates the embeds
     */
    generatePages(){
        let text = this.description.split("");
        let great = text.length > 2000 ? Math.floor(text.length/2000) : false;
        let array = great ? chunk(text,2000) : [text];
        let x = Math.max(array.length,this.dataPages.length);

        this.pages = [];

        for(let index = 0; index < x; index++) {
            const data = {};

            data.fields = [];

            if((this.dataPages[index] && this.dataPages[index].color) || this.url) data.color = this.dataPages[index] && this.dataPages[index].color ? this.dataPages[index].color : this.color;

            if((this.dataPages[index] && this.dataPages[index].url) || this.url) data.url = this.dataPages[index] && this.dataPages[index].url ? this.dataPages[index].url : this.url;

            if((this.dataPages[index] && this.dataPages[index].title) || this.title) data.title = this.dataPages[index] && this.dataPages[index].title ? this.dataPages[index].title : this.title;

            if((this.dataPages[index] && this.dataPages[index].author) || this.author) data.author = this.dataPages[index] && this.dataPages[index].author ? this.dataPages[index].author : this.author;

            if((this.dataPages[index] && this.dataPages[index].footer) || this.footer) data.footer = this.dataPages[index] && this.dataPages[index].footer ? this.dataPages[index].footer : this.footer;

            else data.footer = {text:`Page ${index + 1} of ${x} page${x > 1 ? 's' : ''}`};

            if((this.dataPages[index] && this.dataPages[index].thumbnail) || this.thumbnail) data.thumbnail = this.dataPages[index] && this.dataPages[index].thumbnail ? this.dataPages[index].thumbnail : this.thumbnail;

            if((this.dataPages[index] && this.dataPages[index].image) || this.image) data.image = this.dataPages[index] && this.dataPages[index].image ? this.dataPages[index].image : this.image;

            if(this.dataPages[index] && (this.dataPages[index].description || this.dataPages[index].content)){
                data.fields.push({name: "‎\u200b",value: this.dataPages[index].description || this.dataPages[index].content, inline: false});
            }

            if(this.dataPages[index] && this.dataPages[index].fields) {
                this.dataPages[index].fields.map((x) => {
                    data.fields.push({name: x.name || "\u200b" , value: x.value || "\u200b" ,inline: x.inline || false});
                });
            }

            if(array[index]){
                let i = array[index].join("");
                if(index < great) i = `${i}...`;
                else i = `...${i}`;
                data.description = i;
            } 

            const embed = new Discord.MessageEmbed(data);

            this.pageGen(embed);

            this.pages.push(embed);
        };
    }

    /**
     * Function used to start the dynamic embed
     * Note- Do not await this function... it would never resolve... (can resolve after idle time expires)
     * 
     * @param {Object} options 
     * @param {Discord.Channel} options.channel
     * @param {Discord.User} options.user
     * @param {Number} page 
     */
    async start(options = {},page = 0){
        this.page = page;

        if(options instanceof Discord.Channel) options = {channel: options};
        else if (typeof options !=='object' || options === null) options = {};
        let condition;

        if(options.allowStop) this.stop = options.allowStop;
        if(options.time) this.time = options.time;

        if(this.allowStop == false) this.allowedReactions.pop();

        if(options.user) condition = (reaction, user) => {
            return user.id == options.user.id && this.allowedReactions.includes(reaction.emoji.name);
        }
        else condition = (reaction) => {
            return this.allowedReactions.includes(reaction.emoji.name);
        }

        if(options.channel instanceof Discord.TextChannel) this.channel = options.channel;  
        if(!this.channel instanceof Discord.TextChannel) throw new Error("No text channel specified!");

        this.generatePages();

        if(this.page > this.pages.length) throw new Error("Page number greater than total pages!");
        
        this.message = await this.channel.send(this.pages[this.page]);

        await Promise.all(this.allowedReactions.map(async (reaction) => await this.message.react(reaction)));
        this.collector = this.message.createReactionCollector(condition,{dispose: true, idle: this.time});
        this.collector.on('collect',this._handleReaction.bind(this));
        this.collector.on('remove',this._handleReaction.bind(this));
        this.collector.once('end',() => {
            this.message.reactions.removeAll();
        })
    }

    /**
     * Reaction handing function - the function which does the magic of changing the embed!
     * @param {Discord.MessageReaction} reaction 
     * @param {Discord.User} user 
     */
    async _handleReaction (reaction,user) {
        if(reaction.emoji.name === this.allowedReactions[0]){
            this.page = 0;
            this.message.edit(this.pages[0]);
        }
        else if(reaction.emoji.name === this.allowedReactions[1]){
            if(this.page>0) --this.page;
            this.message.edit(this.pages[this.page]);
        }
        else if(reaction.emoji.name === this.allowedReactions[2]){
            if(this.page<this.pages.length-1) ++this.page;
            this.message.edit(this.pages[this.page]);
        }
        else if(reaction.emoji.name === this.allowedReactions[3]){
            this.page = this.pages.length-1;
            this.message.edit(this.pages[this.pages.length-1]);
        }
        else if(this.allowStop && reaction.emoji.name === this.allowedReactions[4]){
            this.collector.stop('User Requested');
        }
        return;
    }
}