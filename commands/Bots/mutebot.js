const { Command } = require('klasa');
var Manager = require('../../manage.js');
var modLog;
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'mutebot',
            runIn: ['text'],
            aliases: ["mute-bot", "botmute", "bot-mute"],
            permLevel: 6,
            botPerms: ["SEND_MESSAGES"],
            requiredSettings: [],
            description: "Mute a bot",
            usage: '(Member:member)'
        });
    }

    async run(message, [member]) {
        message.channel.send(`Enter a reason to mute \`${member.user.tag}\` (20s)`)
        let f = m => m.author.id === message.author.id;
        let mgs = await message.channel.awaitMessages(f, { max: 1, time: 20000, errors: ['time'] });

        mgs = mgs.first().content;
        if (mgs.toLowerCase() === "cancel") return message.channel.send(`Cancelled mute`)
        await member.roles.add(message.guild.roles.get(process.env.MUTED_ROLE_ID));
        await member.roles.remove(message.guild.roles.get(process.env.UNMUTED_ROLE_ID));
        message.channel.send(`Muted ${member.user}`)
        let o = await Manager.fetch(member.user.id)
        o = o.bot
        let e = new MessageEmbed()
            .setTitle('Bot Muted')
            .addField(`Bot`, `${member.user}`, true)
            .addField(`Owner`, `<@${o.owner}>`, true)
            .addField("Mod", message.author, true)
            .addField("Reason", mgs)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            .setColor(0xffaa00)
        let mg = await modLog.send(`<@${o.owner}>`);
        mg.delete();
        modLog.send(e)
    }

    async init() {
        modLog = this.client.guilds.get(process.env.GUILD_ID).channels.get(process.env.MOD_LOG_ID);
    }
};