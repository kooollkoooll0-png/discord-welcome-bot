require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ]
});

client.once('ready', () => {
    console.log(`✅ تم تشغيل البوت بنجاح باسم: ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
    // 1. إعطاء الرتبة التلقائية
    const roleId = process.env.AUTO_ROLE_ID;
    if (roleId) {
        try {
            await member.roles.add(roleId);
            console.log(`✅ تم إعطاء الرتبة بنجاح للعضو: ${member.user.tag}`);
        } catch (error) {
            console.log(`❌ فشل إعطاء الرتبة، تأكد من صلاحيات رتبة البوت:`, error.message);
        }
    }

    // 2. إرسال رسالة الترحيب
    const channelId = process.env.WELCOME_CHANNEL_ID;
    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) {
        console.log("❌ لم يتم العثور على قناة الترحيب، تأكد من الـ ID.");
        return;
    }

    const welcomeEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`🎉 أهلاً بك في السيرفر!`)
        .setDescription(`مرحباً بك ${member} في **${member.guild.name}**!\nتم إعطاؤك الرتبة تلقائياً 🎉.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
            { name: '👤 العضو رقم:', value: `${member.guild.memberCount}`, inline: true },
            { name: '📅 تاريخ إنشاء الحساب:', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
        )
        .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() })
        .setTimestamp();

    channel.send({ content: `أهلاً بك ${member}!`, embeds: [welcomeEmbed] });
});

client.login(process.env.DISCORD_TOKEN);