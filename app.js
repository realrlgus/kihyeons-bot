const { token, prefix } = require("./config.json");
const search = require("./api.js");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");

const bot = new Discord.Client();
let videoIdArr = [];

bot.login(token);

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", async message => {
  if (!message.guild) return;

  if (message.content.startsWith(`${prefix}join`)) {
    if (message.member.voice.channel) {
    } else {
      message.reply("음성 채널에 먼저 접속해주세요");
    }
  }
  if (message.content.startsWith(`${prefix}quit`)) {
    message.member.voice.channel.leave();
  }
  if (message.content.startsWith(`${prefix}search`)) {
    const searchMessage = message.content.replace(`${prefix}search`, "").trim();
    const result = await search(searchMessage);
    videoIdArr = result.map(item => {
      const { title, videoId } = item;
      message.reply(`${title} - ${videoId}`);
      return videoId;
    });
  }

  if (message.content.startsWith(`${prefix}play`)) {
    if (videoIdArr.length < 0) {
      message.reply("검색을 먼저 해주세요!");
      return;
    }
    const connection = await message.member.voice.channel.join();
    const playNumber = message.content.replace(`${prefix}play`, "").trim();

    const videoId = videoIdArr[playNumber];

    connection.play(
      ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
        filter: "audioonly"
      })
    );
  }
});
