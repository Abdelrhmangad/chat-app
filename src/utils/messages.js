const generateMessage = (username, text) => {
   return {
      username,
      text,
      createdAt: new Date().getTime()
   }
};

const generateLocationaMessage = (username, url) => {
   return {
      username,
      url: url,
      createdAt: new Date().getTime()
   }
}

module.exports = {
   generateMessage,
   generateLocationaMessage
}
//done