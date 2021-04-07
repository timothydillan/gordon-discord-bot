// Load Discord module.
const Discord = require('discord.js');
var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Load .env configurations.
require('dotenv').config();

// Create new discord client instance.
const client = new Discord.Client();

// once our client is ready,
client.on('ready', () => {
    console.log('DAILY GORDON RAMSAY is ready');
    // Turn on rich presence.
    client.user.setStatus("online");
    client.user.setPresence({
        activity: {
            name: "Daily Gordon Ramsay",
            type: 'WATCHING',
            url: 'https://www.gordonramsay.com/'
        }
    });
    sendMessage();
});

client.on('message', (msg) => {
    // If a message was sent, and it contained g!yoman,
    if (msg.content === 'g!yoman') {
        // send a message
        msg.channel.send("Gordon Ramsay bot at your service. Will send an image of our one and only in a few seconds.");
        sendImage(msg.channel);
    } else if (msg.content === 'g!help') {
        msg.channel.send("To retrieve an image of Gordon, do `g!yoman`.");
    }
});

// Sends a gordon ramsay image every 30 minutes.
client.setInterval(sendImage, 1800000);

async function sendImage(cnl = null) {
    console.log('sendImage function triggered!');
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
    if (cnl === null) {
        await client.channels.cache.get('574454691811819521').send(embed);
    } else {
        await cnl.send(embed);
    }
    console.log('Results:', results);
};

async function sendMessage() {
    await client.channels.cache.get('574454691811819521').send("Gordon Ramsay bot ready. To retrieve an image of Gordon, do `g!yoman`.");
}

// Initiate our client with our bot.
client.login(process.env.BOT_TOKEN);