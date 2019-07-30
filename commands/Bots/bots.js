const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
var Manager = require('../../manage.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'bots',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: ["SEND_MESSAGES"],
            requiredSettings: [],
            description: "Check what bots you have here.",
            quotedStringSupport: false,
            usage: '(User:user)',
            usageDelim: undefined,
            extendedHelp: ""
        });

        this.createCustomResolver('user', (arg, possible, message) => {
            if (!arg || arg === '') return undefined;
            return this.client.arguments.get('user').run(arg, possible, message);
        });
    }

    async run(message, [user]) {
        let person = user ? user : message.author;
        Manager.mine(person.id).then(bts => {
            if (bts.length === 0) return message.channel.send(`You have no bots. Add one at ${process.env.DOMAIN}.`)
            var cont = ``
            var un = false;
            for (let i = 0; i < bts.length; i++) {
                let bot = bts[i];
                if (bot.state == "unverified") {
                    un = true
                    cont += `~~<@${bot.id}>~~\n`
                } else cont += `<@${bot.id}>\n`
            }
            let e = new MessageEmbed()
                .setTitle(`${person.username}#${person.discriminator}'s bots`)
                .setDescription(cont)
                .setColor(0x6b83aa)
            if (un) e.setFooter(`Bots with strikethrough are unverified.`)
            message.channel.send(e)
        })
    }

};