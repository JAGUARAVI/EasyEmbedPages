# EasyEmbedPages
### A fully custmoizable and module for easy interactive discord embeds with dynamic pages!

This module is used to make *hassle-free* embeds with different pages... This module is **fully customizable** and each property of each page can be changed!
The description of the embed gets dynamically carried over to a different page if it exceed **2000 chars**


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
const embed = new EasyEmbedPages(message.channel,{
    //Here you can add any thing **except embed fields** that can be added in a regular discord embed in json format
    color: '#ff00ff',
    url:'https://example.com',
    title: "Simple Embed",
    description: "Indert...Very...Very...Long...Text...Here"
});

embed.start(); //sends the embed in the specified channel and starts the interactive process
```

### Usage with custom fields and other things for each page
Note: If you specify pages in pages which are more than the dynamic content pages, they will be added as extra pages!
```js
const embed = new EasyEmbedPages(message.channel,{
    pages: [
        {fields:[{name: "Custom field yay!", value: "Yikes... I love this module!", inline: false}]},
        {title: "This page has a custom title!", description: "And a custom description field too!"}
    ],
    color: '#ff00ff',
    url:'https://example.com',
    title: "Simple Embed",
    description: "Indert...Very...Very...Long...Text...Here"
});

embed.start();
```
### Using premade embeds
Note: You can use you premade Discord#MessageEmbed this way
```js
/*
const myEmbed1 = new Discord.MessageEmbed().........
const myEmbed2 = new Discord.MessageEmbed().........
*/

const embed = new EasyEmbedPages(message.channel,{
    pages: [
        myEmbed1.toJSON(),
        myEmbed2.toJSON(),
    ],
});

embed.start();
```

### Advanced Usage
Full cranked up usage!
```js
const embed = new EasyEmbedPages(message.channel,{
    //embed fields
    
    pages: [
        {title: "Hello World!", color: "#00ffff", author: {name: "Jaguar"}}, 
        //this will override the default values
        //here in pages you can fill any field which you fill in a regular MessageEmbed
        {fields: [{name: "My field", value: "My value", inline: true}], thumbnail: "https://example.com/my_other_image.png"} 
        //although fields can only be filled here only... i.e. only in pages
        //DO NOT USE - field ... always use fields
    ],
    color: 'RANDOM', //here you can fill any Discord ColorResolvable... RANDOM will give each page a random color
    url: "https://example.com",
    title: "This is a test embed",
    author: {name: "Jaguar"},
    footer: {text: "Insert Footer Text Here"},
    description: "Your....Very....Long....Content",
    image: "https://example.com/your_large_image.png",
    thumbnail: "https://example.com/your_small_thumbnail.png",
    
    //custom options
    allowStop: true, //enable if you want the stop button to appear used to stop the interactive process
    time: 300000, //the idle time after which you want to stop the interactive process
});

embed.start({
    channel: message.channel, //the channel in which you want to send the embed
    person: message.author    //use this if you only want to allow a single person to be able to access the embed reactions control
});
```