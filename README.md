# EasyEmbedPages
### A fully customizable and module for easy interactive discord embeds with dynamic pages!

This module is used to make *hassle-free* embeds with different pages... This module is **fully customizable** and each property of each page can be changed!
The description of the embed gets dynamically carried over to a different page if it exceed **2000 characters**


# Installation
```bash
npm i easy-embed-pages
```
# Usage
```js
const EasyEmbedPages = require('easy-embed-pages');
```
# Examples
### Basic simple usage
Note: Content greater than 2000 characters gets transferred to the next embed page!
```js
const embed = new EasyEmbedPages(message.channel, {
    // Here you can add anything **except embed fields** that can be added in a regular discord embed in json format
    color: '#ff00ff',
    url:'https://example.com',
    title: "Simple Embed",
    description: "insert long text here"
});

embed.start(); // sends the embed in the specified channel and starts the interactive process
```

### Using custom fields and other things for each page
Note: If you specify pages in pages which are more than the dynamic content pages, they will be added as extra pages!
```js
const embed = new EasyEmbedPages(message.channel, {
    pages: [
        {
            fields: [
                {
                    name: "Custom field yay!",
                    value: "Yikes... I love this module!",
                    inline: false
                }
            ]
        },
        {
            title: "This page has a custom title!",
            description: "And a custom description field too!"
        }
    ],
    color: '#ff00ff',
    url: 'https://example.com',
    title: "Simple Embed",
    description: "insert long text here"
});

embed.start();
```
### Using premade embeds
Note: You can use you premade Discord#MessageEmbed this way
```js
/*
const myEmbed1 = new Discord.MessageEmbed();
const myEmbed2 = new Discord.MessageEmbed();
*/

const embed = new EasyEmbedPages(message.channel, {
    pages: [
        myEmbed1.toJSON(),
        myEmbed2.toJSON()
    ],
});

embed.start();
```

### Advanced Usage
Full cranked up usage!
```js
const embed = new EasyEmbedPages(message.channel, {
    //embed fields
    pages: [
        {
            title: "Hello World!",
            color: "#00ffff",
            author: {
                name: "Jaguar"
            }
        }, 
        {
            fields: [
                {
                    name: "My field",
                    value: "My value",
                    inline: true
                }
            ],
            thumbnail: "https://example.com/my_other_image.png"
        }
    ],
    color: 'RANDOM', // here you can fill any Discord Color, filling with RANDOM will give each page a random color
    url: "https://example.com",
    title: "This is a test embed",
    author: {
        name: "Jaguar"
    },
    footer: {
        text: "Insert Footer Text Here"
    },
    description: "Insert long text here",
    image: "https://example.com/your_large_image.png",
    thumbnail: "https://example.com/your_small_thumbnail.png",
    
    allowStop: true, // enable if you want the stop button to appear used to stop the interactive process
    time: 300000, // the idle time after which you want to stop the interactive process
    ratelimit: 2 // ratelimit (in seconds) to prevent reaction spam, optional.
},
(embed) => {
    // this function will codeblock the whole description!
    embed.setDescription(`\`\`\`\n${embed.description}\n\`\`\``)
});

embed.start({
    channel: message.channel, // the channel in which you want to send the embed
    person: message.author    // use this if you only allow a specific person to control the reactions
});
```

# Example Eval Command!

```js
const EasyEmbedPages = require('easy-embed-pages');

async run(client, message, args) {
    const clean = text => ((typeof text === "string") ? text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)) : text);

    let output;
    let status = true;
    try {
        let evaled = eval(args.join(' '));
        if (evaled instanceof Promise) evaled = await evaled;
        else if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        
        output = clean(evaled).replace(new RegExp(client.token, 'g'), '[TOKEN REMOVED]');
    } catch (err) {
        status = false;
        output = err.toString();
    }
    
    const embed = new EasyEmbedPages(
        message.channel,
        {   
            color: status ? 'GREEN' : 'RED',
            title: "Eval response",
            description: output
        },
        (embed) => {
            embed.setDescription(`\`\`\`xl\n${embed.description}\n\`\`\``)
        }
    );
    embed.start({ user: message.author });
}
```