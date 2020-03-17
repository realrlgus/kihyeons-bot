const { key } = require("./config.json");
const axios = require("axios");
const baseUrl = `https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&type=video&maxResults=2`;

const search = async message => {
  let titleArr = [];
  message = encodeURIComponent(message);
  const request = await axios({
    method: "get",
    url: `${baseUrl}&q=${message}`,
    responseType: "json"
  }).then(res => {
    const {
      data: { items }
    } = res;
    titleArr = items.map((item, index) => {
      const {
        snippet: { title },
        id: { videoId }
      } = item;
      return { title, videoId };
    });
  });
  return titleArr;
};

module.exports = search;
