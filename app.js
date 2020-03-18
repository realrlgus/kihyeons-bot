const { token, prefix } = require("./config.json");
const search = require("./api.js");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");

const bot = new Discord.Client();
const setting = {
  connection: null
};
const player = (connection, videoId) => {
  return connection.play(
    ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
      filter: "audioonly"
    })
  );
};

let searchArr = [];
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
    setting.connection = null;
  }
  if (message.content.startsWith(`${prefix}search`)) {
    const searchMessage = message.content.replace(`${prefix}search`, "").trim();
    const result = await search(searchMessage);
    searchArr = result.map(item => {
      const { index, title, videoId } = item;
      message.reply(`${index + 1}.${title} - ${videoId}`);
      return videoId;
    });
  }

  if (message.content.startsWith(`${prefix}add`)) {
    if (searchArr.length < 1) {
      message.reply("검색을 먼저 해주세요!");
      return;
    }
    const playNumber = message.content.replace(`${prefix}add`, "").trim();

    const videoId = searchArr[parseInt(playNumber) - 1];
    videoIdArr.push(videoId);
    console.log(videoIdArr);
  }
  if (message.content.startsWith(`${prefix}play`)) {
    const videoId = videoIdArr.shift();
    if (setting.connection === null) {
      setting.connection = await message.member.voice.channel.join();
    }
    const play = player(setting.connection, videoId);
    play.on("end", () => {
      if (videoIdArr.length < 0) {
        message.member.voice.channel.leave();
        setting.connection = null;
      } else {
        player(setting.connection, videoIdArr.shift());
      }
    });
  }
  if (message.content.startsWith(`${prefix}skip`)) {
    if (setting.connection === null) {
      return;
    }
    console.log(setting.connection.dispatcher);
    setting.connection.dispatcher.end();
    console.log(setting.connection.dispatcher);
    if (videoIdArr.length < 0) {
      const videoId = videoIdArr.shift();

      const play = player(setting.connection, videoId);
      play.on("end", () => {
        if (videoIdArr.length < 0) {
          message.member.voice.channel.leave();
          setting.connection = null;
        } else {
          player(setting.connection, videoIdArr.shift());
        }
      });
    }
  }
});
