const { token, prefix } = require("./config.json");
const Discord = require("discord.js");

const bot = new Discord.Client();

bot.login(token);

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", async message => {
  if (!message.guild) return;

  if (message.content.startsWith(`${prefix}join`)) {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play("./music/test.flac", {
        volume: 0.5
      });
    } else {
      message.reply("음성 채널에 먼저 접속해주세요");
    }
  }
  if (message.content.startsWith(`${prefix}quit`)) {
    message.member.voice.channel.leave();
  }
});
