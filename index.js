// Load Discord module.
const Discord = require('discord.js');
var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: false,
        safe: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    },
});

// Load .env configurations.
require('dotenv').config();

// Create new discord client instance.
const client = new Discord.Client();

// Find the general channel.
const channel = client.channels.cache.find(channel => channel.name === "general")

// once our client is ready,
client.on('ready', () => {
    console.log('DAILY GORDON RAMSAY is ready');
    // Turn on rich presence.
    client.user.setStatus("online");
    client.user.setPresence({
        activity: {
            name: "Daily Gordon Ramsay",
            type: 'YOMAN',
            url: 'https://www.gordonramsay.com/'
        }
    });
});

client.on('message', (msg) => {
    // If a message was sent, and it contained g!yoman,
    if (msg.content === 'g!yoman') {
        // send a message
        msg.channel.send("YOOOOOMAN GORDON RAMSAY BOT READY, HERE'S A GORDON RAMSAY IMAGE");
        sendImage(msg.channel);
    }
});

// Sends a gordon ramsay image every 30 minutes.
client.setInterval(sendImage, 1800000);

async function sendImage(cnl = channel) {
    // Get 150 images of gordon ramsay
    const results = await google.scrape('gordon ramsay', 150);
    // Get 1 random image from the results
    const random = Math.floor(Math.random() * results.length - 1);
    const embed = new Discord.MessageEmbed()
        // Set the title of the field
        .setTitle(results[random].title)
        // Set the color of the embed
        .setColor(0xff0000)
        // Set the main content of the embed
        .setImage(results[random].url)
        .setTimestamp()
        .setFooter('SENT WITH LOVE BY GORDON', results[random].url);
    // Send the embed to the same channel as the message
    cnl.send(embed);
    console.log('results', results);
};

// Initiate our client with our bot.
client.login(process.env.BOT_TOKEN);